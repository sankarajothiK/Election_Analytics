import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getStates = () => api.get('/states');
export const getConstituencies = (state, type) => api.get(`/constituencies/${state}/${type}`);
export const submitFeedback = (data) => api.post('/feedback', data);
export const getSummary = () => api.get('/analytics/summary');
export const getConstituencyAnalytics = (name) => api.get(`/analytics/constituency/${name}`);

export default api;
