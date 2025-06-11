import React, { useState } from 'react';
import {
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
  Modal,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import PacientesFormulario from './pacientes_formulario';

const testPacientes = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '123456789',
    fecha_nacimiento: new Date('1990-05-15'),
    sexo: 'Masculino',
    direccion: 'Calle Falsa 123',
    telefono: '555-1234',
    email: 'juan.perez@example.com',
  },
  {
    nombre: 'María',
    apellido: 'Gómez',
    cedula: '987654321',
    fecha_nacimiento: new Date('1985-10-20'),
    sexo: 'Femenino',
    direccion: 'Avenida Siempreviva 456',
    telefono: '555-5678',
    email: 'maria.gomez@example.com',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PacientesTriajeList = ({ pacientes = testPacientes }) => {
  const [cedulaSearchTerm, setCedulaSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCedulaSearch = (event) => {
    setCedulaSearchTerm(event.target.value);
  };


  const filteredPacientes = pacientes.filter((paciente) => {
    const cedulaStr = paciente.cedula.toLowerCase();
    return (
      cedulaStr.includes(cedulaSearchTerm.toLowerCase())
    );
  });

  return (
    <Paper>
      <TextField
        label="Buscar por Cédula"
        value={cedulaSearchTerm}
        onChange={handleCedulaSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, mt: 2, marginLeft: 2 }}
      />
      <IconButton
        onClick={handleOpen}
        aria-label="add"
        sx={{ mb: 2, mt: 2, marginLeft: 2 }}
      >
        <AddIcon />
      </IconButton>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="left">Apellido</TableCell>
              <TableCell align="left">Cédula</TableCell>
              <TableCell align="left">Fecha de Nacimiento</TableCell>
              <TableCell align="left">Sexo</TableCell>
              <TableCell align="left">Dirección</TableCell>
              <TableCell align="left">Teléfono</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredPacientes) && filteredPacientes.length > 0 ? (
              filteredPacientes.map((paciente, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{paciente.nombre}</TableCell>
                  <TableCell align="left">{paciente.apellido}</TableCell>
                  <TableCell align="left">{paciente.cedula}</TableCell>
                  <TableCell align="left">
                    {paciente.fecha_nacimiento
                      ? paciente.fecha_nacimiento.toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="left">{paciente.sexo}</TableCell>
                  <TableCell align="left">{paciente.direccion}</TableCell>
                  <TableCell align="left">{paciente.telefono}</TableCell>
                  <TableCell align="left">{paciente.email}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell component="th" scope="row">
                  No se encontraron pacientes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PacientesFormulario handleClose={handleClose} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default PacientesTriajeList;