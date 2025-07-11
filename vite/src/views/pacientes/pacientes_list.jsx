import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
  Box,
  CircularProgress,
  Tooltip,
  Button,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableExpedienteForm from './pacientes_expediente';
import { pacientesAPI } from '../../api/pacientes';
import { expedientesAPI } from '../../api/expedientes';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import logoImage from '../../assets/images/logo.svg';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PacientesList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [cedulaSearchTerm, setCedulaSearchTerm] = useState('');
  const [nrohistoriaSearchTerm, setnrohistoriaSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const pacientesData = await pacientesAPI.getAll();
        setPacientes(pacientesData);
        const expedientesData = await expedientesAPI.getAll();
        setExpedientes(expedientesData);
      } catch {
        setPacientes([]);
        setExpedientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCedulaSearch = (event) => {
    setCedulaSearchTerm(event.target.value);
  };

  const handlehistoriaSearch = (event) => {
    setnrohistoriaSearchTerm(event.target.value);
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    console.log('Exportando a Excel...', filteredPacientes.length, 'registros');
    const dataToExport = filteredPacientes.map((paciente) => {
      const pacienteId = String(paciente.PACIDPAC || paciente.pacidpac);
      const exps = expedientes.filter(e => String(e.EXPIDPAC || e.expidpac) === pacienteId);
      const exp = exps.length > 0 ? exps.sort((a, b) => new Date((b.EXPFECRE || b.expfecre)) - new Date((a.EXPFECRE || a.expfecre)))[0] : null;
      
      return {
        'N° Historia': exp ? (exp.EXPIDEXP || exp.expidexp || '—') : '—',
        'Nombre': paciente.PACNOMBR || paciente.pacnombr || '',
        'Apellido': paciente.PACAPELL || paciente.pacapell || '',
        'Cédula': paciente.PACCEDUL || paciente.paccedul || '',
        'Fecha de Nacimiento': (paciente.PACFENAC || paciente.pacfenac) 
          ? new Date(paciente.PACFENAC || paciente.pacfenac).toLocaleDateString() 
          : 'N/A',
        'Sexo': paciente.PACSEXO_ || paciente.pacsexo_ || '',
        'Dirección': paciente.PACDIREC || paciente.pacdirec || '',
        'Teléfono': paciente.PACTELEF || paciente.pactelef || '',
        'Email': paciente.PACEMAIL || paciente.pacemail || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expedientes');
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // N° Historia
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido
      { wch: 15 }, // Cédula
      { wch: 20 }, // Fecha de Nacimiento
      { wch: 10 }, // Sexo
      { wch: 30 }, // Dirección
      { wch: 15 }, // Teléfono
      { wch: 25 }  // Email
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Expedientes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Función para exportar a PDF (header blanco, letra naranja, tabla más grande)
  const exportToPDF = () => {
    try {
      console.log('Exportando a PDF...', filteredPacientes.length, 'registros');
      const doc = new jsPDF({ orientation: 'landscape' });
      
      // Título del documento
      doc.setFontSize(18);
      doc.setTextColor(41, 128, 185);
      doc.text('Lista de Expedientes', 148, 20, { align: 'center' });
      
      // Fecha de generación
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 148, 30, { align: 'center' });

      // Configurar fuente para la tabla
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Encabezados de la tabla
      const headers = ['N° Historia', 'Nombre', 'Apellido', 'Cédula', 'F. Nac.', 'Sexo', 'Dirección', 'Teléfono', 'Email'];
      let yPosition = 44;
      let xPosition = 10;
      const colWidths = [24, 32, 32, 24, 24, 18, 48, 24, 48];
      const rowHeight = 13;

      // Dibujar encabezados con fondo blanco y letra naranja
      doc.setFillColor(255, 255, 255); // blanco
      doc.setDrawColor(180, 180, 180); // gris claro para bordes
      doc.setLineWidth(0.2);
      headers.forEach((header, index) => {
        const width = colWidths[index];
        doc.rect(xPosition, yPosition - rowHeight + 4, width, rowHeight, 'FD'); // F: fill, D: draw
        doc.setFontSize(11);
        doc.setTextColor(255, 165, 0); // naranja
        // Centrar el texto en cada celda, también verticalmente
        const textWidth = doc.getTextWidth(String(header));
        const textX = xPosition + (width - textWidth) / 2;
        const textY = yPosition - rowHeight + 4 + rowHeight / 2 + 3; // centrado vertical
        doc.text(String(header), textX, textY);
        xPosition += width;
      });

      // Dibujar líneas verticales del header
      xPosition = 10;
      for (let i = 0; i <= headers.length; i++) {
        doc.line(xPosition, yPosition - rowHeight + 4, xPosition, yPosition + rowHeight * filteredPacientes.length, 'S');
        if (i < headers.length) xPosition += colWidths[i];
      }

      // Datos de la tabla
      yPosition += rowHeight + 2;
      filteredPacientes.forEach((paciente, rowIndex) => {
        xPosition = 10;
        const pacienteId = String(paciente.PACIDPAC || paciente.pacidpac);
        const exps = expedientes.filter(e => String(e.EXPIDPAC || e.expidpac) === pacienteId);
        const exp = exps.length > 0 ? exps.sort((a, b) => new Date((b.EXPFECRE || b.expfecre)) - new Date((a.EXPFECRE || a.expfecre)))[0] : null;
        const rowData = [
          exp ? String(exp.EXPIDEXP || exp.expidexp || '—') : '—',
          String(paciente.PACNOMBR || paciente.pacnombr || ''),
          String(paciente.PACAPELL || paciente.pacapell || ''),
          String(paciente.PACCEDUL || paciente.paccedul || ''),
          (paciente.PACFENAC || paciente.pacfenac) 
            ? String(new Date(paciente.PACFENAC || paciente.pacfenac).toLocaleDateString())
            : 'N/A',
          String(paciente.PACSEXO_ || paciente.pacsexo_ || ''),
          String(paciente.PACDIREC || paciente.pacdirec || ''),
          String(paciente.PACTELEF || paciente.pactelef || ''),
          String(paciente.PACEMAIL || paciente.pacemail || '')
        ];
        // Dibujar fondo blanco para la fila
        doc.setFillColor(255, 255, 255);
        doc.rect(10, yPosition - rowHeight + 4, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        // Dibujar celdas y texto
        rowData.forEach((cell, index) => {
          const width = colWidths[index];
          const cellString = String(cell || '');
          const displayText = cellString.length > Math.floor(width/2) ? cellString.substring(0, Math.floor(width/2)) + '...' : cellString;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(displayText, xPosition + 2, yPosition + 2);
          // Dibujar borde derecho de la celda
          doc.setDrawColor(180, 180, 180);
          doc.line(xPosition + width, yPosition - rowHeight + 4, xPosition + width, yPosition + rowHeight, 'S');
          xPosition += width;
        });
        // Dibujar línea inferior de la fila
        doc.setDrawColor(180, 180, 180);
        doc.line(10, yPosition + rowHeight, 10 + colWidths.reduce((a, b) => a + b, 0), yPosition + rowHeight, 'S');
        yPosition += rowHeight;
        // Nueva página si se sale del área visible
        if (yPosition > 190) {
          doc.addPage('landscape');
          yPosition = 20 + rowHeight;
          // Redibujar encabezados en nueva página
          xPosition = 10;
          doc.setFillColor(255, 255, 255);
          headers.forEach((header, index) => {
            const width = colWidths[index];
            doc.rect(xPosition, yPosition - rowHeight, width, rowHeight, 'FD');
            doc.setFontSize(11);
            doc.setTextColor(255, 165, 0);
            const textWidth = doc.getTextWidth(String(header));
            const textX = xPosition + (width - textWidth) / 2;
            const textY = yPosition - rowHeight + rowHeight / 2 + 3; // centrado vertical
            doc.text(String(header), textX, textY);
            xPosition += width;
          });
          yPosition += rowHeight;
        }
      });

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Total de registros: ${String(filteredPacientes.length)}`, 148, 200, { align: 'center' });

      // Guardar el PDF
      const fileName = `Expedientes_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      console.log('PDF generado exitosamente:', fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  // Relacionar paciente con su expediente principal (el más reciente)
  const getExpedienteForPaciente = (pacienteId) => {
    const exps = expedientes.filter(e => e.EXPIDPAC === pacienteId || e.expidpac === pacienteId);
    if (exps.length === 0) return '';
    // Devolver el expediente más reciente
    return exps.sort((a, b) => new Date(b.EXPFECRE || b.expfecre) - new Date(a.EXPFECRE || a.expfecre))[0].EXPIDEXP || exps[0].expidexp;
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const pacienteId = String(paciente.PACIDPAC || paciente.pacidpac);
    const exps = expedientes.filter(e => String(e.EXPIDPAC || e.expidpac) === pacienteId);
    const tieneExpediente = exps.length > 0;
    const nrohistoriaStr = exps.length > 0 ? String(exps[0].EXPIDEXP || exps[0].expidexp || '') : '';
    const cedulaStr = (paciente.PACCEDUL || paciente.paccedul || '').toLowerCase();
    return (
      tieneExpediente &&
      nrohistoriaStr.includes(nrohistoriaSearchTerm.toLowerCase()) &&
      cedulaStr.includes(cedulaSearchTerm.toLowerCase())
    );
  });

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar por N° Historia"
          value={nrohistoriaSearchTerm}
          onChange={handlehistoriaSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <TextField
          label="Buscar por Cédula"
          value={cedulaSearchTerm}
          onChange={handleCedulaSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <IconButton
          onClick={handleOpen}
          aria-label="add"
          color="primary"
        >
          <AddIcon />
        </IconButton>
        
        {/* Botones de exportación */}
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            disabled={filteredPacientes.length === 0}
            size="small"
          >
            Exportar Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={exportToPDF}
            disabled={filteredPacientes.length === 0}
            size="small"
          >
            Exportar PDF
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              console.log('Datos disponibles:', filteredPacientes.length);
              console.log('Primer paciente:', filteredPacientes[0]);
            }}
            size="small"
            color="secondary"
          >
            Test
          </Button>
        </Stack>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>N° Historia</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell align="left">Apellido</TableCell>
                <TableCell align="left">Cédula</TableCell>
                <TableCell align="left">Fecha de Nacimiento</TableCell>
                <TableCell align="left">Sexo</TableCell>
                <TableCell align="left">Dirección</TableCell>
                <TableCell align="left">Teléfono</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredPacientes) && filteredPacientes.length > 0 ? (
                filteredPacientes.map((paciente, index) => (
                  <TableRow
                    key={paciente.PACIDPAC || paciente.pacidpac || index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {
                        (() => {
                          const pacienteId = String(paciente.PACIDPAC || paciente.pacidpac);
                          const exps = expedientes.filter(e => String(e.EXPIDPAC || e.expidpac) === pacienteId);
                          if (exps.length === 0) return '—';
                          // Tomar el expediente más reciente
                          const exp = exps.sort((a, b) => new Date((b.EXPFECRE || b.expfecre)) - new Date((a.EXPFECRE || a.expfecre)))[0];
                          return exp.EXPIDEXP || exp.expidexp || '—';
                        })()
                      }
                    </TableCell>
                    <TableCell>{paciente.PACNOMBR || paciente.pacnombr}</TableCell>
                    <TableCell align="left">{paciente.PACAPELL || paciente.pacapell}</TableCell>
                    <TableCell align="left">{paciente.PACCEDUL || paciente.paccedul}</TableCell>
                    <TableCell align="left">
                      {(paciente.PACFENAC || paciente.pacfenac)
                        ? new Date(paciente.PACFENAC || paciente.pacfenac).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="left">{paciente.PACSEXO_ || paciente.pacsexo_}</TableCell>
                    <TableCell align="left">{paciente.PACDIREC || paciente.pacdirec}</TableCell>
                    <TableCell align="left">{paciente.PACTELEF || paciente.pactelef}</TableCell>
                    <TableCell align="left">{paciente.PACEMAIL || paciente.pacemail}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar expediente o ver detalles">
                        <span>
                          <IconButton aria-label="edit" onClick={handleOpen}>
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell component="th" scope="row">
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TableExpedienteForm handleClose={handleClose} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default PacientesList;