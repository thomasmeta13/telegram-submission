import axios from 'axios';
import qs from 'qs';

const API_BASE_URL = 'https://detask-backend-4470455c72f3.herokuapp.com';
const axiosInstance = axios.create({
   baseURL: 'https://detask-backend-4470455c72f3.herokuapp.com',
   withCredentials: true,
   paramsSerializer: {
      serialize: function (params: any) {
         return qs.stringify(params);
      },
   },
});

axiosInstance.interceptors.request.use(
   async (config: any) => {
      const token = localStorage.getItem('token');
      config.headers['Content-Type'] = 'application/json';
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error: any) => {
      return Promise.reject(error);
   },
);

axiosInstance.interceptors.response.use(
   (response) => {return response},
   async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
      }
      if (error.response && error.response.status === 500) {
         console.error('Internal server error', error.response.data);
      }
      return Promise.reject(error);
   },
);

export default axiosInstance;

export const generateGame = async (prompt: string) => {
  try {
    const response = await axiosInstance.post('/generate-game', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error generating game:', error);
    throw error;
  }
};

export const signUp = async (userData: { userId: number; userName: string }) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', userData.userId.toString());
    }
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (userId: number) => {
  try {
    const response = await axiosInstance.post('/auth/telegram-auth', { userId });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', userId.toString());
      return response.data;
    } else {
      console.error('Unexpected response structure:', response.data);
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const updateUserCoins = async (userId: string, coins: number) => {
  try {
    const response = await axiosInstance.put(`/user/coins/${userId}`, { coins });
    return response.data;
  } catch (error) {
    console.error('Error updating user coins:', error);
    throw error;
  }
};

export const getUserHome = async () => {
  try {
    const response = await axiosInstance.get('/user/home');
    return response.data;
  } catch (error) {
    console.error('Error fetching user home data:', error);
    throw error;
  }
};

export const fetchUserHomeData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/home`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user home data:', error);
    throw error;
  }
};

export const getUserCoins = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/user/coins/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    throw error;
  }
};

export const getTaskImages = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/${taskId}/images`);
    return response.data.images;
  } catch (error) {
    console.error('Error fetching task images:', error);
    throw error;
  }
};
