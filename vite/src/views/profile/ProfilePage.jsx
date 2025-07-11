import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { PhotoCamera, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import MainCard from '../../ui-component/cards/MainCard';
import { updateUserProfile, uploadProfileImage } from '../../api/user';

const ProfilePage = () => {
  const { user, updateUser, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    USEFNAME: user?.nombre || '',
    USELNAME: user?.apellido || '',
    USEEMAIL: user?.email || '',
    USEPASSW: '',
    USEPASSW_CONFIRM: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar contraseñas si se están cambiando
    if (formData.USEPASSW && formData.USEPASSW !== formData.USEPASSW_CONFIRM) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Actualizar perfil
      const updateData = {
        USEFNAME: formData.USEFNAME,
        USELNAME: formData.USELNAME,
        USEEMAIL: formData.USEEMAIL
      };

      if (formData.USEPASSW) {
        updateData.USEPASSW = formData.USEPASSW;
      }

      const response = await updateUserProfile(token, updateData);
      
      if (response.success) {
        // Actualizar imagen si se seleccionó una
        if (selectedFile) {
          try {
            const imageResponse = await uploadProfileImage(token, selectedFile);
            if (imageResponse.success) {
              response.data.profileImage = imageResponse.data.imageUrl;
            }
          } catch (imageError) {
            console.error('Error uploading image:', imageError);
          }
        }

        // Actualizar contexto con nuevos datos
        updateUser(response.data);
        
        setSuccess('Perfil actualizado exitosamente');
        setFormData(prev => ({
          ...prev,
          USEPASSW: '',
          USEPASSW_CONFIRM: ''
        }));
        setSelectedFile(null);
      }
    } catch (error) {
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      USEFNAME: user?.nombre || '',
      USELNAME: user?.apellido || '',
      USEEMAIL: user?.email || '',
      USEPASSW: '',
      USEPASSW_CONFIRM: ''
    });
    setImagePreview(null);
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <MainCard title="Perfil de Usuario">
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Sección de Foto de Perfil */}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Foto de Perfil
                  </Typography>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={imagePreview || user?.profileImage}
                      sx={{
                        width: 120,
                        height: 120,
                        cursor: 'pointer',
                        border: '3px solid #e0e0e0'
                      }}
                      onClick={handleImageClick}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }}
                      onClick={handleImageClick}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </Box>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Haz clic en la imagen para cambiar la foto
                  </Typography>
                </Box>
              </Grid>

              {/* Sección de Información Personal */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="USEFNAME"
                      value={formData.USEFNAME}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      name="USELNAME"
                      value={formData.USELNAME}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="USEEMAIL"
                      type="email"
                      value={formData.USEEMAIL}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Cambiar Contraseña
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nueva Contraseña"
                      name="USEPASSW"
                      type="password"
                      value={formData.USEPASSW}
                      onChange={handleInputChange}
                      helperText="Deja vacío para mantener la contraseña actual"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirmar Nueva Contraseña"
                      name="USEPASSW_CONFIRM"
                      type="password"
                      value={formData.USEPASSW_CONFIRM}
                      onChange={handleInputChange}
                      error={formData.USEPASSW && formData.USEPASSW !== formData.USEPASSW_CONFIRM}
                      helperText={formData.USEPASSW && formData.USEPASSW !== formData.USEPASSW_CONFIRM ? 'Las contraseñas no coinciden' : ''}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </MainCard>
    </Box>
  );
};

export default ProfilePage; 