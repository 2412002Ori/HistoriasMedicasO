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
  Alert,
  Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { pacientesAPI } from '../../api/pacientes';

const fetchDoctores = async () => {
  const response = await fetch('http://localhost:3003/api/doctores');
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Error al obtener doctores');
  }
  return result.data;
};

const PacientesFormulario = ({ handleClose, onPatientCreated }) => {
  // Estados para los campos del formulario (adaptados a la estructura real de la BD)
  const [PACNOMBR, setPACNOMBR] = useState('');
  const [PACAPELL, setPACAPELL] = useState('');
  const [PACCEDUL, setPACCEDUL] = useState('');
  const [PACFENAC, setPACFENAC] = useState(null);
  const [PACSEXO_, setPACSEXO_] = useState('');
  const [PACDIREC, setPACDIREC] = useState('');
  const [PACTELEF, setPACTELEF] = useState('');
  const [PACEMAIL, setPACEMAIL] = useState('');

  // Estados para los errores de validación
  const [PACNOMBRError, setPACNOMBRError] = useState('');
  const [PACAPELLError, setPACAPELLError] = useState('');
  const [PACCEDULError, setPACCEDULError] = useState('');
  const [PACFENACError, setPACFENACError] = useState('');
  const [PACSEXO_Error, setPACSEXO_Error] = useState('');
  const [PACEMAILError, setPACEMAILError] = useState('');

  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para loading
  const [isLoading, setIsLoading] = useState(false);

  const [doctorId, setDoctorId] = useState('');
  const [doctores, setDoctores] = useState([]);

  const sexoOptions = [
    {
      value: 'M',
      label: 'Masculino',
    },
    {
      value: 'F',
      label: 'Femenino',
    }
  ];

  useEffect(() => {
    fetchDoctores().then(setDoctores).catch(() => setDoctores([]));
  }, []);

  // Función para mostrar notificaciones
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Función para cerrar notificación
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Función para validar el formulario
  const validarFormulario = () => {
    let isValid = true;

    // Validar nombre
    if (!PACNOMBR.trim()) {
      setPACNOMBRError('El nombre es obligatorio');
      isValid = false;
    } else {
      setPACNOMBRError('');
    }

    // Validar apellido
    if (!PACAPELL.trim()) {
      setPACAPELLError('El apellido es obligatorio');
      isValid = false;
    } else {
      setPACAPELLError('');
    }

    // Validar cédula
    if (!PACCEDUL.trim()) {
      setPACCEDULError('La cédula es obligatoria');
      isValid = false;
    } else if (!/^\d+$/.test(PACCEDUL)) {
      setPACCEDULError('La cédula debe contener solo números');
      isValid = false;
    } else {
      setPACCEDULError('');
    }

    // Validar fecha de nacimiento
    if (!PACFENAC) {
      setPACFENACError('La fecha de nacimiento es obligatoria');
      isValid = false;
    } else {
      setPACFENACError('');
    }

    // Validar sexo
    if (!PACSEXO_) {
      setPACSEXO_Error('El sexo es obligatorio');
      isValid = false;
    } else {
      setPACSEXO_Error('');
    }

    // Validar email
    if (PACEMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PACEMAIL)) {
      setPACEMAILError('El email no es válido');
      isValid = false;
    } else {
      setPACEMAILError('');
    }

    // Validar doctor
    if (!doctorId) {
      showSnackbar('Debes seleccionar un doctor tratante', 'error');
      isValid = false;
    }

    return isValid;
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setPACNOMBR('');
    setPACAPELL('');
    setPACCEDUL('');
    setPACFENAC(null);
    setPACSEXO_('');
    setPACDIREC('');
    setPACTELEF('');
    setPACEMAIL('');
    setDoctorId('');
    
    // Limpiar errores
    setPACNOMBRError('');
    setPACAPELLError('');
    setPACCEDULError('');
    setPACFENACError('');
    setPACSEXO_Error('');
    setPACEMAILError('');
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validarFormulario()) {
      showSnackbar('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const paciente = {
        PACNOMBR: PACNOMBR.trim(),
        PACAPELL: PACAPELL.trim(),
        PACCEDUL: PACCEDUL.trim(),
        PACFENAC: PACFENAC.toISOString().split('T')[0], // Convertir a formato YYYY-MM-DD
        PACSEXO_,
        PACDIREC: PACDIREC.trim(),
        PACTELEF: PACTELEF.trim(),
        PACEMAIL: PACEMAIL.trim(),
        DOCTORID: doctorId // Nuevo campo para el doctor
      };

      await pacientesAPI.create(paciente);
      
      showSnackbar('Paciente guardado exitosamente', 'success');
      limpiarFormulario();
      
      // Call the callback to refresh the parent component's list
      if (onPatientCreated) {
        onPatientCreated();
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
      showSnackbar(error.message || 'Error de conexión. Verifica que el servidor esté funcionando.', 'error');
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
                Formulario de Paciente
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={PACNOMBR}
                        onChange={(e) => setPACNOMBR(e.target.value)}
                        error={!!PACNOMBRError}
                        helperText={PACNOMBRError}
                        required
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        value={PACAPELL}
                        onChange={(e) => setPACAPELL(e.target.value)}
                        error={!!PACAPELLError}
                        helperText={PACAPELLError}
                        required
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Cédula"
                        value={PACCEDUL}
                        onChange={(e) => setPACCEDUL(e.target.value)}
                        error={!!PACCEDULError}
                        helperText={PACCEDULError}
                        required
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AssignmentIndIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        select
                        fullWidth
                        label="Sexo"
                        value={PACSEXO_}
                        onChange={(e) => setPACSEXO_(e.target.value)}
                        error={!!PACSEXO_Error}
                        helperText={PACSEXO_Error}
                        required
                        disabled={isLoading}
                        variant="outlined"
                      >
                        {sexoOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        select
                        fullWidth
                        label="Doctor Tratante"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        required
                        disabled={isLoading}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="">Seleccione un doctor</MenuItem>
                        {doctores.map((doctor) => (
                          <MenuItem key={doctor.DOCIDDOC} value={doctor.DOCIDDOC}>
                            {doctor.DOCNOMBR} {doctor.DOCAPELL}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                      <DatePicker
                        label="Fecha de Nacimiento"
                        value={PACFENAC}
                        onChange={(newValue) => setPACFENAC(newValue)}
                        disabled={isLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!PACFENACError}
                            helperText={PACFENACError}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CakeIcon />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        value={PACTELEF}
                        onChange={(e) => setPACTELEF(e.target.value)}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={PACEMAIL}
                        onChange={(e) => setPACEMAIL(e.target.value)}
                        error={!!PACEMAILError}
                        helperText={PACEMAILError}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        multiline
                        rows={3}
                        value={PACDIREC}
                        onChange={(e) => setPACDIREC(e.target.value)}
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} mt={3} display="flex" justifyContent="center">
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isLoading}
                  sx={{ minWidth: 120 }}
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default PacientesFormulario;