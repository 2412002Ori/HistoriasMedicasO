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

  useEffect(() => {
    // Replace with your actual API endpoints
    const fetchConsultas = async () => {
      try {
        const response = await fetch("/api/consultas");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConsultas(data);
      } catch (error) {
        console.error("Error fetching consultas:", error);
      }
    };

    const fetchDoctores = async () => {
      try {
        const response = await fetch("/api/doctores");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctores(data);
      } catch (error) {
        console.error("Error fetching doctores:", error);
      }
    };

    const fetchExpedientes = async () => {
      try {
        const response = await fetch("/api/expedientes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpedientes(data);
      } catch (error) {
        console.error("Error fetching expedientes:", error);
      }
    };

    fetchConsultas();
    fetchDoctores();
    fetchExpedientes();
  }, []); // Empty dependency array means this runs once on mount

  const getNombrePaciente = (id) => {
    const paciente = expedientes.find((exp) => exp.id === id);
    return paciente?.nombre || "Desconocido";
  };

  const filtered = consultas.filter((consulta) => {
    const coincideDoctor = doctorId ? consulta.id_doctor === parseInt(doctorId) : true;
    const coincideFecha = fecha ? consulta.fecha === fecha : true;
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
              <MenuItem key={doc.id} value={doc.id}>
                {doc.nombre}
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
              <TableCell>Paciente</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((consulta) => {
              const doctor = doctores.find((d) => d.id === consulta.id_doctor);
              return (
                <TableRow key={consulta.id}>
                  <TableCell>{getNombrePaciente(consulta.id_expediente)}</TableCell>
                  <TableCell>{consulta.hora}</TableCell>
                  <TableCell>{doctor?.nombre || "Desconocido"}</TableCell>
                  <TableCell>{consulta.motivo}</TableCell>
                  <TableCell>{consulta.fecha}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
          <ConsultaForm onClose={handleClose} buttonContainerStyle={buttonContainerStyle} /> {/* Render the ConsultaForm inside the modal */}
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