import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Redis is configured
const isRedisConfigured = process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN && 
  process.env.UPSTASH_REDIS_REST_URL.startsWith('https') &&
  process.env.UPSTASH_REDIS_REST_URL !== 'your_upstash_redis_url';

// Create a fallback rate limiter that always allows requests when Redis is not configured
const fallbackRateLimit = {
  limit: async (identifier: string) => {
    console.warn('Rate limiting disabled: Redis not configured');
    return { success: true };
  }
};

let rateLimiter;

if (isRedisConfigured) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
  });
} else {
  rateLimiter = fallbackRateLimit;
}

export const rateLimit = rateLimiter;
