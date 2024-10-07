import axios from 'axios';

// Create a new instance of axios with a custom config
const axiosInstance = axios.create({
  baseURL: 'https://sos.mohimen.ly/api', // Your Laravel API URL
  timeout: 10000, // Request timeout
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // Get the auth token from localStorage

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that is within the range of 2xx will trigger this function
    return response;
  },
  (error) => {
    // Any status code outside of 2xx will trigger this function
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized errors (e.g., token expired, user not authenticated)
      localStorage.removeItem('auth_token'); // Clear token from localStorage
      window.location.href = '/sign-in'; // Redirect to the login page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
