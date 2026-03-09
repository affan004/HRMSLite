import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeService = {
    getAll: () => api.get('/employees/'),
    add: (data) => api.post('/employees/', data),
    delete: (id) => api.delete(`/employees/${id}/`),
};

export const attendanceService = {
    get: (employeeId) => {
        const params = employeeId ? { employee_id: employeeId } : {};
        return api.get('/attendance/', { params });
    },
    mark: (data) => api.post('/attendance/', data),
};

export default api;
