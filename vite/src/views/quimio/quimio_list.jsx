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
import QuimioFormulario from './quimio_formulario';

const testQuimios = [
  {
    id: '1',
    paciente_nombre: 'Juan Pérez',
    paciente_cedula: '123456789',
    fecha_inicio: new Date('2024-01-15'),
    fecha_fin: new Date('2024-06-15'),
    tipo_quimio: 'Cisplatino',
    dosis: '75 mg/m²',
    frecuencia: 'Cada 3 semanas',
    estado: 'En curso',
    medico: 'Dr. García',
    observaciones: 'Paciente tolera bien el tratamiento',
  },
  {
    id: '2',
    paciente_nombre: 'María Gómez',
    paciente_cedula: '987654321',
    fecha_inicio: new Date('2024-02-01'),
    fecha_fin: new Date('2024-07-01'),
    tipo_quimio: 'Carboplatino',
    dosis: 'AUC 6',
    frecuencia: 'Cada 4 semanas',
    estado: 'Completado',
    medico: 'Dr. Rodríguez',
    observaciones: 'Tratamiento completado exitosamente',
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

const QuimioList = ({ quimios = testQuimios }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredQuimios = quimios.filter((quimio) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quimio.paciente_nombre.toLowerCase().includes(searchLower) ||
      quimio.paciente_cedula.toLowerCase().includes(searchLower) ||
      quimio.tipo_quimio.toLowerCase().includes(searchLower) ||
      quimio.medico.toLowerCase().includes(searchLower)
    );
  });

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'en curso':
        return 'primary';
      case 'completado':
        return 'success';
      case 'suspendido':
        return 'warning';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar por paciente, cédula, tipo de quimio o médico"
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
        <Table sx={{ minWidth: 650 }} aria-label="quimioterapias table">
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Tipo Quimio</TableCell>
              <TableCell>Dosis</TableCell>
              <TableCell>Frecuencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Observaciones</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredQuimios) && filteredQuimios.length > 0 ? (
              filteredQuimios.map((quimio, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {quimio.paciente_nombre}
                  </TableCell>
                  <TableCell>{quimio.paciente_cedula}</TableCell>
                  <TableCell>
                    {quimio.fecha_inicio
                      ? quimio.fecha_inicio.toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {quimio.fecha_fin
                      ? quimio.fecha_fin.toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{quimio.tipo_quimio}</TableCell>
                  <TableCell>{quimio.dosis}</TableCell>
                  <TableCell>{quimio.frecuencia}</TableCell>
                  <TableCell>
                    <Chip
                      label={quimio.estado}
                      color={getEstadoColor(quimio.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{quimio.medico}</TableCell>
                  <TableCell>
                    {quimio.observaciones.length > 50
                      ? `${quimio.observaciones.substring(0, 50)}...`
                      : quimio.observaciones}
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
                <TableCell colSpan={11} align="center">
                  No se encontraron quimioterapias que coincidan con la búsqueda.
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
          <QuimioFormulario handleClose={handleClose} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default QuimioList;
