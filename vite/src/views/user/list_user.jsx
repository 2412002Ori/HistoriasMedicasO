import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
} from '@mui/material';
import { Edit, Delete, Search, Cancel as CancelIcon, Add as AddIcon } from '@mui/icons-material';
import UserForm from './User_f';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../api/user';

const mapFromBackend = (user) => ({
  id: user.USEID___ || user.useid___,
  name: user.USEFNAME || user.usefname,
  lastname: user.USELNAME || user.uselname,
  email: user.USEEMAIL || user.useemail,
  password: '', // nunca mostrar
  role: user.rol___,
  status: user.USESTATU || user.usestatu,
});

const mapToBackend = (user) => ({
  USEFNAME: user.name || 'N/A',
  USELNAME: user.lastname || 'N/A',
  USEEMAIL: user.email || 'N/A',
  USEPASSW: user.password || '123456',
  USEREDAT: new Date().toISOString(),
  rol___: user.role || 'user',
  USESTATU: user.status || 'active',
});

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios();
      setUsers(res.data.map(mapFromBackend));
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteUsuario(user.id);
      fetchUsers();
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  const handleOpenModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Actualiza la lista tras crear/editar
  const updateUserList = async (userData) => {
    try {
      if (isEditing) {
        await updateUsuario(userData.id, mapToBackend(userData));
      } else {
        const payload = mapToBackend(userData);
        console.log('Payload a enviar:', payload);
        await createUsuario(payload);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert('Error al guardar usuario: ' + (err.message || 'Error desconocido'));
    }
  };

  const getRoleColor = (role) => {
    if (!role) return 'default';
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <h2>Lista de Usuarios</h2>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Buscar por nombre, email o rol"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            startIcon={<AddIcon />}
          >
            Agregar Usuario
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center">Cargando...</TableCell></TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{user.name}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={getRoleColor(user.role)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status} color={getStatusColor(user.status)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit" onClick={() => handleEdit(user)} color="primary"><Edit /></IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(user)} color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No se encontraron usuarios que coincidan con la búsqueda.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <UserForm
            initialValues={selectedUser}
            onSubmit={updateUserList}
            onCancel={handleCloseModal}
            isEditing={isEditing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} startIcon={<CancelIcon />}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListUsers;