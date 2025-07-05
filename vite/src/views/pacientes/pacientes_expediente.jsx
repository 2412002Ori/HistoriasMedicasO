import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  MenuItem,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { expedientesAPI } from '../../api/expedientes';
import { pacientesAPI } from '../../api/pacientes';

const fetchDoctores = async () => {
  const response = await fetch('http://localhost:3003/api/doctores');
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Error al obtener doctores');
  }
  return result.data;
};

const TableExpedienteForm = ({ handleClose }) => {
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [doctorTratante, setDoctorTratante] = useState('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [idPaciente, setIdPaciente] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pacientesAPI.getAll().then(setPacientes).catch(() => setPacientes([]));
    fetchDoctores().then(setDoctores).catch(() => setDoctores([]));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!idPaciente || !fechaCreacion || !doctorTratante) {
      setSnackbar({ open: true, message: 'Todos los campos obligatorios', severity: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      await expedientesAPI.create({
        EXPIDPAC: idPaciente,
        EXPFECRE: fechaCreacion.toISOString().split('T')[0],
        EXPDOTRA: doctorTratante,
        EXPOBGEN: observacionesGenerales
      });
      setSnackbar({ open: true, message: 'Expediente creado exitosamente', severity: 'success' });
      if (handleClose) handleClose();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al crear expediente', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box mb={3}>
              <Typography variant="h5" align="center" gutterBottom>
                Formulario de Expediente
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="paciente-label">Paciente</InputLabel>
                    <Select
                      labelId="paciente-label"
                      id="id_paciente"
                      value={idPaciente}
                      label="Paciente"
                      onChange={(e) => setIdPaciente(e.target.value)}
                    >
                      {pacientes.map((paciente) => (
                        <MenuItem key={paciente.PACIDPAC} value={paciente.PACIDPAC}>
                          {paciente.PACNOMBR} {paciente.PACAPELL}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fecha de Creación"
                    value={fechaCreacion}
                    onChange={setFechaCreacion}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required sx={{ mb: 2 }} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel id="doctor-tratante-label">Doctor Tratante</InputLabel>
                    <Select
                      labelId="doctor-tratante-label"
                      id="doctor_tratante"
                      value={doctorTratante}
                      label="Doctor Tratante"
                      onChange={(e) => setDoctorTratante(e.target.value)}
                    >
                      {doctores.map((doctor) => (
                        <MenuItem key={doctor.DOCIDDOC} value={doctor.DOCIDDOC}>
                          {doctor.DOCNOMBR} {doctor.DOCAPELL}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones Generales"
                    multiline
                    rows={4}
                    value={observacionesGenerales}
                    onChange={(e) => setObservacionesGenerales(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} mt={3} display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                  Guardar
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default TableExpedienteForm;