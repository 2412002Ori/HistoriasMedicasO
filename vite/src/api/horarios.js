import { API_BASE_URL } from '../config';

export const horariosAPI = {
  // Crear uno o varios horarios para un doctor
  create: async (doctorId, horarios) => {
    // horarios: array de objetos { HORDIASE, HORHORIN, HORHORFI }
    const response = await fetch(`${API_BASE_URL}/horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctorId, horarios }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear horarios');
    }
    return result.data;
  },

  // Actualizar un horario específico
  update: async (horarioId, horarioData) => {
    const response = await fetch(`${API_BASE_URL}/horarios/${horarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(horarioData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar horario');
    }
    return result.data;
  },

  // Eliminar un horario
  delete: async (horarioId) => {
    const response = await fetch(`${API_BASE_URL}/horarios/${horarioId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar horario');
    }
    return result.data;
  },

  // Obtener horarios de un doctor
  getByDoctor: async (doctorId) => {
    const response = await fetch(`${API_BASE_URL}/horarios/doctor/${doctorId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener horarios');
    }
    return result.data;
  },
}; 