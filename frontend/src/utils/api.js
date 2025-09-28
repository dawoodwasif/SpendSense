// Get the API base URL from environment variable or use localhost as fallback
export const getApiBaseUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

// Helper function to make API calls with the correct base URL
export const apiCall = async (endpoint, options = {}) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    return fetch(url, options);
};
