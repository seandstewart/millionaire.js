# ADR 012: Netlify or Vercel for Hosting

**Status:** Accepted

**Context:** Static site with no server-side logic. Need free tier and CI/CD from GitHub.

**Decision:** Deploy to Netlify or Vercel.

**Consequences:**
- Positive: Free tier; automatic deploys from Git pushes; CDN distribution.
- Negative: Vendor lock-in for deployment pipeline; serverless functions would be a separate decision if needed later.
