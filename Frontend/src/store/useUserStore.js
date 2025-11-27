import { create } from 'zustand';
import * as api from '../services/api.js';

export const useUserStore = create((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.getUsers();
            set({ 
                users: response.data.data,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to fetch users',
                isLoading: false 
            });
            throw err;
        }
    },

    updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.updateUser(userData);
            const updatedUser = response.data.data;
            
            set(state => ({
                users: state.users.map(user => 
                    user.email === userData.email 
                        ? updatedUser
                        : user
                ),
                isLoading: false,
                error: null
            }));
            
            return updatedUser;
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to update user',
                isLoading: false 
            });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));