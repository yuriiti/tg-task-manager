export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

export const CACHE_KEYS = {
  TASK: (id: string) => `task:${id}`,
  USER_TASKS: (userId: string) => `tasks:user:${userId}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
  RATE_LIMIT: (ip: string) => `rate_limit:${ip}`,
} as const;

export const CACHE_TTL = {
  TASK: 3600, // 1 hour
  USER_TASKS: 1800, // 30 minutes
  SESSION: 604800, // 7 days
  RATE_LIMIT: 60, // 1 minute
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
