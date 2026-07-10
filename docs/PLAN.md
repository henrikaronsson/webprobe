# WebProbe — Implementation Plan

> Explore what the modern web platform can do.

WebProbe is a modern, dependency-light, pure TypeScript web application for exploring browser APIs, detecting capabilities, running local benchmarks, and providing interactive demos plus a curated developer resource catalog.

This document is the authoritative implementation plan. See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical design details.

---

## 1. Repository Assessment

| Area            | Current state             |
| --------------- | ------------------------- |
| Source code     | None — greenfield project |
| Git             | Not initialized           |
| Package manager | Not configured            |
| Build tooling   | None                      |
| Tests / CI      | None                      |
| Documentation   | This planning pass        |

**Implication:** The first deliverable is planning documentation. Application scaffolding follows only after these docs are accepted. No framework, backend, or database assumptions exist in the repo yet.

---

## 2. Recommended Technical Stack

| Layer           | Choice                                   | Rationale                                               |
| --------------- | ---------------------------------------- | ------------------------------------------------------- |
| Language        | TypeScript (strict)                      | Strong typing for capability models and project clarity |
| Build           | Vite                                     | Fast dev server, native ESM, static output              |
| UI              | Semantic HTML + modern CSS               | No Angular, React, or Vue                               |
| Components      | Web Components sparingly                 | Only where encapsulation clearly helps                  |
| Package manager | npm                                      | Widely understood, minimal ceremony                     |
| Linting         | ESLint (flat config) + typescript-eslint | Consistent code quality                                 |
| Formatting      | Prettier                                 | Low-friction formatting                                 |
| Unit tests      | Vitest                                   | Fast, Vite-native                                       |
| E2E tests       | Playwright (Chromium first)              | Real browser validation                                 |
| Hosting         | Static only                              | Simple static file serving                              |

### Dependency list (recommended)

**Production:** none beyond the Vite-built application bundle.

**Development:**

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^6.x",
    "eslint": "^9.x",
    "typescript-eslint": "^8.x",
    "prettier": "^3.x",
    "vitest": "^3.x",
    "@vitest/coverage-v8": "^3.x",
    "playwright": "^1.x",
    "@playwright/test": "^1.x"
  }
}
```

Defer `@vitejs/plugin-basic-ssl` until an HTTPS-only API demo requires it locally.

---

## 3. Architecture (summary)

Feature-based folders with a thin app shell. Product areas are independent modules connected through registries and a small router.

```text
src/
├── app/                 # shell, router, navigation, layout
├── capabilities/        # registry, detectors, pages
├── labs/                # manifests, lazy lab modules
├── benchmarks/          # manifests, runner, pages
├── links/               # curated catalog, filters
├── browser/             # My Browser probes and model
├── components/          # small reusable DOM/Web Component helpers
├── shared/              # types, utilities, formatting
└── styles/              # tokens, themes, global CSS
```

Full design: [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 4. Routing Approach

- **Hash-based router** for MVP (`#/capabilities`, `#/labs/worker-benchmark`, etc.).
- Compatible with simple static hosts without server rewrites.
- Data-driven route table mapping path patterns to lazy render functions.
- URL query params for filters (e.g. `#/links?category=performance`).
- No router library until requirements clearly exceed a ~100-line internal router.

---

## 5. Rendering Strategy

- Plain TypeScript functions that mount DOM into a root element.
- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`.
- Small helpers for element creation, event binding with cleanup, and page lifecycle — not a framework.
- Web Components only for repeated interactive widgets (status badges, result panels) if duplication warrants it.
- Labs and benchmarks own their DOM subtrees; the shell provides layout and navigation only.

---

## 6. State Management Strategy

| State type          | Where it lives                                     |
| ------------------- | -------------------------------------------------- |
| Page UI state       | Local to page/lab module                           |
| Filters / selection | URL hash query params                              |
| User preferences    | `localStorage` (theme, benchmark size)             |
| Capability results  | Computed on demand, not cached globally            |
| Benchmark results   | Local to benchmark run, optional copy/export later |

No global store for MVP. Avoid Redux-like patterns, signals libraries, or reactive frameworks.

---

## 7. Capability Detection Model

Each capability exposes metadata plus a `detect()` function returning explicit uncertainty:

```ts
type CapabilityStatus = 'supported' | 'unsupported' | 'unknown';
type Confidence = 'detected' | 'inferred' | 'approximated' | 'unavailable';

