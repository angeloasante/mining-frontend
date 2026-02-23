import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    detection_data: ServiceStatus;
    tile_server: ServiceStatus;
    last_detection_run: ServiceStatus;
  };
  version: string;
}

interface ServiceStatus {
  status: 'ok' | 'warning' | 'error';
  message: string;
  last_checked?: string;
}

/**
 * GET /api/health
 * 
 * Health check endpoint for monitoring and uptime services
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verbose = searchParams.get('verbose') === 'true';

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      detection_data: await checkDetectionData(),
      tile_server: await checkTileServer(),
      last_detection_run: await checkLastDetectionRun(),
    },
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  };

  // Determine overall status
  const statuses = Object.values(health.services);
  if (statuses.some(s => s.status === 'error')) {
    health.status = 'unhealthy';
  } else if (statuses.some(s => s.status === 'warning')) {
    health.status = 'degraded';
  }

  if (!verbose) {
    return NextResponse.json({
      status: health.status,
      timestamp: health.timestamp,
    });
  }

  return NextResponse.json(health);
}

async function checkDetectionData(): Promise<ServiceStatus> {
  try {
    const paths = [
      path.join(process.cwd(), 'public', 'data', 'latest_detections.geojson'),
      path.join(process.cwd(), 'public', 'ghana_tarkwa_mining_wgs84.geojson'),
    ];

    for (const filePath of paths) {
      try {
        const stats = await fs.stat(filePath);
        const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
        
        if (ageHours > 168) { // Over 7 days old
          return {
            status: 'warning',
            message: `Detection data is ${Math.round(ageHours / 24)} days old`,
            last_checked: stats.mtime.toISOString(),
          };
        }
        
        return {
          status: 'ok',
          message: 'Detection data available',
          last_checked: stats.mtime.toISOString(),
        };
      } catch {
        continue;
      }
    }

    return {
      status: 'error',
      message: 'No detection data found',
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to check detection data: ${(error as Error).message}`,
    };
  }
}

async function checkTileServer(): Promise<ServiceStatus> {
  const tileServerUrl = process.env.TILE_SERVER_URL || 'http://localhost:5001';
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${tileServerUrl}/health`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (response.ok) {
      return {
        status: 'ok',
        message: 'Tile server is running',
      };
    }

    return {
      status: 'warning',
      message: `Tile server returned ${response.status}`,
    };
  } catch (error) {
    // In production, tile server might be on a different domain
    if (process.env.NODE_ENV === 'production') {
      return {
        status: 'warning',
        message: 'Tile server check skipped in production',
      };
    }
    return {
      status: 'warning',
      message: 'Tile server not reachable (may be expected in some environments)',
    };
  }
}

async function checkLastDetectionRun(): Promise<ServiceStatus> {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'data', 'detection_metadata.json');
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(content);
      
      const lastRun = new Date(metadata.last_run);
      const ageHours = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
      
      if (ageHours > 168) { // Over 7 days
        return {
          status: 'warning',
          message: `Last detection run was ${Math.round(ageHours / 24)} days ago`,
          last_checked: metadata.last_run,
        };
      }
      
      return {
        status: 'ok',
        message: `Last run: ${metadata.last_run}`,
        last_checked: metadata.last_run,
      };
    } catch {
      return {
        status: 'warning',
        message: 'No detection run metadata found',
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to check detection run: ${(error as Error).message}`,
    };
  }
}
