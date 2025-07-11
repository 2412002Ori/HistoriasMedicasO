import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

export default function BajajAreaChartCard({ pacientesPorAnio = [], height = 95 }) {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  const [chartConfig, setChartConfig] = useState(chartData);

  useEffect(() => {
    if (pacientesPorAnio.length > 0) {
      setChartConfig((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          colors: [orangeDark],
          tooltip: { ...prevState?.options?.tooltip, theme: 'light' },
          xaxis: {
            categories: pacientesPorAnio.map((p) => p.anio)
          }
        },
        series: [
          {
            data: pacientesPorAnio.map((p) => Number(p.cantidad))
          }
        ]
      }));
    } else {
      setChartConfig((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          colors: [orangeDark],
          tooltip: { ...prevState?.options?.tooltip, theme: 'light' },
          xaxis: { categories: ['2024', '2025'] }
        },
        series: [
          { data: [1, 2] }
        ]
      }));
    }
  }, [orangeDark, pacientesPorAnio]);

  return (
    <Card sx={{ bgcolor: 'secondary.light', overflow: 'hidden', width: '100%', height: '100%' }}>
      <Grid container sx={{ p: 1, pb: 0, color: '#fff' }}>
        <Grid size={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                {pacientesPorAnio.length > 0 ? pacientesPorAnio[pacientesPorAnio.length - 1].anio : ''}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                {pacientesPorAnio.length > 0 ? pacientesPorAnio[pacientesPorAnio.length - 1].cantidad : 0}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...chartConfig} height={height} width={"100%"} />
    </Card>
  );
}
