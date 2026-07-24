// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = "https://buildsphere-backend.onrender.com";


export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/users/register`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};