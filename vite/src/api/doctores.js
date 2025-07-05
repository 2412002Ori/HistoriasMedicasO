import { API_BASE_URL } from '../config';

export const doctoresAPI = {
  // Obtener todos los doctores
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/doctores`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener doctores');
    }
    return result.data;
  },

  // Obtener doctor por ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doctores/${id}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener doctor');
    }
    return result.data;
  },

  // Buscar doctores
  search: async (term) => {
    const response = await fetch(`${API_BASE_URL}/doctores/search/${term}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al buscar doctores');
    }
    return result.data;
  },

  // Crear nuevo doctor
  create: async (doctorData) => {
    const response = await fetch(`${API_BASE_URL}/doctores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear doctor');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al crear doctor');
    }
    
    return result.data;
  },

  // Actualizar doctor
  update: async (id, doctorData) => {
    const response = await fetch(`${API_BASE_URL}/doctores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar doctor');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al actualizar doctor');
    }
    
    return result.data;
  },

  // Eliminar doctor
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doctores/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al eliminar doctor');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al eliminar doctor');
    }
    
    return result.data;
  },
}; 