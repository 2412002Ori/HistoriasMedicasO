import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

const UserForm = ({ initialValues, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    status: 'active',
    role: 'user',
    id: '',
  });

  const [errors, setErrors] = useState({});

  // Opciones para los campos select
  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'suspended', label: 'Suspendido' },
  ];

  const roleOptions = [
    { value: 'user', label: 'Usuario' },
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Administrador' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Enfermero/a' },
    { value: 'receptionist', label: 'Recepcionista' },
  ];

  // Cargar datos iniciales si se está editando
  useEffect(() => {
    if (initialValues && isEditing) {
      setFormData({
        name: initialValues.name || '',
        lastname: initialValues.lastname || '',
        email: initialValues.email || '',
        password: '',
        status: initialValues.status || 'active',
        role: initialValues.role || 'user',
        id: initialValues.id,
      });
    } else if (!isEditing) {
      setFormData({
        name: '',
        lastname: '',
        email: '',
        password: '',
        status: 'active',
        role: 'user',
        id: '',
      });
    }
  }, [initialValues, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'El apellido es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es obligatorio';
    }

    if (!formData.status) {
      newErrors.status = 'El estado es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        role: formData.role || 'user',
        id: isEditing ? formData.id : undefined,
      };
      console.log('Payload enviado desde el formulario:', userData);
      if (onSubmit) {
        onSubmit(userData);
      }
      if (!isEditing) {
        setFormData({
          name: '',
          lastname: '',
          email: '',
          password: '',
          status: 'active',
          role: 'user',
          id: '',
        });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container sx={{ mt: 2, mb: 2, width: '100%' }}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Primera columna */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
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
                        label="Apellido"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        error={!!errors.lastname}
                        helperText={errors.lastname}
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        required={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Segunda columna */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <FormControl fullWidth error={!!errors.role} required>
                        <InputLabel>Rol</InputLabel>
                        <Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          label="Rol"
                          startAdornment={
                            <InputAdornment position="start">
                              <SecurityIcon />
                            </InputAdornment>
                          }
                        >
                          {roleOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error">
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl fullWidth error={!!errors.status} required>
                        <InputLabel>Estado</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          label="Estado"
                          startAdornment={
                            <InputAdornment position="start">
                              <AssignmentIndIcon />
                            </InputAdornment>
                          }
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.status && (
                          <Typography variant="caption" color="error">
                            {errors.status}
                          </Typography>
                        )}
                      </FormControl>
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
                      startIcon={<CheckIcon />}
                    >
                      {isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}
                    </Button>
                    {onCancel && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={onCancel}
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

export default UserForm;