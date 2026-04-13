import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

const buckets = new Map<string, Bucket>();

function rateLimitFallback(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: current.resetAt - now,
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: limit - current.count,
    retryAfterMs: 0,
  };
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.apiRateLimit.findUnique({
        where: {
          key_windowStart: {
            key,
            windowStart,
          },
        },
      });

      if (!existing) {
        await tx.apiRateLimit.create({
          data: {
            key,
            windowStart,
            count: 1,
          },
        });

        return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
      }

      if (existing.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: windowStartMs + windowMs - now,
        };
      }

      const updated = await tx.apiRateLimit.update({
        where: {
          key_windowStart: {
            key,
            windowStart,
          },
        },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      return {
        allowed: true,
        remaining: Math.max(limit - updated.count, 0),
        retryAfterMs: 0,
      };
    });

    void prisma.apiRateLimit.deleteMany({
      where: {
        updatedAt: {
          lt: new Date(now - windowMs * 10),
        },
      },
    });

    return result;
  } catch (error) {
    logger.warn("Persistent rate-limit failed, using memory fallback", {
      key,
      error: error instanceof Error ? error.message : "Unknown rate-limit error",
    });
    return rateLimitFallback(key, limit, windowMs);
  }
}
