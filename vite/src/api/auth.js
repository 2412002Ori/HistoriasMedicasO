import { API_BASE_URL } from '../config';

// Login service
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Verify token service
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token inválido');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Logout service
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 