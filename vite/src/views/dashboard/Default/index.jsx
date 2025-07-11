import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';
import { API_BASE_URL } from '../../../config';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [expedientesStats, setExpedientesStats] = useState({ activos: 0, retirados: 0 });
  const [consultas, setConsultas] = useState([]);
  const [consultasTotal, setConsultasTotal] = useState(0);
  const [pacientesPorAnio, setPacientesPorAnio] = useState([]);
  const [pacientesUltimoAnio, setPacientesUltimoAnio] = useState(0);
  const [pacientesTriaje, setPacientesTriaje] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Expedientes activos y retirados
        const statsRes = await axios.get(`${API_BASE_URL}/expedientes/stats`);
        setExpedientesStats(statsRes.data.data || { activos: 0, retirados: 0 });

        // Consultas por año (default)
        const consultasRes = await axios.get(`${API_BASE_URL}/consultas/por-periodo?periodo=anual`);
        setConsultas(consultasRes.data.data || []);
        setConsultasTotal(consultasRes.data.data?.reduce((acc, cur) => acc + Number(cur.cantidad), 0) || 0);

        // Pacientes agregados por año
        const pacientesRes = await axios.get(`${API_BASE_URL}/pacientes/por-anio`);
        setPacientesPorAnio(pacientesRes.data.data || []);
        if (pacientesRes.data.data && pacientesRes.data.data.length > 0) {
          setPacientesUltimoAnio(pacientesRes.data.data[pacientesRes.data.data.length - 1].cantidad);
        }

        // Pacientes de triaje
        const triajeRes = await axios.get(`${API_BASE_URL}/pacientes/triaje-count`);
        setPacientesTriaje(Number(triajeRes.data.cantidad) || 0);
      } catch (e) {
        // Si ocurre un error, asignar datos estáticos para la gráfica de Pacientes Agregados
        setPacientesPorAnio([
          { anio: '2023', cantidad: 1 },
          { anio: '2024', cantidad: 2 },
          { anio: '2025', cantidad: 4 }
        ]);
        setPacientesUltimoAnio(4);
        setPacientesTriaje(0);
        console.log('Error en fetchData, usando datos estáticos:', e);
      }
      console.log('Datos para PopularCard:', { pacientesPorAnio, pacientesUltimoAnio: pacientesTriaje, isLoading });
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Grid>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={6} lg={7}>
          <TotalIncomeDarkCard isLoading={isLoading} total={expedientesStats.activos} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={5}>
          <TotalIncomeLightCard
            isLoading={isLoading}
            total={expedientesStats.retirados}
            label="expedientes retirados"
            icon={<StorefrontTwoToneIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Grid container spacing={gridSpacing} alignItems="stretch">
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
            <TotalGrowthBarChart isLoading={isLoading} consultas={consultas} total={consultasTotal} height={260} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch', width: 250, height: 250, minWidth: 250, minHeight: 250, maxWidth: 250, maxHeight: 250 }}>
            <PopularCard isLoading={isLoading} pacientesPorAnio={pacientesPorAnio} pacientesUltimoAnio={pacientesTriaje} height={200} fontSizeTitle={18} fontSizeValue={28} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
