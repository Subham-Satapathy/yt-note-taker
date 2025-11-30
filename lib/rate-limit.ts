import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Rate limiting configuration
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/summarize": {
    maxRequests: 10, // 10 requests
    windowMs: 60 * 60 * 1000, // per hour
  },
};

export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const config = RATE_LIMITS[endpoint];
  
  if (!config) {
    // No rate limit configured for this endpoint
    return { allowed: true, remaining: Infinity, resetTime: new Date() };
  }

  const { maxRequests, windowMs } = config;
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  // Count requests in the current window
  const requestCount = await prisma.apiUsage.count({
    where: {
      userId,
      endpoint,
      timestamp: {
        gte: windowStart,
      },
    },
  });

  const allowed = requestCount < maxRequests;
  const remaining = Math.max(0, maxRequests - requestCount - 1);
  const resetTime = new Date(now.getTime() + windowMs);

  if (allowed) {
    // Log this request
    await prisma.apiUsage.create({
      data: {
        userId,
        endpoint,
        timestamp: now,
      },
    });
  }

  return { allowed, remaining, resetTime };
}

// Clean up old API usage records (run periodically)
export async function cleanupOldUsageRecords() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await prisma.apiUsage.deleteMany({
    where: {
      timestamp: {
        lt: thirtyDaysAgo,
      },
    },
  });
}
