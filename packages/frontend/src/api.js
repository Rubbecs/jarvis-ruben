import axios from 'axios';
export const apiClient = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});
export const fetchAgents = async () => {
    const response = await apiClient.get('/agents');
    return response.data;
};
export const fetchTools = async () => {
    const response = await apiClient.get('/tools');
    return response.data;
};
export const createAgent = async (payload) => {
    const response = await apiClient.post('/agents', payload);
    return response.data;
};
export const updateAgent = async (id, payload) => {
    const response = await apiClient.put(`/agents/${id}`, payload);
    return response.data;
};
export const cloneAgent = async (id) => {
    const response = await apiClient.post(`/agents/${id}/clone`);
    return response.data;
};
export const exportAgents = async () => {
    const response = await apiClient.get('/agents/export');
    return response.data;
};
export const importAgents = async (agents) => {
    const response = await apiClient.post('/agents/import', { agents });
    return response.data;
};
export const fetchTasks = async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
};
export const createTask = async (payload) => {
    const response = await apiClient.post('/tasks', payload);
    return response.data;
};
export const updateTask = async (id, payload) => {
    const response = await apiClient.put(`/tasks/${id}`, payload);
    return response.data;
};
export const retryTask = async (id) => {
    const response = await apiClient.post(`/tasks/${id}/retry`);
    return response.data;
};
export const pauseTask = async (id) => {
    const response = await apiClient.post(`/tasks/${id}/pause`);
    return response.data;
};
export const resumeTask = async (id) => {
    const response = await apiClient.post(`/tasks/${id}/resume`);
    return response.data;
};
export const fetchMemory = async () => {
    const response = await apiClient.get('/memory');
    return response.data;
};
export const createMemoryNode = async (payload) => {
    const response = await apiClient.post('/memory', payload);
    return response.data;
};
export const fetchWorkflowTemplates = async () => {
    const response = await apiClient.get('/workflow/templates');
    return response.data;
};
export const createWorkflowTemplate = async (payload) => {
    const response = await apiClient.post('/workflow/templates', payload);
    return response.data;
};
export const executeWorkflow = async (payload) => {
    const response = await apiClient.post('/workflow/execute', payload);
    return response.data;
};
export const searchVectors = async (query) => {
    const response = await apiClient.get('/search/vectors', { params: { q: query } });
    return response.data;
};
export const fetchNotifications = async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
};
export const createNotification = async (payload) => {
    const response = await apiClient.post('/notifications', payload);
    return response.data;
};
export const fetchAutomationJobs = async () => {
    const response = await apiClient.get('/automation/logs');
    return response.data;
};
export const createAutomationJob = async (payload) => {
    const response = await apiClient.post('/automation/commands', payload);
    return response.data;
};
export const startVoiceSession = async (payload) => {
    const response = await apiClient.post('/voice/start', payload);
    return response.data;
};
export const stopVoiceSession = async (payload) => {
    const response = await apiClient.post('/voice/stop', payload);
    return response.data;
};
export const fetchVoiceLogs = async () => {
    const response = await apiClient.get('/voice/logs');
    return response.data;
};
export const fetchKeys = async () => {
    const response = await apiClient.get('/keys');
    return response.data;
};
export const createApiKey = async (payload) => {
    const response = await apiClient.post('/keys', payload);
    return response.data;
};
export const updateApiKey = async (id, payload) => {
    const response = await apiClient.put(`/keys/${id}`, payload);
    return response.data;
};
export const deleteAgent = async (id) => {
    const response = await apiClient.delete(`/agents/${id}`);
    return response.data;
};
export const markNotificationRead = async (id) => {
    const response = await apiClient.post(`/notifications/${id}/read`);
    return response.data;
};
