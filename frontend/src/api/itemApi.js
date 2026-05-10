import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/items';

export const getItems = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const getItem = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createItem = async (itemData) => {
    const response = await axios.post(API_BASE_URL, itemData);
    return response.data;
};

export const updateItem = async (id, itemData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, itemData);
    return response.data;
};

export const deleteItem = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};
