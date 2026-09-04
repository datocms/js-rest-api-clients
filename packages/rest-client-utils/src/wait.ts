export function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * The CMA enforces a single rate-limit window — 60 requests / 3 seconds —
 * shared by the whole project (not per token). `X-RateLimit-Reset` tells us
 * how many seconds are left until it refills; when no such header applies
 * (transient errors, timeouts, job polling) we fall back to `retryCount`
 * seconds instead, which keeps growing with every retry. Either way, many
 * callers can hit the same failure together (e.g. a static site generator
 * rendering pages in parallel, all against the same project), and without
 * jitter they'd all wake up and retry on the same tick, reproducing the
 * exact burst that got them rate-limited.
 *
 * We never wait less than `baseSeconds` — retrying before the window refills
 * (or before a transient failure has had time to clear) is essentially
 * guaranteed to fail again. On top of that we add a random extra, capped at
 * `JITTER_CAP_SECONDS`: what desynchronizes concurrent retries is a few
 * seconds of spread, not a delay proportional to the wait itself — doubling
 * a 1s wait is fine, but doubling a wait that's already grown to 45s (many
 * retries in) would needlessly leave callers waiting far longer than needed.
 */
const JITTER_CAP_SECONDS = 5;

export function withJitter(baseSeconds: number): number {
  return (
    baseSeconds + Math.random() * Math.min(baseSeconds, JITTER_CAP_SECONDS)
  );
}
