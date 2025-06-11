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
  Select
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

const TableExpedienteForm = () => {
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [doctorTratante, setDoctorTratante] = useState('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [pacientes, setPacientes] = useState([]); // Datos de pacientes para el select
  const [idPaciente, setIdPaciente] = useState('');

  // Simulate fetching doctors from an API
  const doctorOptions = [
    { id: 1, name: 'Dr. Smith' },
    { id: 2, name: 'Dr. Jones' },
    { id: 3, name: 'Dr. Brown' },
  ];

  // useEffect to fetch patients (replace with your actual API call)
  useEffect(() => {
    // Simulando una llamada a la API para obtener la lista de pacientes
    const fetchPacientes = async () => {
      // Replace this with your actual API endpoint
      const pacientesData = [
        { id_paciente: 1, nombre: 'Paciente 1' },
        { id_paciente: 2, nombre: 'Paciente 2' },
        { id_paciente: 3, nombre: 'Paciente 3' },
      ];
      setPacientes(pacientesData);
    };

    fetchPacientes();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const expedienteData = {
      id_paciente: idPaciente,
      fecha_creacion: fechaCreacion,
      doctor_tratante: doctorTratante,
      observaciones_generales: observacionesGenerales,
    };
    console.log('Expediente Data:', expedienteData);
    // You can send this data to your backend API
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
                        <MenuItem key={paciente.id_paciente} value={paciente.id_paciente}>
                          {paciente.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fecha de Creación"
                    value={fechaCreacion}
                    onChange={(newValue) => setFechaCreacion(newValue)}
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
                      {doctorOptions.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
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
                <Button type="submit" variant="contained" color="primary">
                  Guardar
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default TableExpedienteForm;