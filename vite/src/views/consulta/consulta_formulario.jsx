import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";

// Mock data for expedientes and doctores - replace with your actual data source
const expedientes = [
  { id: 1, nombre: "Expediente 1" },
  { id: 2, nombre: "Expediente 2" },
];

const doctores = [
  { id: 1, nombre: "Doctor 1", horario: { inicio: "08:00", fin: "17:00" } },
  { id: 2, nombre: "Doctor 2", horario: { inicio: "09:00", fin: "18:00" } },
];

export default function ConsultaForm() {
  const [form, setForm] = useState({
    id_expediente: "",
    id_doctor: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const doctor = doctores.find((d) => d.id === parseInt(form.id_doctor));
    if (!doctor) return setError("Doctor no encontrado");

    const horaConsulta = form.hora;
    const [h, m] = horaConsulta.split(":").map(Number);
    const inicio = parseInt(doctor.horario.inicio.replace(":", ""));
    const fin = parseInt(doctor.horario.fin.replace(":", ""));
    const actual = h * 100 + m;

    if (actual < inicio || actual > fin) {
      return setError(
        `El doctor solo atiende entre ${doctor.horario.inicio} y ${doctor.horario.fin}`
      );
    }

    console.log("Consulta registrada:", form);
    alert("Consulta registrada con éxito");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h6">Registrar Consulta</Typography>

      <FormControl fullWidth>
        <InputLabel>Expediente</InputLabel>
        <Select
          name="id_expediente"
          value={form.id_expediente}
          onChange={handleChange}
          label="Expediente"
        >
          {expedientes.map((exp) => (
            <MenuItem key={exp.id} value={exp.id}>
              {exp.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Doctor</InputLabel>
        <Select
          name="id_doctor"
          value={form.id_doctor}
          onChange={handleChange}
          label="Doctor"
        >
          {doctores.map((doc) => (
            <MenuItem key={doc.id} value={doc.id}>
              {doc.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Fecha"
        type="date"
        name="fecha"
        InputLabelProps={{ shrink: true }}
        value={form.fecha}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Hora"
        type="time"
        name="hora"
        InputLabelProps={{ shrink: true }}
        value={form.hora}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Motivo"
        name="motivo"
        value={form.motivo}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" type="submit">
        Registrar
      </Button>
    </Box>
  );
}