interface CapabilityResult {
  status: CapabilityStatus;
  confidence: Confidence;
  summary: string;
  notes?: string[];
}
```

Registry fields: `id`, `title`, `description`, `category`, `docsUrl`, `notes`, optional `labId`, `detect()`.

**Principles:**

- Report what can be reliably probed; mark the rest `unknown`.
- Distinguish API presence from full feature support.
- Link to MDN or spec docs; link to internal labs when available.
- Never present detection as a compatibility guarantee.

### First 5 capabilities

| ID                    | Detection approach                                             |
| --------------------- | -------------------------------------------------------------- |
| `webgpu`              | `'gpu' in navigator` → supported; note adapter/feature caveats |
| `web-workers`         | `typeof Worker !== 'undefined'`                                |
| `indexeddb`           | `'indexedDB' in window`                                        |
| `opfs`                | `navigator.storage?.getDirectory` is a function                |
| `compression-streams` | `typeof CompressionStream !== 'undefined'`                     |

---

## 8. Lab Manifest Model

Labs are manifest-driven, lazy-loaded, and isolated. Not a plugin marketplace.

```ts
interface LabManifest {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredCapabilities: string[];
  route: string;
  docs: { title: string; url: string }[];
  load: () => Promise<LabModule>;
}

interface LabModule {
  mount(container: HTMLElement, context: LabContext): () => void;
}
```

`mount` returns a cleanup function. Labs check required capabilities on entry and render clear unsupported states.

### First 3 labs

1. **Main thread vs Web Worker** — CPU-bound loop on main thread vs worker; shows blocking difference.
2. **IndexedDB read/write** — transparent small-record throughput test with clear dataset size.
3. **Compression Streams demo** — compress/decompress a text sample with size and timing readout.

---

## 9. Benchmark Runner Design

Transparent, local, cancellable benchmarks. No universal performance scores.

**Runner responsibilities:**

- Configurable warmup and measured iterations
- Timing via `performance.now()`
- Cancellation via `AbortSignal`
- Attach environment snapshot (user agent, cores, timestamp)
- Display units, raw values, percentiles where useful, and explicit limitations

**Result shape:**

```ts
interface BenchmarkResult {
  name: string;
  unit: string;
  values: number[];
  median: number;
  p95?: number;
  iterations: number;
  durationMs: number;
  notes: string[];
  environment: Record<string, string | number | undefined>;
}
```

### First benchmark

**Worker round-trip overhead** — spawn a worker, exchange `postMessage` payloads N times, measure per-round-trip latency. Clearly note that results reflect messaging overhead, not general CPU performance.

---

## 10. Curated Links Data Model

Static typed catalog in `src/links/catalog.ts` (JSON import later if preferred).

```ts
interface CuratedLink {
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  tags: string[];
  official: boolean;
  featured?: boolean;
}
```

Validation tests enforce: no duplicate URLs, non-empty descriptions, and bounded catalog growth.

### First link categories

- Browser APIs
- TypeScript
- Performance
- Accessibility
- Testing
- CSS
- Security
- Developer tools

Target ~3–8 links per category at launch; quality over quantity.

---

## 11. Browser Information Model

Privacy-aware runtime overview. Every field carries a confidence label.

```ts
interface BrowserInfoField<T> {
  label: string;
  value: T | null;
  confidence: Confidence;
  source: string;
  notes?: string;
}
```

**Collect when genuinely available:**

- Platform (`navigator.platform` / userAgentData)
- Logical CPU count (`navigator.hardwareConcurrency`)
- Approximate memory (`navigator.deviceMemory` — Chromium, approximated)
- Viewport and screen dimensions
- Device pixel ratio
- Network information (`navigator.connection` — when exposed)
- Storage estimate (`navigator.storage.estimate()`)
- Capability summary from registry

**Do not:** fingerprint, score entropy, probe hidden APIs, or send data remotely.

---

## 12. Accessibility Strategy

- Semantic HTML and ARIA only where native semantics are insufficient.
- Full keyboard navigation for nav, filters, lab controls, and benchmark start/stop.
- Visible focus indicators; sufficient color contrast in light and dark themes.
- `prefers-reduced-motion` respected; no essential information conveyed by motion alone.
- Clear unsupported/empty states with actionable text.
- Playwright smoke tests for tab order and critical flows.

---

## 13. Privacy Considerations

- No analytics, telemetry, backend, auth, or database in MVP.
- All probes run locally; results stay in the browser unless the user copies them.
- `My Browser` page includes a short fingerprinting disclaimer.
- Label detected vs inferred vs approximated values prominently.
- Avoid encouraging users to share full browser profiles publicly.

---

## 14. Testing Strategy

| Tool       | Scope                                                                                   |
| ---------- | --------------------------------------------------------------------------------------- |
| Vitest     | Detectors (mocked globals), link validation, benchmark math, browser info normalization |
| Playwright | App boot, routing, keyboard nav, one lab happy path, one benchmark happy path           |

Start with Chromium for local E2E coverage. Expand browser coverage post-MVP if it becomes useful.

---

## 15. Verification Strategy

Use local npm scripts as the project quality gate:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run format:check`
5. `npm test` (Vitest)
6. `npx playwright test` (Chromium)
7. `npm run build`

