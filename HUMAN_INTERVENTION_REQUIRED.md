# Human Intervention Required

> Space: 1999 will never die.

The code changes are committed and ready. The following manual steps must be completed in the Cloudflare dashboard before the new deployment pipeline is operational.

---

## 1. Create the `affirm-staging` Worker

The staging environment needs its own Worker (currently everything runs through the single `affirm` Worker).

1. Go to **Workers & Pages** > **Create**
2. Create a new Worker named **`affirm-staging`**
3. Connect it to the **`tecapps/affirm`** Git repository
4. Configure the build settings:

| Setting                       | Value                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Production branch**         | `staging`                                                                              |
| **Build command**             | `bun install && bun run build:staging`                                                 |
| **Deploy command**            | `bun run db:migrate:staging && npx wrangler versions upload -c wrangler.staging.jsonc` |
| **Non-production branches**   | Enabled                                                                                |
| **Non-production deploy cmd** | `npx wrangler versions upload -c wrangler.staging.jsonc`                               |
| **Build watch paths**         | (leave empty — trigger on all changes)                                                 |

> **Why no migrations on non-production builds?** Preview versions from feature branches may contain unapplied schema changes that shouldn't hit the staging database until the branch actually merges to `staging`. The preview version will use the existing staging D1 schema.

---

## 2. Reconfigure the `affirm` Worker (production)

The existing `affirm` Worker needs its build config updated to use the new wrangler config file.

1. Go to **Workers & Pages** > **`affirm`** > **Settings** > **Builds**
2. Ensure the Git repo (`tecapps/affirm`) is connected
3. Update the build settings:

| Setting                     | Value                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| **Production branch**       | `production`                                                       |
| **Build command**           | `bun install && bun run build`                                     |
| **Deploy command**          | `bun run db:migrate:prod && npx wrangler deploy -c wrangler.jsonc` |
| **Non-production branches** | **Disabled** (staging has its own Worker now)                      |

---

## 3. Clean up GitHub Actions secrets (optional)

The following secrets were only used by the now-deleted `deploy.yaml` workflow. They can be removed from the GitHub repo settings if no other workflows need them:

- `CLOUDFLARE_API_TOKEN` (in the `staging` environment)
- `CLOUDFLARE_API_TOKEN` (in the `production` environment)

> Keep any `CLOUDFLARE_API_TOKEN` that exists at the **repo level** (not environment-scoped) if it's used by other workflows or local tooling.

---

## 4. Clean up environment variables (optional)

The following shell environment variables are no longer needed for migrations (they were used by the old broken `--database-id` flag approach). They may still be needed if you use `db:push:*` or `db:studio:*` commands locally:

- `CLOUDFLARE_STAGING_DATABASE_ID`
- `CLOUDFLARE_PRODUCTION_DATABASE_ID`

If you don't use `db:push` or `db:studio`, you can remove them from your shell profile.

---

## Verification checklist

After completing the above steps, verify the pipeline works:

- [ ] Push a commit to `staging` — the `affirm-staging` Worker Build triggers, runs migrations, uploads a version
- [ ] Push a commit to `production` — the `affirm` Worker Build triggers, runs migrations, deploys to live
- [ ] Open a PR targeting `staging` — `affirm-staging` uploads a preview version (no migrations)
- [ ] `ci.yaml` still runs lint/typecheck/build on all pushes and PRs
- [ ] Locally: `bun run db:migrate` applies migrations to local D1
- [ ] Locally: `bun run db:migrate:staging` applies migrations to remote staging D1
- [ ] Locally: `bun run db:migrate:prod` applies migrations to remote production D1

---

_Delete this file once all steps are complete._
