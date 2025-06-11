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
  InputAdornment
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

const PacientesFormulario = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [sexo, setSexo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [tipoPaciente, setTipoPaciente] = useState('');

  // Estados para los errores de validación
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [fechaNacimientoError, setFechaNacimientoError] = useState('');
  const [sexoError, setSexoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [tipoPacienteError, setTipoPacienteError] = useState('');

  const sexoption = [
    {
      value: 'femenino',
      label: 'femenino',
    },
    {
      value: 'masculino',
      label: 'Masculino',
    },
    {
      value: 'otro',
      label: '  Otro',
    }
  ];

  const tipoPacienteOptions = [
    {
      value: 'triaje',
      label: 'Triaje',
    },
    {
      value: 'oncologico',
      label: 'Oncológico',
    },
  ];

  // Función para validar el formulario
  const validarFormulario = () => {
    let isValid = true;

    // Validar nombre
    if (!nombre.trim()) {
      setNombreError('El nombre es obligatorio');
      isValid = false;
    } else {
      setNombreError('');
    }

    // Validar apellido
    if (!apellido.trim()) {
      setApellidoError('El apellido es obligatorio');
      isValid = false;
    } else {
      setApellidoError('');
    }

    // Validar cédula
    if (!cedula.trim()) {
      setCedulaError('La cédula es obligatoria');
      isValid = false;
    } else if (!/^\d+$/.test(cedula)) {
      setCedulaError('La cédula debe contener solo números');
      isValid = false;
    } else {
      setCedulaError('');
    }

    // Validar fecha de nacimiento
    if (!fechaNacimiento) {
      setFechaNacimientoError('La fecha de nacimiento es obligatoria');
      isValid = false;
    } else {
      setFechaNacimientoError('');
    }

    // Validar sexo
    if (!sexo) {
      setSexoError('El sexo es obligatorio');
      isValid = false;
    } else {
      setSexoError('');
    }
    // Validar tipo de paciente
    if (!tipoPaciente) {
      setTipoPacienteError('El tipo de paciente es obligatorio');
      isValid = false;
    } else {
      setTipoPacienteError('');
    }

    // Validar email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('El email no es válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validarFormulario()) {
      // Aquí puedes enviar los datos del formulario a tu backend
      const paciente = {
        nombre,
        apellido,
        cedula,
        fecha_nacimiento: fechaNacimiento,
        sexo,
        direccion,
        telefono,
        email,
        tipoPaciente,
      };
      console.log('Datos del paciente:', paciente);
      // Reiniciar el formulario
      setNombre('');
      setApellido('');
      setCedula('');
      setFechaNacimiento(null);
      setSexo('');
      setDireccion('');
      setTelefono('');
      setEmail('');
      setTipoPaciente('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container sx={{ mt: 4, mb: 4 }}> {/* Increased container width */}
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}> {/* Increased padding for card content */}
            <Box mb={3}>
              <Typography variant="h5" align="center" gutterBottom>
                Formulario de Paciente
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}> {/* First Column */}
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}> {/* Ensure full width for TextField within Grid */}
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        error={!!nombreError}
                        helperText={nombreError}
                        required
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
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        error={!!apellidoError}
                        helperText={apellidoError}
                        required
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
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        error={!!cedulaError}
                        helperText={cedulaError}
                        required
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
                        label="Tipo de Paciente"
                        value={tipoPaciente}
                        onChange={(e) => setTipoPaciente(e.target.value)}
                        error={!!tipoPacienteError}
                        helperText={tipoPacienteError}
                        required
                        variant="outlined"
                      >
                        {tipoPacienteOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}> {/* Second Column */}
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                      <DatePicker
                        label="Fecha de Nacimiento"
                        value={fechaNacimiento}
                        onChange={(newValue) => setFechaNacimiento(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!fechaNacimientoError}
                            helperText={fechaNacimientoError}
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
                        select
                        fullWidth
                        label="Género"
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        helperText="Please select your gender"
                        variant="outlined"
                      >
                        {sexoption.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
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
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
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
            </form>
          </CardContent>
        </Card>
        <Grid item xs={12} mt={3} display="flex" justifyContent="center">
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default PacientesFormulario;