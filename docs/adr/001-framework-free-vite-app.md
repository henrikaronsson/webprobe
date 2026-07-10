# ADR 001: Framework-Free TypeScript + Vite Application

**Status:** Accepted  
**Date:** 2026-07-10  
**Context:** WebProbe must demonstrate modern browser development without Angular, React, Vue, or similar frameworks. The codebase should remain understandable by humans and AI agents.

## Decision

Build WebProbe as a pure TypeScript application bundled with Vite, rendering UI through native DOM APIs and semantic HTML. Use Web Components only for small, repeated interactive widgets where encapsulation provides clear value.

## Rationale

- Aligns with the project mission: explore the web platform itself, not a framework abstraction.
- Minimizes dependencies and bundle size.
- Keeps project onboarding simple — no framework-specific patterns to learn.
- Static output deploys anywhere without SSR or server runtime.
- TypeScript strict mode gives strong contracts for capability, lab, and benchmark models.

## Consequences

**Positive**

- Fast cold starts in development with Vite.
- No framework upgrade churn.
- Direct use of browser APIs in labs and benchmarks.

**Negative**

- Manual DOM management requires discipline around cleanup and accessibility.
- No ecosystem of pre-built UI components; we build only what we need.
- Larger pages may need careful structure to avoid repetitive rendering code.

## Guardrails

- DOM helpers in `shared/dom.ts` must stay under ~80 lines total.
- No virtual DOM, no reactive rendering layer, no custom templating language.
- Revisit this ADR only if maintainability problems emerge that cannot be solved with small Web Components or shared page partials.

## Alternatives considered

| Alternative            | Why rejected                                                                      |
| ---------------------- | --------------------------------------------------------------------------------- |
| React / Vue / Angular  | Explicitly out of scope; adds framework weight                                    |
| Lit / Preact           | Still a framework-like dependency; defer unless Web Components grow substantially |
| Alpine.js / Petite-Vue | Reactive model unnecessary for mostly static pages with isolated labs             |
