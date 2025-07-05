import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { doctoresAPI } from '../../api/doctores';
import { horariosAPI } from '../../api/horarios';

export default function DoctorForm({ handleClose, onDoctorCreated, doctor }) {
  const isEditMode = Boolean(doctor);
  const [form, setForm] = useState({
    DOCNOMBR: doctor?.DOCNOMBR || doctor?.nombre || "",
    DOCAPELL: doctor?.DOCAPELL || doctor?.apellido || "",
    DOCESPEC: doctor?.DOCESPEC || doctor?.especialidad || "",
    DOCTELEF: doctor?.DOCTELEF || doctor?.telefono || "",
    DOCEMAIL: doctor?.DOCEMAIL || doctor?.email || "",
  });
  // Horarios: [{ HORDIASE, HORHORIN, HORHORFI, id? }]
  const [horarios, setHorarios] = useState(doctor?.horarios || [
    { HORDIASE: '', HORHORIN: '', HORHORFI: '' }
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHorarioChange = (idx, field, value) => {
    setHorarios(horarios => horarios.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const handleAddHorario = () => {
    setHorarios([...horarios, { HORDIASE: '', HORHORIN: '', HORHORFI: '' }]);
  };

  const handleRemoveHorario = (idx) => {
    setHorarios(horarios => horarios.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    if (
      !form.DOCNOMBR ||
      !form.DOCAPELL ||
      !form.DOCESPEC ||
      !form.DOCTELEF ||
      !form.DOCEMAIL
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.DOCEMAIL)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      let doctorId;
      if (isEditMode) {
        const updated = await doctoresAPI.update(doctor.id || doctor.DOCID || doctor.DOCIDDOC, form);
        setSuccess("Doctor actualizado con éxito!");
        doctorId = updated.DOCIDDOC || updated.id || updated.DOCID;
      } else {
        const created = await doctoresAPI.create(form);
        setSuccess("Doctor registrado con éxito!");
        doctorId = created.DOCIDDOC || created.id || created.DOCID;
      }
      // Guardar horarios
      // Si es edición, podrías querer eliminar los horarios viejos antes de crear los nuevos, o actualizar individualmente
      await horariosAPI.create(doctorId, horarios);
      // Reset form solo si es creación
      if (!isEditMode) {
        setForm({
          DOCNOMBR: "",
          DOCAPELL: "",
          DOCESPEC: "",
          DOCTELEF: "",
          DOCEMAIL: "",
        });
        setHorarios([{ HORDIASE: '', HORHORIN: '', HORHORFI: '' }]);
      }
      // Callback para refrescar lista
      if (onDoctorCreated) {
        onDoctorCreated();
      }
      // Cerrar modal si handleClose está definido
      if (handleClose) {
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } catch (error) {
      setError(error.message || (isEditMode ? "Error al actualizar doctor." : "Error al registrar doctor. Verifica que el servidor esté funcionando."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {isEditMode ? "Editar Doctor" : "Registrar Doctor"}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  name="DOCNOMBR"
                  value={form.DOCNOMBR}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Apellido"
                  name="DOCAPELL"
                  value={form.DOCAPELL}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Especialidad"
                  name="DOCESPEC"
                  value={form.DOCESPEC}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Teléfono"
                  name="DOCTELEF"
                  value={form.DOCTELEF}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="DOCEMAIL"
                  type="email"
                  value={form.DOCEMAIL}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Horarios de Atención</Typography>
                {horarios.map((horario, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Día de la semana"
                        name="HORDIASE"
                        value={horario.HORDIASE}
                        onChange={e => handleHorarioChange(idx, 'HORDIASE', e.target.value)}
                        fullWidth
                        required
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Hora inicio"
                        name="HORHORIN"
                        type="time"
                        value={horario.HORHORIN}
                        onChange={e => handleHorarioChange(idx, 'HORHORIN', e.target.value)}
                        fullWidth
                        required
                        disabled={isLoading}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Hora fin"
                        name="HORHORFI"
                        type="time"
                        value={horario.HORHORFI}
                        onChange={e => handleHorarioChange(idx, 'HORHORFI', e.target.value)}
                        fullWidth
                        required
                        disabled={isLoading}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveHorario(idx)}
                        disabled={isLoading || horarios.length === 1}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={handleAddHorario}
                  disabled={isLoading}
                  sx={{ mt: 1 }}
                >
                  Agregar Horario
                </Button>
              </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                type="submit" 
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar Doctor' : 'Registrar Doctor')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}