const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api/usuarios';

export async function getUsuarios() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function getUsuarioById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener usuario');
  return res.json();
}

export async function createUsuario(usuario) {
  const usuarioBackend = {
    ...usuario,
    rol___: usuario.role,
  };
  delete usuarioBackend.role;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioBackend)
  });
  const data = await res.json();
  console.log('Respuesta backend:', data);
  if (!res.ok) throw new Error(data.message || 'Error al crear usuario');
  return data;
}

export async function updateUsuario(id, usuario) {
  const usuarioBackend = {
    ...usuario,
    rol___: usuario.role,
  };
  delete usuarioBackend.role;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioBackend)
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
  return res.json();
}

export async function deleteUsuario(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar usuario');
  return res.json();
} 