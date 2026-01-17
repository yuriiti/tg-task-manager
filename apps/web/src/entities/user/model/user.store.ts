import { create } from 'zustand';

export const useUserStore = create(() => ({
  user: null,
}));
