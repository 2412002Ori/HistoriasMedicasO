import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PacientesFormulario from './pacientes_formulario';
import { pacientesAPI } from '../../api/pacientes';

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

const PacientesTriajeList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cedulaSearchTerm, setCedulaSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch pacientes from API
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await pacientesAPI.getAll();
      setPacientes(data);
    } catch (err) {
      console.error('Error fetching pacientes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load pacientes on component mount
  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCedulaSearch = (event) => {
    setCedulaSearchTerm(event.target.value);
  };

  // Handle successful patient creation
  const handlePatientCreated = () => {
    handleClose();
    fetchPacientes(); // Refresh the list
    setSnackbar({
      open: true,
      message: 'Paciente creado exitosamente',
      severity: 'success'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const cedulaStr = paciente.PACCEDUL?.toLowerCase() || '';
    return cedulaStr.includes(cedulaSearchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error al cargar pacientes: {error}
      </Alert>
    );
  }

  return (
    <>
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
                    key={paciente.PACIDPAC || paciente.pacidpac || paciente.PACID || index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{paciente.PACNOMBR || paciente.pacnombr || 'N/A'}</TableCell>
                    <TableCell align="left">{paciente.PACAPELL || paciente.pacapell || 'N/A'}</TableCell>
                    <TableCell align="left">{paciente.PACCEDUL || paciente.paccedul || 'N/A'}</TableCell>
                    <TableCell align="left">
                      {paciente.PACFENAC || paciente.pacfenac
                        ? new Date(paciente.PACFENAC || paciente.pacfenac).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="left">{paciente.PACSEXO_ || paciente.pacsexo_ || 'N/A'}</TableCell>
                    <TableCell align="left">{paciente.PACDIREC || paciente.pacdirec || 'N/A'}</TableCell>
                    <TableCell align="left">{paciente.PACTELEF || paciente.pactelef || 'N/A'}</TableCell>
                    <TableCell align="left">{paciente.PACEMAIL || paciente.pacemail || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="edit">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {cedulaSearchTerm 
                      ? 'No se encontraron pacientes que coincidan con la búsqueda.'
                      : 'No hay pacientes registrados.'
                    }
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
            <PacientesFormulario 
              handleClose={handleClose} 
              onPatientCreated={handlePatientCreated}
            />
          </Box>
        </Modal>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PacientesTriajeList;