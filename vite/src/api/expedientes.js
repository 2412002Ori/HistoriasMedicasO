import { API_BASE_URL } from '../config';

export const expedientesAPI = {
  // Obtener todos los expedientes
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/expedientes`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener expedientes');
    }
    return result.data;
  },

  // Obtener expedientes por paciente
  getByPaciente: async (pacienteId) => {
    const response = await fetch(`${API_BASE_URL}/expedientes/paciente/${pacienteId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener expedientes del paciente');
    }
    return result.data;
  },

  // Crear expediente
  create: async (expedienteData) => {
    const response = await fetch(`${API_BASE_URL}/expedientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expedienteData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear expediente');
    }
    return result.data;
  },
}; 