No hosted CI is required for the simplified baseline.

---

## 16. Deployment Strategy

| Target         | Approach                                            |
| -------------- | --------------------------------------------------- |
| Static hosting | Serve `dist/` as plain static files                 |
| Local preview  | `npm run build && npm run preview`                  |
| Subdirectory   | Set Vite `BASE_PATH` only when the host requires it |

Hash routing avoids `404` issues on static hosts without rewrite rules.

---

## 17. Repository Baseline

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `README.md`            | Purpose, tagline, quick start, MVP status  |
| `LICENSE`              | MIT (recommended)                          |
| `SECURITY.md`          | Vulnerability reporting, privacy stance    |
| `AGENTS.md`            | Concise guide for AI coding agents         |
| `docs/PLAN.md`         | This document                              |
| `docs/ARCHITECTURE.md` | Technical architecture                     |
| `docs/adr/`            | Lightweight ADRs for significant decisions |

---

## 18. Recommended MVP Scope

### In scope

- App shell: nav, responsive layout, dark/light theme, hash routing
- Overview landing page
- Capabilities index + 5 capability detail pages
- Labs index + 3 labs
- Benchmarks page + worker round-trip benchmark
- Links page with 8 categories, ~30–50 curated links
- My Browser page with confidence-labeled fields
- Vitest + Playwright smoke tests
- Local verification scripts and static build

### Out of scope (MVP)

- WebGPU rendering lab
- WebRTC / WebSocket tools
- Service worker offline shell
- Backend, auth, database, analytics
- User accounts or saved results sync
- Browser extension
- Custom component library

---

## 19. Post-MVP Roadmap

**Near term**

- WebGPU experiment lab
- OPFS file I/O benchmark
- Canvas vs OffscreenCanvas experiment
- Browser storage explorer
- View Transitions demo
- JavaScript vs WebAssembly benchmark (small transparent fixture)

**Medium term**

- Additional capabilities (WebCodecs, WebRTC, Web Bluetooth, etc.) with documented detection limits
- Copy/export for benchmark and browser info results
- Optional History API routing behind hosting rewrite config
- Firefox/WebKit Playwright coverage if cross-browser risk grows

**Long term**

- Community lab contributions with manifest checklist
- PWA installability (only if offline value is clear)
- Localization (only if clear demand exists)

---

## 20. Risks and Overengineering Traps

| Risk                               | Mitigation                                                       |
| ---------------------------------- | ---------------------------------------------------------------- |
| Custom frontend framework          | Cap helpers at ~50 lines; no virtual DOM, no templating language |
| Plugin marketplace                 | Manifest + dynamic import only; no runtime plugin loading        |
| Global state store                 | Local state + URL + preferences                                  |
| Overconfident capability detection | `unknown` status, confidence labels, notes                       |
| Fake benchmark scores              | Raw numbers, units, caveats                                      |
| Link dump growth                   | PR review + validation tests + category caps                     |
| Web Components everywhere          | Use only for 2–3 repeated widgets                                |
| Premature backend                  | Stay static until a feature truly needs server support           |

---

## Clear Recommendations

### MVP scope

Ship the shell, 5 capabilities, 3 labs, 1 benchmark, curated links, and My Browser. That is enough to demonstrate the product vision without overbuilding.

### Folder structure

Use the `src/` layout in section 3. Keep `app/` thin; put product logic in feature folders.

### Dependency list

TypeScript, Vite, ESLint, Prettier, Vitest, Playwright — dev only. Zero production npm dependencies for MVP.

### Implementation order

1. **Planning docs** — `docs/PLAN.md`, `docs/ARCHITECTURE.md`, ADRs (this step)
2. **Project scaffold** — git init, npm, Vite, TypeScript strict, ESLint, Prettier, Vitest, Playwright
3. **App shell** — layout, theme toggle, hash router, navigation
4. **Shared types** — capability, lab, benchmark, link, browser info models
5. **Capabilities** — registry + 5 detectors + index/detail pages
6. **Labs** — manifest system + first lab, then remaining two
7. **Benchmarks** — runner + worker round-trip benchmark
8. **Links** — catalog data + filtered list page + validation tests
9. **My Browser** — probes + confidence-labeled display
10. **Repository baseline** — README, LICENSE, SECURITY, AGENTS, and docs
11. **Local verification** — formatting, linting, tests, and static build

Do not start full feature implementation until planning documents are reviewed and accepted.
