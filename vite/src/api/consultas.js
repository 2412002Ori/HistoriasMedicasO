import { API_BASE_URL } from '../config';

export const consultasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/consultas`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener consultas');
    }
    return result.data;
  },
  create: async (consultaData) => {
    const response = await fetch(`${API_BASE_URL}/consultas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultaData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear consulta');
    }
    return result.data;
  },
  update: async (id, consultaData) => {
    const response = await fetch(`${API_BASE_URL}/consultas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultaData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar consulta');
    }
    return result.data;
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/consultas/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar consulta');
    }
    return result.data;
  },
}; 