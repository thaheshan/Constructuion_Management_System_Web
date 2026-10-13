# Security Advisory & Dependency Tracking

**Issue Title**: `[SECURITY] Track Next.js 14.2.35 Critical & High Vulnerabilities (Next.js & PostCSS Upgrade)`

**Status**: Open / Tracked for Next Major Milestone  
**Severity**: Critical (Next.js 14.2.35 runtime) / High (Transitive PostCSS)  

---

## 1. Vulnerability Summary (`npm audit --omit=dev`)

An audit of production dependencies identified the following security advisories within the `next@14.2.35` tree:

| Package | Severity | Advisory ID | Description |
| :--- | :--- | :--- | :--- |
| **next** | **Critical** | [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f) | DoS via Image Optimizer `remotePatterns` configuration |
| **next** | **Critical** | [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8) | HTTP request smuggling in rewrites |
| **next** | **High** | [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf) | HTTP request deserialization DoS in React Server Components |
| **postcss** | **High** | [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | Arbitrary file read via attacker-controlled `sourceMappingURL` in CSS comments |
| **source-map-js** | **High** | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | Event-loop denial of service through indexed source-map section offsets |

---

## 2. Impact Assessment

- **Environment Exposure**:
  - The critical HTTP request smuggling and image optimization DoS primarily affect **self-hosted Node.js / Docker deployments** of Next.js that expose custom rewrite proxies or the `/api/image` endpoint directly to public traffic.
  - Vercel or cloud-managed edge runtimes isolate these layers behind platform-managed reverse proxies.
- **Application Scope**:
  - The application is currently in scaffold / initial authentication environment phase. No public self-hosted endpoints are exposed with untrusted remote images.

---

## 3. Remediation & Upgrade Strategy

The suggested upstream fix (`npm audit fix --force`) requires bumping to `next@^15` or `^16`, which introduces major breaking changes:
1. **React 19 Compatibility**: Peer dependencies across ecosystem packages (Recharts, React-Redux, Lucide) must be audited for React 19 support.
2. **Async Request APIs**: Next.js 15+ converts `cookies()`, `headers()`, and `params` into asynchronous Promises, requiring refactoring of all server components and route handlers.
3. **Cache Policy Changes**: `fetch` caching defaults to `no-store` instead of `force-cache`.

### Action Plan:
1. Schedule a dedicated chore sprint: `chore(deps): upgrade Next.js to 15.x and React 19`.
2. In the interim, ensure all self-hosted container deployments sit behind a reverse proxy (Nginx / Cloudflare) that enforces strict HTTP request normalization and restricts upload endpoints.
