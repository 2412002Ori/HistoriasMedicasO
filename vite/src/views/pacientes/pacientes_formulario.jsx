import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';

const PacientesFormulario = () => {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [sexo, setSexo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  // Estados para los errores de validación
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [fechaNacimientoError, setFechaNacimientoError] = useState('');
  const [sexoError, setSexoError] = useState('');
  const [emailError, setEmailError] = useState('');

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
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container maxWidth="md">
        <Box mt={4} mb={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Formulario de Paciente Oncológico
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  error={!!nombreError}
                  helperText={nombreError}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  error={!!apellidoError}
                  helperText={apellidoError}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  error={!!cedulaError}
                  helperText={cedulaError}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!sexoError} required sx={{ mb: 2 }}>
                  <InputLabel id="sexo-label">Sexo</InputLabel>
                  <Select
                    labelId="sexo-label"
                    id="sexo"
                    value={sexo}
                    label="Sexo"
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <MenuItem value="masculino">Masculino</MenuItem>
                    <MenuItem value="femenino">Femenino</MenuItem>
                    <MenuItem value="otro">Otro</MenuItem>
                  </Select>
                  {sexoError && <FormHelperText>{sexoError}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  multiline
                  rows={3}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default PacientesFormulario;