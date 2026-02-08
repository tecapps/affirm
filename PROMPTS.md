# Prompts

---

## Database Workflows

We need to use Drizzle affixed to the Cloudflare Workers `DB` binding instead of connecting separately, so we can benefit from automatic environment mocking and set up a staging environment.

Currently, we set up an authentication token, configure the account ID, and other related settings in `.env`, but instead, we want to use the Cloudflare Workers binding. We also want to set up a staging database. The staging branch doesn't currently exist, but it will be `staging`. We will also have a staging database at `affirm-staging`. We also need to handle the `MiniFlare` environment, which is mocked locally.

We need to come up with a system of keeping these environments separate and providing developer tooling to access them while defaulting to the locally mocked `MiniFlare` environment, which should be automatically provided by Wrangler if we use the binding rather than manual configuration.

Come up with a way of doing this and implement it.

You can use the Cloudflare Documentation tool for Cloudflare information. Also use the Context7 tool to research Drizzle.

Also implement a GitHub Action which will take the migrations through from local (no CI), staging on the `staging` branch which does not exist yet, to staging db, and production on the `main` branch.

Set up scripts in `package.json` to make things smoother. Include a script for Drizzle Studio.

Document it in `README.md`, including Mermaid diagrams where appropriate, and then implement it. Include step-by-step guides to creating a migration, applying it, following through the lifecycle, and troubleshooting. No need to maintain any agent-facing documentation, just human-facing.

---
