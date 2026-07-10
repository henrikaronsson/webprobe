# AGENTS.md — Guide for AI coding agents

WebProbe is a framework-free TypeScript + Vite static web app. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before making changes.

## Key rules

- Do **not** add Angular, React, Vue, or a state management library
- Do **not** add a backend, auth, or database unless explicitly requested
- Keep modules small and feature-based
- Prefer native browser APIs over npm dependencies
- Use hash routing (`#/path`) — see ADR 002

## Where to add things

| Task              | Location                                     |
| ----------------- | -------------------------------------------- |
| Capability        | `src/capabilities/detectors/`, `registry.ts` |
| Lab               | `src/labs/<id>/`, `registry.ts`              |
| Benchmark         | `src/benchmarks/`, `registry.ts`             |
| Link              | `src/links/catalog.ts`                       |
| Shared DOM helper | `src/shared/dom.ts`                          |
| Route             | `src/app/routes.ts`                          |

## Patterns

- Pages export `render(container): () => void` cleanup function
- Labs export `LabModule` with `mount(container, context)`
- Capability detection returns `{ status, confidence, summary }`
- Detail pages get params via `getRouteParams(routes)` from `route-utils.ts`

## Testing

- Vitest for pure logic: `tests/unit/`
- Playwright for flows: `tests/e2e/`
- Run `npm test`, `npm run lint`, `npm run build` before finishing

## Avoid

- Custom frontend frameworks
- Global state stores
- Plugin marketplaces
- Overconfident capability detection
- Bookmark-dump link catalogs
