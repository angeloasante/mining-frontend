# MineWatch Ghana - Frontend

Interactive satellite dashboard for monitoring illegal mining (galamsey) activity in Ghana. Built with Next.js 15, MapLibre GL, and Google Earth Engine.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![MapLibre GL](https://img.shields.io/badge/MapLibre%20GL-4-orange)](https://maplibre.org)

## Live Demo

**Dashboard**: [frontend-bd1xwvob8-travis-s-project.vercel.app](https://frontend-bd1xwvob8-travis-s-project.vercel.app)

## Features

- **Interactive Globe Map** - Satellite imagery with MapLibre GL globe projection
- **Historical Comparison** - Side-by-side slider comparing 2016-2025 imagery via GEE
- **Detection Visualization** - Mining sites shown as pulsing red circles with confidence levels
- **Multiple Basemaps** - ESRI Satellite, Google Satellite, Google Hybrid
- **City/Country Labels** - CartoDB dark labels overlay for geographic context
- **Filter Panel** - Filter detections by confidence threshold
- **API Endpoints** - RESTful APIs for detections, alerts, and health monitoring

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Mapping**: MapLibre GL JS
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Tile Server**: Railway (Google Earth Engine proxy)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/angeloasante/mining-frontend.git
cd mining-frontend
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_TILE_SERVER_URL=https://minningbackend-production.up.railway.app
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/detections` | GeoJSON detection data with filtering |
| `/api/alerts` | NAIMOS-compatible alert feed |
| `/api/health` | Health check endpoint |

## Deployment

```bash
npm i -g vercel
vercel --prod
```

## Related Repositories

- **Main Project**: [angeloasante/Minning_detection](https://github.com/angeloasante/Minning_detection)

## Credits

- **Developers**: Travis Moore, Angelo Asante
- **Satellite Data**: Copernicus Sentinel-2 via Google Earth Engine
- **Labels**: CARTO dark labels overlay

## License

MIT License
