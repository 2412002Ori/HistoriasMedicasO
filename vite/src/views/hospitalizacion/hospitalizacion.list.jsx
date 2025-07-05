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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HospitalizacionFormulario from './hospitalizacion_formulario';

const testHospitalizaciones = [
  {
    id: '1',
    paciente_nombre: 'Juan Pérez',
    paciente_cedula: '123456789',
    fecha_ingreso: new Date('2024-01-15'),
    fecha_egreso: new Date('2024-01-20'),
    habitacion: '301',
    cama: 'A',
    diagnostico: 'Neumonía',
    estado: 'Alta',
    medico: 'Dr. García',
    observaciones: 'Paciente evoluciona favorablemente',
    motivo_ingreso: 'Dificultad respiratoria',
  },
  {
    id: '2',
    paciente_nombre: 'María Gómez',
    paciente_cedula: '987654321',
    fecha_ingreso: new Date('2024-02-01'),
    fecha_egreso: null,
    habitacion: '205',
    cama: 'B',
    diagnostico: 'Apendicitis aguda',
    estado: 'Hospitalizado',
    medico: 'Dr. Rodríguez',
    observaciones: 'Pendiente de cirugía',
    motivo_ingreso: 'Dolor abdominal agudo',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '1000px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const HospitalizacionList = ({ hospitalizaciones = testHospitalizaciones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHospitalizaciones = hospitalizaciones.filter((hospitalizacion) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hospitalizacion.paciente_nombre.toLowerCase().includes(searchLower) ||
      hospitalizacion.paciente_cedula.toLowerCase().includes(searchLower) ||
      hospitalizacion.diagnostico.toLowerCase().includes(searchLower) ||
      hospitalizacion.medico.toLowerCase().includes(searchLower) ||
      hospitalizacion.habitacion.toLowerCase().includes(searchLower)
    );
  });

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'hospitalizado':
        return 'primary';
      case 'alta':
        return 'success';
      case 'transferido':
        return 'warning';
      case 'fallecido':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar por paciente, cédula, diagnóstico, médico o habitación"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={handleOpen}
          aria-label="add"
          color="primary"
          size="large"
        >
          <AddIcon />
        </IconButton>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="hospitalizaciones table">
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
              <TableCell>Fecha Egreso</TableCell>
              <TableCell>Habitación</TableCell>
              <TableCell>Cama</TableCell>
              <TableCell>Diagnóstico</TableCell>
              <TableCell>Motivo Ingreso</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Observaciones</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredHospitalizaciones) && filteredHospitalizaciones.length > 0 ? (
              filteredHospitalizaciones.map((hospitalizacion, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {hospitalizacion.paciente_nombre}
                  </TableCell>
                  <TableCell>{hospitalizacion.paciente_cedula}</TableCell>
                  <TableCell>
                    {hospitalizacion.fecha_ingreso
                      ? hospitalizacion.fecha_ingreso.toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {hospitalizacion.fecha_egreso
                      ? hospitalizacion.fecha_egreso.toLocaleDateString()
                      : 'Pendiente'}
                  </TableCell>
                  <TableCell>{hospitalizacion.habitacion}</TableCell>
                  <TableCell>{hospitalizacion.cama}</TableCell>
                  <TableCell>{hospitalizacion.diagnostico}</TableCell>
                  <TableCell>
                    {hospitalizacion.motivo_ingreso.length > 30
                      ? `${hospitalizacion.motivo_ingreso.substring(0, 30)}...`
                      : hospitalizacion.motivo_ingreso}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={hospitalizacion.estado}
                      color={getEstadoColor(hospitalizacion.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{hospitalizacion.medico}</TableCell>
                  <TableCell>
                    {hospitalizacion.observaciones.length > 50
                      ? `${hospitalizacion.observaciones.substring(0, 50)}...`
                      : hospitalizacion.observaciones}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit" color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No se encontraron hospitalizaciones que coincidan con la búsqueda.
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
          <HospitalizacionFormulario handleClose={handleClose} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default HospitalizacionList;
