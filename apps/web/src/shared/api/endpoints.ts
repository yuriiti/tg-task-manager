/**
 * Централизованное определение всех API endpoints
 */
export const endpoints = {
  auth: {
    login: '/auth/login',
  },
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
  },
  users: {
    detail: (id: string) => `/users/${id}`,
  },
} as const;
