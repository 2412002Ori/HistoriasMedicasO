import { useState } from 'react';
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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HotelIcon from '@mui/icons-material/Hotel';
import BedIcon from '@mui/icons-material/Bed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventNoteIcon from '@mui/icons-material/EventNote';

const HospitalizacionFormulario = ({ handleClose }) => {
  // Estados para los campos del formulario
  const [pacienteCedula, setPacienteCedula] = useState('');
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(null);
  const [fechaEgreso, setFechaEgreso] = useState(null);
  const [habitacion, setHabitacion] = useState('');
  const [cama, setCama] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [motivoIngreso, setMotivoIngreso] = useState('');
  const [estado, setEstado] = useState('');
  const [medico, setMedico] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estados para los errores de validación
  const [pacienteCedulaError, setPacienteCedulaError] = useState('');
  const [pacienteNombreError, setPacienteNombreError] = useState('');
  const [fechaIngresoError, setFechaIngresoError] = useState('');
  const [fechaEgresoError, setFechaEgresoError] = useState('');
  const [habitacionError, setHabitacionError] = useState('');
  const [camaError, setCamaError] = useState('');
  const [diagnosticoError, setDiagnosticoError] = useState('');
  const [motivoIngresoError, setMotivoIngresoError] = useState('');
  const [estadoError, setEstadoError] = useState('');
  const [medicoError, setMedicoError] = useState('');

  const camaOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
  ];

  const estadoOptions = [
    { value: 'hospitalizado', label: 'Hospitalizado' },
    { value: 'alta', label: 'Alta' },
    { value: 'transferido', label: 'Transferido' },
    { value: 'fallecido', label: 'Fallecido' },
  ];

  // Función para validar el formulario
  const validarFormulario = () => {
    let isValid = true;

    // Validar cédula del paciente
    if (!pacienteCedula.trim()) {
      setPacienteCedulaError('La cédula del paciente es obligatoria');
      isValid = false;
    } else if (!/^\d+$/.test(pacienteCedula)) {
      setPacienteCedulaError('La cédula debe contener solo números');
      isValid = false;
    } else {
      setPacienteCedulaError('');
    }

    // Validar nombre del paciente
    if (!pacienteNombre.trim()) {
      setPacienteNombreError('El nombre del paciente es obligatorio');
      isValid = false;
    } else {
      setPacienteNombreError('');
    }

    // Validar fecha de ingreso
    if (!fechaIngreso) {
      setFechaIngresoError('La fecha de ingreso es obligatoria');
      isValid = false;
    } else {
      setFechaIngresoError('');
    }

    // Validar fecha de egreso (opcional pero si se ingresa debe ser posterior al ingreso)
    if (fechaEgreso && fechaIngreso && fechaEgreso <= fechaIngreso) {
      setFechaEgresoError('La fecha de egreso debe ser posterior a la fecha de ingreso');
      isValid = false;
    } else {
      setFechaEgresoError('');
    }

    // Validar habitación
    if (!habitacion.trim()) {
      setHabitacionError('La habitación es obligatoria');
      isValid = false;
    } else {
      setHabitacionError('');
    }

    // Validar cama
    if (!cama) {
      setCamaError('La cama es obligatoria');
      isValid = false;
    } else {
      setCamaError('');
    }

    // Validar diagnóstico
    if (!diagnostico.trim()) {
      setDiagnosticoError('El diagnóstico es obligatorio');
      isValid = false;
    } else {
      setDiagnosticoError('');
    }

    // Validar motivo de ingreso
    if (!motivoIngreso.trim()) {
      setMotivoIngresoError('El motivo de ingreso es obligatorio');
      isValid = false;
    } else {
      setMotivoIngresoError('');
    }

    // Validar estado
    if (!estado) {
      setEstadoError('El estado es obligatorio');
      isValid = false;
    } else {
      setEstadoError('');
    }

    // Validar médico
    if (!medico.trim()) {
      setMedicoError('El médico es obligatorio');
      isValid = false;
    } else {
      setMedicoError('');
    }

    return isValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validarFormulario()) {
      // Adaptar los datos al formato del backend
      const hospitalizacion = {
        HOSIDEXP: pacienteCedula, // O el ID de expediente correspondiente
        HOSFEING: fechaIngreso ? fechaIngreso.toISOString().split('T')[0] : '',
        HOSFEEGR: fechaEgreso ? fechaEgreso.toISOString().split('T')[0] : '',
        HOSHABIT: habitacion,
        HOSMOTIV: motivoIngreso,
        HOSOBSE_: observaciones,
      };
      // Aquí deberías llamar a la API para guardar hospitalización
      console.log('Datos de hospitalización (adaptados):', hospitalizacion);
      
      // Reiniciar el formulario
      setPacienteCedula('');
      setPacienteNombre('');
      setFechaIngreso(null);
      setFechaEgreso(null);
      setHabitacion('');
      setCama('');
      setDiagnostico('');
      setMotivoIngreso('');
      setEstado('');
      setMedico('');
      setObservaciones('');
      
      // Cerrar el modal si se proporciona la función
      if (handleClose) {
        handleClose();
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container sx={{ mt: 2, mb: 2 }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Box mb={3}>
              <Typography variant="h5" align="center" gutterBottom>
                Formulario de Hospitalización
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Primera columna */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Cédula del Paciente"
                        value={pacienteCedula}
                        onChange={(e) => setPacienteCedula(e.target.value)}
                        error={!!pacienteCedulaError}
                        helperText={pacienteCedulaError}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonSearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Nombre del Paciente"
                        value={pacienteNombre}
                        onChange={(e) => setPacienteNombre(e.target.value)}
                        error={!!pacienteNombreError}
                        helperText={pacienteNombreError}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Fecha de Ingreso"
                        value={fechaIngreso}
                        onChange={setFechaIngreso}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fechaIngresoError}
                            helperText={fechaIngresoError}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Fecha de Egreso (Opcional)"
                        value={fechaEgreso}
                        onChange={setFechaEgreso}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fechaEgresoError}
                            helperText={fechaEgresoError}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Habitación"
                        value={habitacion}
                        onChange={(e) => setHabitacion(e.target.value)}
                        error={!!habitacionError}
                        helperText={habitacionError}
                        required
                        placeholder="Ej: 301, 205"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HotelIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl fullWidth error={!!camaError} required>
                        <InputLabel>Cama</InputLabel>
                        <Select
                          value={cama}
                          onChange={(e) => setCama(e.target.value)}
                          label="Cama"
                          startAdornment={
                            <InputAdornment position="start">
                              <BedIcon />
                            </InputAdornment>
                          }
                        >
                          {camaOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {camaError && (
                          <Typography variant="caption" color="error">
                            {camaError}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Segunda columna */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Diagnóstico"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                        error={!!diagnosticoError}
                        helperText={diagnosticoError}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalHospitalIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Motivo de Ingreso"
                        value={motivoIngreso}
                        onChange={(e) => setMotivoIngreso(e.target.value)}
                        error={!!motivoIngresoError}
                        helperText={motivoIngresoError}
                        required
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventNoteIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl fullWidth error={!!estadoError} required>
                        <InputLabel>Estado</InputLabel>
                        <Select
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          label="Estado"
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalHospitalIcon />
                            </InputAdornment>
                          }
                        >
                          {estadoOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {estadoError && (
                          <Typography variant="caption" color="error">
                            {estadoError}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Médico Responsable"
                        value={medico}
                        onChange={(e) => setMedico(e.target.value)}
                        error={!!medicoError}
                        helperText={medicoError}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        multiline
                        rows={4}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AssignmentIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Botones */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      Guardar Hospitalización
                    </Button>
                    {handleClose && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={handleClose}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default HospitalizacionFormulario;
