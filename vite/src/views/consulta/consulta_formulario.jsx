import React, { useState, useEffect } from "react";
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
import { consultasAPI } from '../../api/consultas';
import { API_BASE_URL } from '../../config';

export default function ConsultaForm({ onClose, onConsultaCreated }) {
  const [form, setForm] = useState({
    CONIDEXP: '',
    CONIDDOC: '',
    CONFEC__: '',
    CONDIA__: '',
    CONMOTIV: '',
  });
  const [expedientes, setExpedientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/expedientes`);
        const data = await res.json();
        setExpedientes(data.data || []);
      } catch (e) { setExpedientes([]); }
    };
    const fetchDoctores = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/doctores`);
        const data = await res.json();
        setDoctores(data.data || []);
      } catch (e) { setDoctores([]); }
    };
    fetchExpedientes();
    fetchDoctores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'CONFEC__') {
      // Calcular el día de la semana en español
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const fecha = new Date(value);
      const diaSemana = dias[fecha.getDay()];
      setForm((prev) => ({ ...prev, CONFEC__: value, CONDIA__: diaSemana }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Validación básica
      if (!form.CONIDEXP || !form.CONIDDOC || !form.CONFEC__ || !form.CONDIA__ || !form.CONMOTIV) {
        setError('Completa todos los campos');
        setIsLoading(false);
        return;
      }
      console.log('Enviando consulta:', form);
      const response = await consultasAPI.create(form);
      console.log('Respuesta backend:', response);
      if (onConsultaCreated) onConsultaCreated();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error al registrar consulta:', err);
      setError(err.message || 'Error al registrar consulta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h6">Registrar Consulta</Typography>

      <FormControl fullWidth required>
        <InputLabel>Expediente</InputLabel>
        <Select
          name="CONIDEXP"
          value={form.CONIDEXP}
          onChange={handleChange}
          label="Expediente"
        >
          {expedientes.map((exp) => (
            <MenuItem key={exp.EXPIDEXP || exp.expidexp} value={exp.EXPIDEXP || exp.expidexp}>
              {`N° ${exp.EXPIDEXP || exp.expidexp} - ${(exp.PACNOMBR || exp.pacnombr || '')} ${(exp.PACAPELL || exp.pacapell || '')}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>Doctor</InputLabel>
        <Select
          name="CONIDDOC"
          value={form.CONIDDOC}
          onChange={handleChange}
          label="Doctor"
        >
          {doctores.map((doc) => (
            <MenuItem key={doc.DOCIDDOC || doc.dociddoc} value={doc.DOCIDDOC || doc.dociddoc}>
              {`${doc.DOCNOMBR || doc.docnombr || ''} ${doc.DOCAPELL || doc.docapell || ''} - ${doc.DOCESPEC || doc.docespec || ''}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Fecha"
        type="date"
        name="CONFEC__"
        InputLabelProps={{ shrink: true }}
        value={form.CONFEC__}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Día de la semana"
        name="CONDIA__"
        value={form.CONDIA__}
        onChange={handleChange}
        fullWidth
        disabled
      />

      <TextField
        label="Motivo"
        name="CONMOTIV"
        value={form.CONMOTIV}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Registrar'}
      </Button>
    </Box>
  );
}