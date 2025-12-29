import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Получить количество документов на подписание
export const getForSigningCount = async (): Promise<number> => {
    return 1;
    try {
        const response = await axios.get(`${API_URL}/api/applications/for-signing/count`);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching for signing count:', error);
        return 0;
    }
};

// Получить количество избранных
export const getFavoritesCount = async (): Promise<number> => {
    return 1;
    try {
        const response = await axios.get(`${API_URL}/api/applications/favorites/count`);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching favorites count:', error);
        return 0;
    }
};

// Получить количество возвратов
export const getReturnsCount = async (): Promise<number> => {
    return 1;
    try {
        const response = await axios.get(`${API_URL}/api/applications/returns/count`);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching returns count:', error);
        return 0;
    }
};

// Получить количество просрочек
export const getOverdueCount = async (): Promise<number> => {
    return 1;
    try {
        const response = await axios.get(`${API_URL}/api/applications/overdue/count`);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching overdue count:', error);
        return 0;
    }
};

// Получить количество заданий соисполнителя
export const getCoExecutorCount = async (): Promise<number> => {
    return 1;
    try {
        const response = await axios.get(`${API_URL}/api/tasks/co-executor/count`);
        return response.data.count || 0;
    } catch (error) {
        console.error('Error fetching co-executor count:', error);
        return 0;
    }
};