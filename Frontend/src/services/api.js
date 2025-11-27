import {axiosInstance} from './axios.js';

export const checkAuth = () => axiosInstance.get('/v1/auth/checkAuth');
export const logout = () => axiosInstance.post('/v1/auth/logout');
export const refreshToken = () => axiosInstance.post('/v1/auth/refresh-token');

export const addOrUpdateSkills = (skills) => axiosInstance.post('/v1/users/addOrUpdateSkills', {skills});
export const addOrUpdatePhoneNumber = (phoneNumber) => axiosInstance.post('/v1/users/addOrUpdatePhoneNumber', {phoneNumber});
export const updateUser = (userData) => axiosInstance.patch('/v1/users/updateUser', userData);
export const getUsers = () => axiosInstance.get('/v1/users/getUsers');

export const createTicket = (data) => axiosInstance.post('/v1/tickets', data);
export const getTickets = () => axiosInstance.get('/v1/tickets');
export const getTicket = (id) => axiosInstance.get(`/v1/tickets/${id}`);
export const deleteTicket = (id) => axiosInstance.delete(`/v1/tickets/${id}`);
export const getAssignedTickets = () => axiosInstance.get('/v1/tickets/assigned-to-me'); 