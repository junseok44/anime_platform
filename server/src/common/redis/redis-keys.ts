export const REDIS_KEYS = {
  ANIME: {
    RATING: {
      LOCK: (animeId: string) => `anime:${animeId}:rating:lock`,
      AVG: (animeId: string) => `anime:${animeId}:rating:avg`,
    },
    VIEW: {
      LOCK: (animeId: string) => `anime:${animeId}:view:lock`,
      COUNT: (animeId: string) => `anime:${animeId}:view:count`,
    },
  },
  USER: {
    RATE_LIMIT: (userId: string) => `user:${userId}:rate-limit`,
  },
} as const;
