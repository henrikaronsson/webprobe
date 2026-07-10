# WebProbe

> Explore what the modern web platform can do.

WebProbe is a dependency-light, pure TypeScript web application for exploring browser APIs, detecting capabilities, running local benchmarks, and browsing curated developer resources.

No Angular. No React. No Vue. No backend.

## Features

- **Capabilities** — detect support for modern browser APIs with honest uncertainty labels
- **Labs** — interactive, lazy-loaded browser experiments
- **Benchmarks** — small, transparent local benchmarks with clear limitations
- **Links** — curated, opinionated developer resource catalog
- **My Browser** — privacy-aware runtime overview

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start Vite dev server              |
| `npm run build`    | Typecheck and build for production |
| `npm run preview`  | Preview production build           |
| `npm test`         | Run Vitest unit tests              |
| `npm run test:e2e` | Run Playwright tests               |
| `npm run lint`     | ESLint                             |
| `npm run format`   | Prettier write                     |

## Documentation

- [Implementation plan](docs/PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Agent guide](AGENTS.md)

## License

MIT — see [LICENSE](LICENSE).
