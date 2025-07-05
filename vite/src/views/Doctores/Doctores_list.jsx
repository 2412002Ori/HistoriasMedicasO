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
import { doctoresAPI } from '../../api/doctores';
import { horariosAPI } from '../../api/horarios';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const data = await doctoresAPI.getAll();
      const doctorsWithHorarios = await Promise.all(
        data.map(async (doc) => {
          let horarios = [];
          const docId = doc.DOCIDDOC || doc.id || doc.DOCID;
          console.log('Buscando horarios para doctor', docId, doc);
          try {
            horarios = await horariosAPI.getByDoctor(docId);
            console.log('Horarios recibidos para', docId, horarios);
          } catch (e) {
            console.error('Error obteniendo horarios para', docId, e);
            horarios = [];
          }
          return { ...doc, horarios };
        })
      );
      setDoctors(doctorsWithHorarios);
    } catch (error) {
      setDoctors([]);
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpen = () => {
    setSelectedDoctor(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpen(true);
  };

  const handleDoctorCreatedOrUpdated = () => {
    fetchDoctors();
    handleClose();
  };

  const filteredDoctors = doctors.filter((doctor) =>
    (doctor.DOCNOMBR || doctor.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
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
              <TableCell>Horarios de Atención</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.DOCIDDOC || doctor.id || doctor.DOCID}>
                <TableCell>{doctor.DOCNOMBR || doctor.nombre}</TableCell>
                <TableCell>{doctor.DOCAPELL || doctor.apellido}</TableCell>
                <TableCell>{doctor.DOCESPEC || doctor.especialidad}</TableCell>
                <TableCell>{doctor.DOCTELEF || doctor.telefono}</TableCell>
                <TableCell>{doctor.DOCEMAIL || doctor.email}</TableCell>
                <TableCell>
                  {doctor.horarios && doctor.horarios.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {doctor.horarios.map((h, idx) => (
                        <li key={h.HORIDHOR || idx}>
                        {h.HORDIASE}: {h.HORHORIN} - {h.HORHORFI}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No asignado</span>
                  )}
                </TableCell>
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
          <DoctorForm handleClose={handleClose} onDoctorCreated={handleDoctorCreatedOrUpdated} doctor={selectedDoctor} />
        </Box>
      </Modal>
    </Box>
  );
}