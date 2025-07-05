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
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TableExpedienteForm from './pacientes_expediente';
import { pacientesAPI } from '../../api/pacientes';
import { expedientesAPI } from '../../api/expedientes';

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

const PacientesList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [cedulaSearchTerm, setCedulaSearchTerm] = useState('');
  const [nrohistoriaSearchTerm, setnrohistoriaSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pacientesData = await pacientesAPI.getAll();
        setPacientes(pacientesData);
        const expedientesData = await expedientesAPI.getAll();
        setExpedientes(expedientesData);
      } catch {
        setPacientes([]);
        setExpedientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCedulaSearch = (event) => {
    setCedulaSearchTerm(event.target.value);
  };

  const handlehistoriaSearch = (event) => {
    setnrohistoriaSearchTerm(event.target.value);
  };

  // Relacionar paciente con su expediente principal (el más reciente)
  const getExpedienteForPaciente = (pacienteId) => {
    const exps = expedientes.filter(e => e.EXPIDPAC === pacienteId);
    if (exps.length === 0) return '';
    // Devolver el expediente más reciente
    return exps.sort((a, b) => new Date(b.EXPFECRE) - new Date(a.EXPFECRE))[0].EXPIDEXP;
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const nrohistoriaStr = String(getExpedienteForPaciente(paciente.PACIDPAC) || '').toLowerCase();
    const cedulaStr = (paciente.PACCEDUL || '').toLowerCase();
    
    // Solo incluir pacientes que tengan expediente (número de historia)
    const tieneExpediente = getExpedienteForPaciente(paciente.PACIDPAC) !== '';
    
    return (
      tieneExpediente && // Solo pacientes con expediente
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
      <IconButton
        onClick={handleOpen}
        aria-label="add"
        sx={{ mb: 2, mt: 2, marginLeft: 2 }}
      >
        <AddIcon />
      </IconButton>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
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
                      {getExpedienteForPaciente(paciente.PACIDPAC) || '—'}
                    </TableCell>
                    <TableCell>{paciente.PACNOMBR}</TableCell>
                    <TableCell align="left">{paciente.PACAPELL}</TableCell>
                    <TableCell align="left">{paciente.PACCEDUL}</TableCell>
                    <TableCell align="left">
                      {paciente.PACFENAC ? new Date(paciente.PACFENAC).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="left">{paciente.PACSEXO_}</TableCell>
                    <TableCell align="left">{paciente.PACDIREC}</TableCell>
                    <TableCell align="left">{paciente.PACTELEF}</TableCell>
                    <TableCell align="left">{paciente.PACEMAIL}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar expediente o ver detalles">
                        <span>
                          <IconButton aria-label="edit" onClick={handleOpen}>
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
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
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TableExpedienteForm handleClose={handleClose} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default PacientesList;