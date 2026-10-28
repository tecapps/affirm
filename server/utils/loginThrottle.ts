import { eq, sql } from "drizzle-orm";
import type { H3Event } from "h3";
import { loginAttempts } from "../database/schema";
import type { Database } from "./db";

/** Attempts allowed per submitted email within one window, counted across all Cloudflare locations. */
export const maxLoginAttemptsPerAccount = 10;
/** Length of the fixed per-account window. The counter restarts on the first attempt after it ends. */
export const loginAttemptWindowMs = 15 * 60 * 1000;

const tooManyAttemptsError = () =>
  createError({ statusCode: 429, statusMessage: "Too many login attempts. Try again later." });

/**
 * Per-source throttle: rejects the request with 429 when its IP is over the LOGIN_RATE_LIMITER limit.
 *
 * The Workers rate-limit binding is approximate and counts separately in each Cloudflare location,
 * so this only slows a single source down. The per-account counter below is the strict limit.
 */
export async function assertLoginSourceAllowed(event: H3Event): Promise<void> {
  const sourceIp = getRequestHeader(event, "cf-connecting-ip") ?? getRequestIP(event) ?? "unknown";
  const { success } = await event.context.cloudflare.env.LOGIN_RATE_LIMITER.limit({ key: `login:${sourceIp}` });
  if (!success) {
    throw tooManyAttemptsError();
  }
}

/**
 * Per-account throttle: counts this attempt against `email` and rejects with 429 once the window's
 * limit is exceeded.
 *
 * The count is taken before the password is checked, in one upsert statement, so concurrent guesses
 * cannot all slip past the limit. Unknown emails are counted too, so a 429 does not reveal whether
 * an account exists.
 */
export async function assertLoginAccountAllowed(db: Database, email: string, now = Date.now()): Promise<void> {
  const windowExpired = sql`${loginAttempts.windowStartedAt} <= ${now - loginAttemptWindowMs}`;
  const [counter] = await db
    .insert(loginAttempts)
    .values({ email, attempts: 1, windowStartedAt: new Date(now) })
    .onConflictDoUpdate({
      target: loginAttempts.email,
      // SQLite evaluates both expressions against the row as it was before this update.
      set: {
        attempts: sql`case when ${windowExpired} then 1 else ${loginAttempts.attempts} + 1 end`,
        windowStartedAt: sql`case when ${windowExpired} then ${now} else ${loginAttempts.windowStartedAt} end`,
      },
    })
    .returning({ attempts: loginAttempts.attempts });

  if (!counter || counter.attempts > maxLoginAttemptsPerAccount) {
    throw tooManyAttemptsError();
  }
}

/** Clears the per-account counter after a successful login. */
export async function clearLoginAttempts(db: Database, email: string): Promise<void> {
  await db.delete(loginAttempts).where(eq(loginAttempts.email, email));
}
