import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DoctorForm from "./Doctores_formulario";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleOpen = () => {
    setSelectedDoctor(null); // Reset selected doctor when opening modal for adding
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  useEffect(() => {
    // Fetch doctors from API or use mock data
    const fetchDoctors = async () => {
      // Replace '/api/doctors' with your actual API endpoint
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // If API fails, use mock data
        setDoctors([
          { id: 1, nombre: "John", apellido: "Doe", especialidad: "Cardiologist", telefono: "123-456-7890", email: "john.doe@example.com", dia_semana: "Lunes , MARTES ", hora_inicio: "09:00", hora_fin: "17:00" },
          { id: 2, nombre: "Jane", apellido: "Smith", especialidad: "Dermatologist", telefono: "987-654-3210", email: "jane.smith@example.com", dia_semana: "Martes", hora_inicio: "10:00", hora_fin: "18:00" },
        ]);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lista de Doctores
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Buscar por Nombre"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Agregar Doctor
        </Button>
      </Box>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Día de Trabajo</TableCell>
              <TableCell>Hora Inicio</TableCell>
              <TableCell>Hora Fin</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.nombre}</TableCell>
                <TableCell>{doctor.apellido}</TableCell>
                <TableCell>{doctor.especialidad}</TableCell>
                <TableCell>{doctor.telefono}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.dia_semana}</TableCell>
                <TableCell>{doctor.hora_inicio}</TableCell>
                <TableCell>{doctor.hora_fin}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => handleEdit(doctor)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-doctor-modal"
        aria-describedby="modal-to-add-new-doctor"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
          </Typography>
          <DoctorForm onClose={handleClose} doctor={selectedDoctor} />
        </Box>
      </Modal>
    </Box>
  );
}