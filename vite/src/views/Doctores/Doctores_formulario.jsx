import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function DoctorForm() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    telefono: "",
    email: "",
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !form.nombre ||
      !form.apellido ||
      !form.especialidad ||
      !form.telefono ||
      !form.email ||
      !form.dia_semana ||
      !form.hora_inicio ||
      !form.hora_fin
    ) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    // Here you would typically send the form data to your backend
    console.log("Doctor data:", form);
    setSuccess("Doctor registrado con éxito!");

    // Reset form after successful submission (optional)
    setForm({
      nombre: "",
      apellido: "",
      especialidad: "",
      telefono: "",
      email: "",
      dia_semana: "",
      hora_inicio: "",
      hora_fin: "",
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h6">Registrar Doctor</Typography>

      <TextField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Apellido"
        name="apellido"
        value={form.apellido}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Especialidad"
        name="especialidad"
        value={form.especialidad}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Teléfono"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel id="dia-semana-label">Día de la Semana</InputLabel>
        <Select
          labelId="dia-semana-label"
          name="dia_semana"
          value={form.dia_semana}
          label="Día de la Semana"
          onChange={handleChange}
        >
          {diasSemana.map((dia) => (
            <MenuItem key={dia} value={dia}>
              {dia}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Hora de Inicio"
        type="time"
        name="hora_inicio"
        InputLabelProps={{ shrink: true }}
        value={form.hora_inicio}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Hora de Fin"
        type="time"
        name="hora_fin"
        InputLabelProps={{ shrink: true }}
        value={form.hora_fin}
        onChange={handleChange}
        fullWidth
        required
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Button variant="contained" type="submit">
        Registrar Doctor
      </Button>
    </Box>
  );
}