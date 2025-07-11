import { useState, useEffect } from 'react';
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
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const QuimioFormulario = ({ handleClose }) => {
  // Estados para los campos del formulario
  const [expedientes, setExpedientes] = useState([]);
  const [expedienteId, setExpedienteId] = useState('');
  const [expedienteError, setExpedienteError] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [tipoQuimio, setTipoQuimio] = useState('');
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [estado, setEstado] = useState('');
  const [medico, setMedico] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estados para los errores de validación
  const [pacienteCedulaError, setPacienteCedulaError] = useState('');
  const [pacienteNombreError, setPacienteNombreError] = useState('');
  const [fechaInicioError, setFechaInicioError] = useState('');
  const [fechaFinError, setFechaFinError] = useState('');
  const [tipoQuimioError, setTipoQuimioError] = useState('');
  const [dosisError, setDosisError] = useState('');
  const [frecuenciaError, setFrecuenciaError] = useState('');
  const [estadoError, setEstadoError] = useState('');
  const [medicoError, setMedicoError] = useState('');

  const tipoQuimioOptions = [
    { value: 'cisplatino', label: 'Cisplatino' },
    { value: 'carboplatino', label: 'Carboplatino' },
    { value: 'oxaliplatino', label: 'Oxaliplatino' },
    { value: 'paclitaxel', label: 'Paclitaxel' },
    { value: 'docetaxel', label: 'Docetaxel' },
    { value: 'doxorrubicina', label: 'Doxorrubicina' },
    { value: 'epirrubicina', label: 'Epirrubicina' },
    { value: 'ciclofosfamida', label: 'Ciclofosfamida' },
    { value: 'ifosfamida', label: 'Ifosfamida' },
    { value: 'gemcitabina', label: 'Gemcitabina' },
    { value: 'fluorouracilo', label: 'Fluorouracilo' },
    { value: 'capecitabina', label: 'Capecitabina' },
    { value: 'vinorelbina', label: 'Vinorelbina' },
    { value: 'vinblastina', label: 'Vinblastina' },
    { value: 'vincristina', label: 'Vincristina' },
    { value: 'etoposido', label: 'Etopósido' },
    { value: 'irinotecan', label: 'Irinotecán' },
    { value: 'topotecan', label: 'Topotecán' },
    { value: 'bendamustina', label: 'Bendamustina' },
    { value: 'otros', label: 'Otros' },
  ];

  const frecuenciaOptions = [
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'cada_2_semanas', label: 'Cada 2 semanas' },
    { value: 'cada_3_semanas', label: 'Cada 3 semanas' },
    { value: 'cada_4_semanas', label: 'Cada 4 semanas' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'otros', label: 'Otros' },
  ];

  const estadoOptions = [
    { value: 'programado', label: 'Programado' },
    { value: 'en_curso', label: 'En curso' },
    { value: 'completado', label: 'Completado' },
    { value: 'suspendido', label: 'Suspendido' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  useEffect(() => {
    fetch('/api/expedientes')
      .then(res => res.json())
      .then(data => setExpedientes(data.data || []))
      .catch(() => setExpedientes([]));
  }, []);

  console.log('Expedientes cargados:', expedientes);

  // Función para validar el formulario
  const validarFormulario = () => {
    let isValid = true;

    // Validar expediente
    if (!expedienteId) {
      setExpedienteError('El expediente es obligatorio');
      isValid = false;
    } else {
      setExpedienteError('');
    }

    // Validar fecha de inicio
    if (!fechaInicio) {
      setFechaInicioError('La fecha de inicio es obligatoria');
      isValid = false;
    } else {
      setFechaInicioError('');
    }

    // Validar fecha de fin
    if (!fechaFin) {
      setFechaFinError('La fecha de fin es obligatoria');
      isValid = false;
    } else if (fechaInicio && fechaFin && fechaFin <= fechaInicio) {
      setFechaFinError('La fecha de fin debe ser posterior a la fecha de inicio');
      isValid = false;
    } else {
      setFechaFinError('');
    }

    // Validar tipo de quimioterapia
    if (!tipoQuimio) {
      setTipoQuimioError('El tipo de quimioterapia es obligatorio');
      isValid = false;
    } else {
      setTipoQuimioError('');
    }

    // Validar dosis
    if (!dosis.trim()) {
      setDosisError('La dosis es obligatoria');
      isValid = false;
    } else {
      setDosisError('');
    }

    // Validar frecuencia
    if (!frecuencia) {
      setFrecuenciaError('La frecuencia es obligatoria');
      isValid = false;
    } else {
      setFrecuenciaError('');
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
      const quimio = {
        QUIIDEXP: expedienteId,
        QUIFEAPL: fechaInicio ? fechaInicio.toISOString().split('T')[0] : '',
        QUITIPOQ: tipoQuimio,
        QUIDOSIS: dosis,
        QUIOBSE_: observaciones,
      };
      // Aquí deberías llamar a la API para guardar quimioterapia
      console.log('Datos de quimioterapia (adaptados):', quimio);
      
      // Reiniciar el formulario
      setExpedienteId('');
      setFechaInicio(null);
      setFechaFin(null);
      setTipoQuimio('');
      setDosis('');
      setFrecuencia('');
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
                Formulario de Quimioterapia
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Primera columna */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <FormControl fullWidth required error={!!expedienteError}>
                        <InputLabel id="expediente-label">Expediente</InputLabel>
                        <Select
                          labelId="expediente-label"
                          id="expediente"
                          value={expedienteId}
                          label="Expediente"
                          onChange={(e) => setExpedienteId(e.target.value)}
                        >
                          {expedientes.map((exp) => (
                            <MenuItem key={exp.expidexp} value={String(exp.expidexp)}>
                              {`N° ${exp.expidexp} - ${exp.pacnombr} ${exp.pacapell}`}
                            </MenuItem>
                          ))}
                        </Select>
                        {expedienteError && <Typography color="error">{expedienteError}</Typography>}
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <DatePicker
                        label="Fecha de Inicio"
                        value={fechaInicio}
                        onChange={setFechaInicio}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fechaInicioError}
                            helperText={fechaInicioError}
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
                        label="Fecha de Fin"
                        value={fechaFin}
                        onChange={setFechaFin}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fechaFinError}
                            helperText={fechaFinError}
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
                      <FormControl fullWidth error={!!tipoQuimioError} required>
                        <InputLabel>Tipo de Quimioterapia</InputLabel>
                        <Select
                          value={tipoQuimio}
                          onChange={(e) => setTipoQuimio(e.target.value)}
                          label="Tipo de Quimioterapia"
                          startAdornment={
                            <InputAdornment position="start">
                              <MedicationIcon />
                            </InputAdornment>
                          }
                        >
                          {tipoQuimioOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {tipoQuimioError && (
                          <Typography variant="caption" color="error">
                            {tipoQuimioError}
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
                        label="Dosis"
                        value={dosis}
                        onChange={(e) => setDosis(e.target.value)}
                        error={!!dosisError}
                        helperText={dosisError}
                        required
                        placeholder="Ej: 75 mg/m², AUC 6"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MedicationIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl fullWidth error={!!frecuenciaError} required>
                        <InputLabel>Frecuencia</InputLabel>
                        <Select
                          value={frecuencia}
                          onChange={(e) => setFrecuencia(e.target.value)}
                          label="Frecuencia"
                          startAdornment={
                            <InputAdornment position="start">
                              <ScheduleIcon />
                            </InputAdornment>
                          }
                        >
                          {frecuenciaOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {frecuenciaError && (
                          <Typography variant="caption" color="error">
                            {frecuenciaError}
                          </Typography>
                        )}
                      </FormControl>
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
                      Guardar Quimioterapia
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

export default QuimioFormulario;
