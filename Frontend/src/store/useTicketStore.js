import { create } from 'zustand';
import * as api from '../services/api.js';

export const useTicketStore = create((set, get) => ({
    tickets: [],
    assignedTickets: [],
    currentTicket: null,
    isLoading: false,
    error: null,

    fetchTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.getTickets();
            set({ 
                tickets: response.data.data,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to fetch tickets',
                isLoading: false 
            });
            throw err;
        }
    },

    fetchTicket: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.getTicket(id);
            set({ 
                currentTicket: response.data.data,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to fetch ticket',
                isLoading: false 
            });
            throw err;
        }
    },

    createTicket: async (ticketData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.createTicket(ticketData);
            const newTicket = response.data.data;
            
            set(state => ({ 
                tickets: [newTicket, ...state.tickets],
                isLoading: false,
                error: null
            }));
            
            return newTicket;
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to create ticket',
                isLoading: false 
            });
            throw err;
        }
    },

    deleteTicket: async (ticketId) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteTicket(ticketId);
            set(state => ({ 
                tickets: state.tickets.filter(ticket => ticket._id !== ticketId),
                assignedTickets: state.assignedTickets.filter(ticket => ticket._id !== ticketId),
                currentTicket: state.currentTicket?._id === ticketId ? null : state.currentTicket,
                isLoading: false,
                error: null
            }));
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to delete ticket',
                isLoading: false 
            });
            throw err;
        }
    },

    fetchAssignedTickets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.getAssignedTickets();
            set({ 
                tickets: response.data.data,
                assignedTickets: response.data.data,
                isLoading: false 
            });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to fetch assigned tickets',
                isLoading: false 
            });
            throw err;
        }
    },

    clearCurrentTicket: () => set({ currentTicket: null }),
    
    clearError: () => set({ error: null }),

    clearTickets: () => set({ tickets: [], assignedTickets: [] }),

    updateTicketInList: (ticketId, updates) => {
        set(state => ({
            tickets: state.tickets.map(ticket => 
                ticket._id === ticketId 
                    ? { ...ticket, ...updates }
                    : ticket
            ),
            assignedTickets: state.assignedTickets.map(ticket => 
                ticket._id === ticketId 
                    ? { ...ticket, ...updates }
                    : ticket
            )
        }));
    },
}));