import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface AlertStats {
  period: string;
  new_detections: number;
  high_risk_sites: number;
  area_affected_ha: number;
  regions_affected: string[];
}

interface Detection {
  properties: {
    probability: number;
    lat: number;
    lon: number;
    detected_at?: string;
    region?: string;
    area_ha?: number;
    is_licensed?: boolean;
    previous_detection?: boolean;
  };
}

/**
 * GET /api/alerts
 * 
 * Returns alert-ready data for NAIMOS (National Integrated Mining Operations Monitoring System)
 * 
 * Query Parameters:
 * - period: "daily", "weekly", "monthly" (default: "weekly")
 * - format: "json" (default), "csv", "naimos"
 * - severity: "critical", "high", "medium", "all" (default: "all")
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly';
    const format = searchParams.get('format') || 'json';
    const severity = searchParams.get('severity') || 'all';

    // Load detection data
    const dataPath = path.join(process.cwd(), 'public', 'data', 'latest_detections.geojson');
    let data;
    
    try {
      const fileContents = await fs.readFile(dataPath, 'utf-8');
      data = JSON.parse(fileContents);
    } catch {
      // Fallback to legacy file
      const legacyPath = path.join(process.cwd(), 'public', 'ghana_tarkwa_mining_wgs84.geojson');
      const fileContents = await fs.readFile(legacyPath, 'utf-8');
      data = JSON.parse(fileContents);
    }

    const features = data.features as Detection[];

    // Filter by severity
    let filteredFeatures = features;
    if (severity === 'critical') {
      filteredFeatures = features.filter(f => f.properties.probability >= 0.95);
    } else if (severity === 'high') {
      filteredFeatures = features.filter(f => f.properties.probability >= 0.85);
    } else if (severity === 'medium') {
      filteredFeatures = features.filter(f => f.properties.probability >= 0.7);
    }

    // Calculate new detections (those not previously flagged)
    const newDetections = filteredFeatures.filter(f => !f.properties.previous_detection);

    // Calculate stats
    const stats: AlertStats = {
      period,
      new_detections: newDetections.length,
      high_risk_sites: filteredFeatures.filter(f => f.properties.probability >= 0.9).length,
      area_affected_ha: filteredFeatures.reduce((sum, f) => sum + (f.properties.area_ha || 0.5), 0),
      regions_affected: [...new Set(filteredFeatures.map(f => f.properties.region).filter(Boolean))] as string[],
    };

    // Format response based on requested format
    if (format === 'naimos') {
      // NAIMOS-compatible format for government integration
      return NextResponse.json({
        report_type: 'ILLEGAL_MINING_ALERT',
        report_id: `MWA-${Date.now()}`,
        generated_at: new Date().toISOString(),
        reporting_period: period,
        summary: {
          total_sites_detected: filteredFeatures.length,
          new_sites_this_period: stats.new_detections,
          critical_alerts: filteredFeatures.filter(f => f.properties.probability >= 0.95).length,
          estimated_area_hectares: Math.round(stats.area_affected_ha),
        },
        sites: filteredFeatures.map((f, idx) => ({
          site_id: `SITE-${String(idx + 1).padStart(4, '0')}`,
          coordinates: {
            latitude: f.properties.lat,
            longitude: f.properties.lon,
          },
          confidence_score: Math.round(f.properties.probability * 100),
          severity: getSeverity(f.properties.probability),
          region: f.properties.region || 'Unknown',
          estimated_area_ha: f.properties.area_ha || 0.5,
          license_status: f.properties.is_licensed ? 'LICENSED' : 'UNLICENSED',
          detection_date: f.properties.detected_at || new Date().toISOString(),
          recommended_action: getRecommendedAction(f.properties.probability, f.properties.is_licensed),
        })),
        agency_contacts: {
          minerals_commission: '+233-302-778900',
          environmental_protection: '+233-302-664697',
          forestry_commission: '+233-302-221315',
        },
      });
    }

    if (format === 'csv') {
      const csv = generateCSV(filteredFeatures);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=minewatch_alerts_${period}_${Date.now()}.csv`,
        },
      });
    }

    // Default JSON response
    return NextResponse.json({
      generated_at: new Date().toISOString(),
      period,
      stats,
      alerts: filteredFeatures.map(f => ({
        coordinates: [f.properties.lon, f.properties.lat],
        confidence: f.properties.probability,
        severity: getSeverity(f.properties.probability),
        region: f.properties.region,
        is_new: !f.properties.previous_detection,
      })),
    });

  } catch (error) {
    console.error('Error generating alerts:', error);
    return NextResponse.json(
      { error: 'Failed to generate alerts', message: (error as Error).message },
      { status: 500 }
    );
  }
}

function getSeverity(probability: number): string {
  if (probability >= 0.95) return 'CRITICAL';
  if (probability >= 0.85) return 'HIGH';
  if (probability >= 0.70) return 'MEDIUM';
  return 'LOW';
}

function getRecommendedAction(probability: number, isLicensed?: boolean): string {
  if (isLicensed) return 'VERIFY_LICENSE_COMPLIANCE';
  if (probability >= 0.95) return 'IMMEDIATE_FIELD_VERIFICATION_REQUIRED';
  if (probability >= 0.85) return 'PRIORITY_INSPECTION_WITHIN_48_HOURS';
  if (probability >= 0.70) return 'SCHEDULE_ROUTINE_INSPECTION';
  return 'MONITOR_AND_REASSESS';
}

function generateCSV(features: Detection[]): string {
  const headers = [
    'Site ID',
    'Latitude',
    'Longitude',
    'Confidence %',
    'Severity',
    'Region',
    'License Status',
    'Detection Date',
    'Recommended Action',
  ];

  const rows = features.map((f, idx) => [
    `SITE-${String(idx + 1).padStart(4, '0')}`,
    f.properties.lat.toFixed(6),
    f.properties.lon.toFixed(6),
    Math.round(f.properties.probability * 100),
    getSeverity(f.properties.probability),
    f.properties.region || 'Unknown',
    f.properties.is_licensed ? 'LICENSED' : 'UNLICENSED',
    f.properties.detected_at || new Date().toISOString().split('T')[0],
    getRecommendedAction(f.properties.probability, f.properties.is_licensed),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
