# Contributing to WebProbe

Thank you for your interest in contributing. WebProbe is designed to be approachable for both humans and AI coding agents.

## Getting started

1. Fork and clone the repository
2. `npm install`
3. `npm run dev` for local development
4. `npm test` and `npm run lint` before submitting a PR

## Adding a capability

1. Create a detector in `src/capabilities/detectors/<id>.ts`
2. Register it in `src/capabilities/registry.ts`
3. Be honest about detection limits — use `unknown` when unsure
4. Add a unit test if the detector has testable logic

## Adding a lab

1. Create a folder `src/labs/<id>/` exporting a `LabModule`
2. Add a manifest entry in `src/labs/registry.ts`
3. List `requiredCapabilities` accurately
4. Provide clear unsupported states when capabilities are missing

## Adding a benchmark

1. Create a benchmark in `src/benchmarks/<id>/` or extend `registry.ts`
2. Use the shared runner in `src/benchmarks/runner.ts`
3. Document what is measured and what is not
4. Avoid universal performance scores

## Suggesting a link

Links are curated, not exhaustive. Open an issue using the link suggestion template. Each link needs:

- A clear description (why is it useful?)
- A fitting category
- Tags for discoverability

## Code style

- TypeScript strict mode
- Semantic HTML
- Small modules, feature-based folders
- No unnecessary abstractions
- Prettier and ESLint must pass

## Pull requests

Keep PRs focused. One capability, lab, benchmark, or link category per PR is ideal.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical details.
