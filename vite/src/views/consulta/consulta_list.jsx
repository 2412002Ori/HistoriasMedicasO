import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Modal,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import ConsultaForm from "../consulta/consulta_formulario";
import DoctorList from "../Doctores/Doctores_list";
import { consultasAPI } from '../../api/consultas';
import { API_BASE_URL } from '../../config';

// Styles for aligning buttons in ConsultaForm
const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '16px',
  gap: '10px',
};

// Styles for buttons group
const buttonsGroupStyle = {
    display: 'flex',
    gap: '10px',
};

export default function ConsultaList() {
  const [consultas, setConsultas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [fecha, setFecha] = useState("");
  const [open, setOpen] = useState(false); // State for modal open/close
  const [openDoctorModal, setOpenDoctorModal] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   const handleOpenDoctorModal = () => setOpenDoctorModal(true);
    const handleCloseDoctorModal = () => setOpenDoctorModal(false);

  const fetchConsultas = async () => {
    try {
      const data = await consultasAPI.getAll();
      setConsultas(data);
    } catch (error) {
      setConsultas([]);
      console.error("Error fetching consultas:", error);
    }
  };
  const fetchDoctores = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/doctores`);
      const data = await res.json();
      setDoctores(data.data || []);
    } catch (e) { setDoctores([]); }
  };
  const fetchExpedientes = async () => {
    try {
      const res = await fetch('/api/expedientes');
      const data = await res.json();
      setExpedientes(data.data || []);
    } catch (e) { setExpedientes([]); }
  };

  useEffect(() => {
    fetchConsultas();
    fetchDoctores();
    fetchExpedientes();
  }, []);

  const handleConsultaCreated = () => {
    fetchConsultas();
    setOpen(false);
  };

  const getNombrePaciente = (id) => {
    const paciente = expedientes.find((exp) => exp.EXPIDEXP === id || exp.id === id);
    return paciente?.EXPNOMBR || paciente?.nombre || "Desconocido";
  };
  const getNombreDoctor = (id) => {
    const doctor = doctores.find((doc) => doc.DOCIDDOC === id || doc.id === id);
    return doctor?.DOCNOMBR || doctor?.nombre || "Desconocido";
  };

  const filtered = consultas.filter((consulta) => {
    const coincideDoctor = doctorId ? consulta.CONIDDOC === parseInt(doctorId) : true;
    const coincideFecha = fecha ? (consulta.CONFEC__ && consulta.CONFEC__.slice(0, 10) === fecha) : true;
    return coincideDoctor && coincideFecha;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Consultas Registradas
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 , width: '60%' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Doctor</InputLabel>
          <Select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            label="Doctor"
          >
            <MenuItem value="">Todos</MenuItem>
            {doctores.map((doc) => (
              <MenuItem key={doc.DOCIDDOC} value={doc.DOCIDDOC}>
                {doc.DOCNOMBR}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Box sx={buttonsGroupStyle}>
            <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>Consultas</Button>
            <Button variant="contained" color="primary" onClick={handleOpenDoctorModal} >Doctores</Button> 
        </Box>
      </Box>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Consulta</TableCell>
              <TableCell>Expediente</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Motivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((consulta) => (
              <TableRow key={consulta.CONIDCON || consulta.id}>
                <TableCell>{consulta.CONIDCON}</TableCell>
                <TableCell>{consulta.expediente_nombre || getNombrePaciente(consulta.CONIDEXP)}</TableCell>
                <TableCell>{consulta.doctor_nombre ? `${consulta.doctor_nombre} ${consulta.doctor_apellido}` : getNombreDoctor(consulta.CONIDDOC)}</TableCell>
                <TableCell>{consulta.CONFEC__}</TableCell>
                <TableCell>{consulta.CONDIA__}</TableCell>
                <TableCell>{consulta.CONMOTIV}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay consultas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

           <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Agregar Nueva Consulta
          </Typography>
          <ConsultaForm onClose={handleClose} onConsultaCreated={handleConsultaCreated} buttonContainerStyle={buttonContainerStyle} /> {/* Render the ConsultaForm inside the modal */}
        </Box>
      </Modal>

      <Modal
        open={openDoctorModal}
        onClose={handleCloseDoctorModal}
        aria-labelledby="doctor-modal-title"
        aria-describedby="doctor-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="doctor-modal-title" variant="h6" component="h2">
          </Typography>
          <DoctorList onClose={handleCloseDoctorModal} buttonContainerStyle={buttonContainerStyle} />
        </Box>
      </Modal>
    </Box>
  );
}