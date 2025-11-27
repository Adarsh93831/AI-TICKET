export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/v1/auth/google`;

export const APP_NAME = 'AI Ticket';
export const APP_DESCRIPTION = 'Intelligent Ticket Management System';

export const TICKET_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.TODO]: 'To Do',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.COMPLETED]: 'Completed'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITY.LOW]: 'Low',
  [TICKET_PRIORITY.MEDIUM]: 'Medium',
  [TICKET_PRIORITY.HIGH]: 'High'
};

export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.MODERATOR]: 'Moderator',
  [USER_ROLES.ADMIN]: 'Administrator'
};

export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
  SKILL_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 10
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  TICKETS: '/tickets',
  CREATE_TICKET: '/tickets/new',
  TICKET_DETAIL: '/tickets/:id',
  ASSIGNED_TICKETS: '/assigned-tickets',
  ADMIN: '/admin',
  UNAUTHORIZED: '/unauthorized'
};

export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right',
  STYLE: {
    background: '#363636',
    color: '#fff',
  }
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};