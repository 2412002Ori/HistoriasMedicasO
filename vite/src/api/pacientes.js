import { API_BASE_URL } from '../config';

// API utility functions for pacientes
export const pacientesAPI = {
  // Get all patients
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/pacientes`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener pacientes');
    }
    return result.data;
  },

  // Get patient by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener paciente');
    }
    return result.data;
  },

  // Get patient by cedula
  getByCedula: async (cedula) => {
    const response = await fetch(`${API_BASE_URL}/pacientes/cedula/${cedula}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Error al obtener paciente');
    }
    return result.data;
  },

  // Search patients by name
  searchByName: async (term) => {
    const response = await fetch(`${API_BASE_URL}/pacientes/search/${term}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Error al buscar pacientes');
    }
    return result.data;
  },

  // Create new patient
  create: async (patientData) => {
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al crear paciente');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al crear paciente');
    }
    
    return result.data;
  },

  // Update patient
  update: async (id, patientData) => {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar paciente');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al actualizar paciente');
    }
    
    return result.data;
  },

  // Delete patient
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error al eliminar paciente');
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Error al eliminar paciente');
    }
    
    return result.data;
  },
}; 