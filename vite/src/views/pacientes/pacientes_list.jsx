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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const testPacientes = [
  {
    nro_historia: '1234', // Added history number
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
    nro_historia: '5678', // Added history number
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

const PacientesList = ({ pacientes = testPacientes }) => {
  const [cedulaSearchTerm, setCedulaSearchTerm] = useState('');
  const [nrohistoriaSearchTerm, setnrohistoriaSearchTerm] = useState('');

  const handleCedulaSearch = (event) => {
    setCedulaSearchTerm(event.target.value);
  };

  const handlehistoriaSearch = (event) => {
    setnrohistoriaSearchTerm(event.target.value);
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const nrohistoriaStr = paciente.nro_historia.toLowerCase();
    const cedulaStr = paciente.cedula.toLowerCase();
    return (
      nrohistoriaStr.includes(nrohistoriaSearchTerm.toLowerCase()) &&
      cedulaStr.includes(cedulaSearchTerm.toLowerCase())
    );
  });

  return (
    <Paper>
      <TextField
        label="Buscar por N° Historia"
        value={nrohistoriaSearchTerm}
        onChange={handlehistoriaSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, mt: 2, marginLeft: 2 }}
      />
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
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>N° Historia</TableCell>
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
                  <TableCell component="th" scope="row">
                    {paciente.nro_historia}
                  </TableCell>
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
    </Paper>
  );
};

export default PacientesList;