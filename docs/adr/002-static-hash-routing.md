# ADR 002: Static Hosting with Hash Routing

**Status:** Accepted  
**Date:** 2026-07-10  
**Context:** WebProbe is a static app without a backend. Deep-linkable pages are required, and the simplest deployment target is plain static file hosting.

## Decision

Use client-side hash routing (`#/capabilities/webgpu`) for the MVP.

## Rationale

- Basic static hosts serve `index.html` only at the root; path-based SPA routing (`/capabilities/webgpu`) returns 404 without server rewrite rules.
- Hash routing works on all static hosts with zero configuration.
- Query parameters on the hash (`#/links?category=css`) support filter state without a global store.

## Consequences

**Positive**

- No `staticwebapp.config.json` rewrite rules required for MVP.
- Predictable behavior across hosting targets.
- Simple router implementation (~80–100 lines).

**Negative**

- URLs include `#`, which some users find less clean.
- Server-side analytics (if ever added) cannot see hash paths without client instrumentation — acceptable because MVP has no analytics.
- Sharing links still works; hash is part of the URL.

## Migration path

If the project moves to a host with rewrite support and clean URLs become a priority:

1. Switch to History API routing (`/capabilities/webgpu`).
2. Add fallback rewrite: all paths → `index.html`.
3. Keep route table and page modules unchanged.

Document this migration in a new ADR when undertaken.

## Alternatives considered

| Alternative                          | Why deferred                                             |
| ------------------------------------ | -------------------------------------------------------- |
| History API + rewrites               | Requires per-host config; unnecessary for MVP            |
| Multi-page app (separate HTML files) | Poor fit for shared shell, lazy labs, and consistent nav |
| Full router library (e.g. Navigo)    | Premature; internal router is sufficient                 |
