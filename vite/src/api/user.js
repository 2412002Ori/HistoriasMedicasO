import { API_BASE_URL } from '../config';

// Get all users
export const getUsuarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Create new user
export const createUsuario = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUsuario = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUsuario = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar usuario');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el perfil');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el perfil');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (token, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/usuarios/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al subir la imagen');
    }

    return data;
  } catch (error) {
    throw error;
  }
}; 