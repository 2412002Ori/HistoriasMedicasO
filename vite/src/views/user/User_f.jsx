import React, { useState } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckIcon from '@mui/icons-material/Check';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

const UserForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    status: 'active',
    role: 'user',
  });

  // Placeholder state and options for select fields
  const [status, setStatus] = useState('active');
  const [role, setRole] = useState('user');
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];
  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <Container sx={{ mt: 4, mb: 4 , width: '100%' , alignItems: 'center'}}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              User Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
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
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item sx={{ width: '100%' }}>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        variant="outlined"
                      >
                        {statusOptions.map((option) => (
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
                        label="Role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        variant="outlined"
                      >
                        {roleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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

export default UserForm;