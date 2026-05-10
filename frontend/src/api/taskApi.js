import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/tasks';

// Helper to get headers from localStorage
const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return {};
    const user = JSON.parse(userStr);
    return {
        'X-User-Role': user.role,
        'X-User-Id': user.id
    };
};

export const getTasks = async (studentId = null) => {
    const url = studentId ? `${API_BASE_URL}/student/${studentId}` : API_BASE_URL;
    const response = await axios.get(url, { headers: getAuthHeaders() });
    return response.data;
};

export const getTask = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

export const createTask = async (taskData, studentId) => {
    const response = await axios.post(`${API_BASE_URL}?studentId=${studentId}`, taskData, { headers: getAuthHeaders() });
    return response.data;
};

export const markComplete = async (taskId) => {
    const response = await axios.put(`${API_BASE_URL}/${taskId}/complete`, {}, { headers: getAuthHeaders() });
    return response.data;
};

export const updateStatus = async (taskId, status) => {
    const response = await axios.put(`${API_BASE_URL}/${taskId}/status?status=${status}`, {}, { headers: getAuthHeaders() });
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData, { headers: getAuthHeaders() });
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};
