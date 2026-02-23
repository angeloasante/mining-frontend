export interface MiningDetection {
  type: "Feature";
  properties: {
    lat: number;
    lon: number;
    probability: number;
    tile: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface MiningGeoJSON {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: MiningDetection[];
}
