export interface MiningDetection {
  type: "Feature";
  properties: {
    lat: number;
    lon: number;
    probability: number;
    tile?: string;
    region?: string;
    detected_at?: string;
    model_version?: string;
    area_ha?: number;
    is_licensed?: boolean;
    location_name?: string; // Reverse geocoded location
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface MiningGeoJSON {
  type: "FeatureCollection";
  name?: string;
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: MiningDetection[];
  metadata?: {
    generated_at?: string;
    model_version?: string;
    regions?: string[];
    total_detections?: number;
  };
}
