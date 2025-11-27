import { create } from 'zustand';
import * as api from "../services/api.js";
import { GOOGLE_AUTH_URL } from "../utils/constants.js";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    error: null,

    checkAuth: async () => {
        console.log('🔍 Starting checkAuth...');
        console.log('🌐 Current URL:', window.location.href);
        console.log('🍪 Document cookies:', document.cookie);
        set({ isLoading: true, error: null });
        try {
            console.log('📡 Making API call to /v1/auth/checkAuth');
            const response = await api.checkAuth();
            console.log('✅ checkAuth successful:', response.data);
            set({
                authUser: response.data.data,
                isAuthenticated: true,
                isInitialized: true
            });
        } catch (err) {
            console.log('❌ checkAuth failed:', {
                message: err.response?.data?.message || err.message,
                status: err.response?.status,
                data: err.response?.data,
                config: err.config
            });
            set({
                authUser: null,
                isAuthenticated: false,
                isInitialized: true,
                error: err.response?.data?.message || 'Authentication failed'
            });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithGoogle: () => {
        window.location.href = GOOGLE_AUTH_URL;
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await api.logout();
            set({
                authUser: null,
                isAuthenticated: false,
                isLoading: false
            });
            window.location.href = '/login';
        } catch (err) {
            set({ error: err.response?.data?.message || 'Logout failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    addOrUpdateSkills: async (skills) => {
        const previousUser = get().authUser;
        if (!previousUser) return;    
        set({ 
            isLoading: true,
            authUser: { ...previousUser, skills },
        });

        try {
            const response = await api.addOrUpdateSkills(skills);
            set({ 
                authUser: response.data.data,
                error: null 
            });
        } catch (err) {
            set({ 
                authUser: previousUser,
                error: err.response?.data?.message || 'Failed to update skills'
            });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    addOrUpdatePhoneNumber: async (phoneNumber) => {
        const previousUser = get().authUser;
        if (!previousUser) return;
        
        set({ 
            isLoading: true,
            authUser: { ...previousUser, phoneNumber }
        });

        try {
            const response = await api.addOrUpdatePhoneNumber(phoneNumber);
            set({ 
                authUser: response.data.data,
                error: null 
            });
        } catch (err) {
            set({ 
                authUser: previousUser,
                error: err.response?.data?.message || 'Failed to update phone number'
            });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}))