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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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
    const paciente = expedientes.find((exp) => exp.EXPIDEXP === id || exp.expidexp === id || exp.id === id);
    return paciente?.EXPNOMBR || paciente?.expnombr || paciente?.nombre || "Desconocido";
  };
  const getNombreDoctor = (id) => {
    const doctor = doctores.find((doc) => doc.DOCIDDOC === id || doc.dociddoc === id || doc.id === id);
    return doctor?.DOCNOMBR || doctor?.docnombr || doctor?.nombre || "Desconocido";
  };

  const filtered = consultas.filter((consulta) => {
    const consultaDocId = String(consulta.CONIDDOC || consulta.coniddoc);
    const coincideDoctor = doctorId ? consultaDocId === doctorId : true;
    // Normalizar fecha de la consulta y del filtro a YYYY-MM-DD
    const consultaFecha = (consulta.CONFEC__ || consulta.confec__ || '').slice(0, 10);
    const filtroFecha = fecha ? fecha.slice(0, 10) : '';
    const coincideFecha = filtroFecha ? consultaFecha === filtroFecha : true;
    return coincideDoctor && coincideFecha;
  });

  // Exportar a Excel solo los datos filtrados
  const exportToExcel = () => {
    const dataToExport = filtered.map((consulta) => {
      const consultaExpId = String(consulta.CONIDEXP || consulta.conidexp);
      const exp = expedientes.find(e => String(e.EXPIDEXP || e.expidexp) === consultaExpId);
      return {
        'Expediente': exp ? `N° ${(exp.EXPIDEXP || exp.expidexp)} - ${(exp.PACNOMBR || exp.pacnombr || '')} ${(exp.PACAPELL || exp.pacapell || '')}` : consultaExpId,
        'Doctor': consulta.doctor_nombre ? `${consulta.doctor_nombre} ${consulta.doctor_apellido || ''}` : getNombreDoctor(consulta.CONIDDOC || consulta.coniddoc),
        'Fecha': consulta.CONFEC__ || consulta.confec__,
        'Día': consulta.CONDIA__ || consulta.condia__,
        'Motivo': consulta.CONMOTIV || consulta.conmotiv
      };
    });
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consultas');
    ws['!cols'] = [ { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 40 } ];
    XLSX.writeFile(wb, `Consultas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Exportar a PDF solo los datos filtrados
  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(18);
      doc.setTextColor(41, 128, 185);
      doc.text('Lista de Consultas', 148, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 148, 30, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const headers = ['Expediente', 'Doctor', 'Fecha', 'Día', 'Motivo'];
      let yPosition = 44;
      let xPosition = 10;
      const colWidths = [50, 40, 25, 20, 90];
      const rowHeight = 13;
      // Header blanco, letra naranja
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      headers.forEach((header, index) => {
        const width = colWidths[index];
        doc.rect(xPosition, yPosition - rowHeight + 4, width, rowHeight, 'FD');
        doc.setFontSize(11);
        doc.setTextColor(255, 165, 0);
        const textWidth = doc.getTextWidth(String(header));
        const textX = xPosition + (width - textWidth) / 2;
        const textY = yPosition - rowHeight + 4 + rowHeight / 2 + 3;
        doc.text(String(header), textX, textY);
        xPosition += width;
      });
      // Líneas verticales del header
      xPosition = 10;
      for (let i = 0; i <= headers.length; i++) {
        doc.line(xPosition, yPosition - rowHeight + 4, xPosition, yPosition + rowHeight * filtered.length, 'S');
        if (i < headers.length) xPosition += colWidths[i];
      }
      // Datos
      yPosition += rowHeight + 2;
      filtered.forEach((consulta, rowIndex) => {
        xPosition = 10;
        const consultaExpId = String(consulta.CONIDEXP || consulta.conidexp);
        const exp = expedientes.find(e => String(e.EXPIDEXP || e.expidexp) === consultaExpId);
        const rowData = [
          exp ? `N° ${(exp.EXPIDEXP || exp.expidexp)} - ${(exp.PACNOMBR || exp.pacnombr || '')} ${(exp.PACAPELL || exp.pacapell || '')}` : consultaExpId,
          consulta.doctor_nombre ? `${consulta.doctor_nombre} ${consulta.doctor_apellido || ''}` : getNombreDoctor(consulta.CONIDDOC || consulta.coniddoc),
          String(consulta.CONFEC__ || consulta.confec__),
          String(consulta.CONDIA__ || consulta.condia__),
          String(consulta.CONMOTIV || consulta.conmotiv)
        ];
        doc.setFillColor(255, 255, 255);
        doc.rect(10, yPosition - rowHeight + 4, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        rowData.forEach((cell, index) => {
          const width = colWidths[index];
          const cellString = String(cell || '');
          const displayText = cellString.length > Math.floor(width/2) ? cellString.substring(0, Math.floor(width/2)) + '...' : cellString;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(displayText, xPosition + 2, yPosition + 2);
          doc.setDrawColor(180, 180, 180);
          doc.line(xPosition + width, yPosition - rowHeight + 4, xPosition + width, yPosition + rowHeight, 'S');
          xPosition += width;
        });
        doc.setDrawColor(180, 180, 180);
        doc.line(10, yPosition + rowHeight, 10 + colWidths.reduce((a, b) => a + b, 0), yPosition + rowHeight, 'S');
        yPosition += rowHeight;
        if (yPosition > 190) {
          doc.addPage('landscape');
          yPosition = 20 + rowHeight;
          xPosition = 10;
          doc.setFillColor(255, 255, 255);
          headers.forEach((header, index) => {
            const width = colWidths[index];
            doc.rect(xPosition, yPosition - rowHeight, width, rowHeight, 'FD');
            doc.setFontSize(11);
            doc.setTextColor(255, 165, 0);
            const textWidth = doc.getTextWidth(String(header));
            const textX = xPosition + (width - textWidth) / 2;
            const textY = yPosition - rowHeight + rowHeight / 2 + 3;
            doc.text(String(header), textX, textY);
            xPosition += width;
          });
          yPosition += rowHeight;
        }
      });
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Total de registros: ${String(filtered.length)}`, 148, 200, { align: 'center' });
      const fileName = `Consultas_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

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
              <MenuItem key={doc.DOCIDDOC || doc.dociddoc} value={String(doc.DOCIDDOC || doc.dociddoc)}>
                {`${doc.DOCNOMBR || doc.docnombr || ''} ${doc.DOCAPELL || doc.docapell || ''} - ${doc.DOCESPEC || doc.docespec || ''}`}
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

      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportToExcel}
          disabled={filtered.length === 0}
        >
          Exportar Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={exportToPDF}
          disabled={filtered.length === 0}
        >
          Exportar PDF
        </Button>
      </Box>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expediente</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Motivo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((consulta) => (
              <TableRow key={consulta.CONIDCON || consulta.conidcon || consulta.id}>
                <TableCell>
                  {(() => {
                    const consultaExpId = String(consulta.CONIDEXP || consulta.conidexp);
                    const exp = expedientes.find(e => String(e.EXPIDEXP || e.expidexp) === consultaExpId);
                    if (exp) {
                      return `N° ${(exp.EXPIDEXP || exp.expidexp)} - ${(exp.PACNOMBR || exp.pacnombr || '')} ${(exp.PACAPELL || exp.pacapell || '')}`;
                    }
                    return consultaExpId;
                  })()}
                </TableCell>
                <TableCell>{consulta.doctor_nombre ? `${consulta.doctor_nombre} ${consulta.doctor_apellido || ''}` : getNombreDoctor(consulta.CONIDDOC || consulta.coniddoc)}</TableCell>
                <TableCell>{consulta.CONFEC__ || consulta.confec__}</TableCell>
                <TableCell>{consulta.CONDIA__ || consulta.condia__}</TableCell>
                <TableCell>{consulta.CONMOTIV || consulta.conmotiv}</TableCell>
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