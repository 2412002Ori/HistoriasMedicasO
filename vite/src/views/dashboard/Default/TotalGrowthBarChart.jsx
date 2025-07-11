import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third party
import Chart from 'react-apexcharts';
import axios from 'axios';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { API_BASE_URL } from '../../../config';

// chart data
import barChartOptions from './chart-data/total-growth-bar-chart';

const status = [
  { value: 'today', label: 'Diario' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' }
];

const series = [
  { name: 'Investment', data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75] },
  { name: 'Loss', data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75] },
  { name: 'Profit', data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10] },
  { name: 'Maintenance', data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0] }
];

export default function TotalGrowthBarChart({ isLoading, consultas = [], total = 0, height = 200 }) {
  const theme = useTheme();

  const [value, setValue] = useState('anual');
  const [chartOptions, setChartOptions] = useState(barChartOptions);
  const [seriesData, setSeriesData] = useState([]);
  const [localConsultas, setLocalConsultas] = useState(consultas);
  const [localTotal, setLocalTotal] = useState(total);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLocalConsultas(consultas);
    setLocalTotal(total);
    setLoading(isLoading);
  }, [consultas, total, isLoading]);

  useEffect(() => {
    // Mapear los datos de consultas a la serie de la gráfica
    if (localConsultas.length > 0) {
      setSeriesData([
        {
          name: 'Consultas',
          data: localConsultas.map((c) => Number(c.cantidad))
        }
      ]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: localConsultas.map((c) => c.periodo)
        }
      }));
    } else {
      // Fallback: datos estáticos si no hay datos dinámicos
      setSeriesData([
        {
          name: 'Consultas',
          data: [10, 20, 15]
        }
      ]);
      setChartOptions((prev) => ({
        ...prev,
        xaxis: {
          ...prev.xaxis,
          categories: ['2023', '2024', '2025']
        }
      }));
    }
  }, [localConsultas]);

  const handleChange = async (e) => {
    const periodo = e.target.value;
    setValue(periodo);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/consultas/por-periodo?periodo=${periodo}`);
      setLocalConsultas(res.data.data || []);
      setLocalTotal(res.data.data?.reduce((acc, cur) => acc + Number(cur.cantidad), 0) || 0);
    } catch (err) {
      setLocalConsultas([]);
      setLocalTotal(0);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid>
                  <Grid container direction="column" spacing={1}>
                    <Grid>
                      <Typography variant="subtitle2">REGISTRO DE CONSULTAS </Typography>
                    </Grid>
                    <Grid>
                      <Typography variant="h3">{localTotal}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid>
                  <TextField id="standard-select-currency" select value={value} onChange={handleChange}>
                    <MenuItem value="diario">Diario</MenuItem>
                    <MenuItem value="mensual">Mes</MenuItem>
                    <MenuItem value="anual">Año</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12} sx={{ ...theme.applyStyles('light', { '& .apexcharts-series:nth-of-type(4) path:hover': { filter: `brightness(0.95)`, transition: 'all 0.3s ease' } }), '& .apexcharts-menu': { bgcolor: 'background.paper' }, '.apexcharts-theme-light .apexcharts-menu-item:hover': { bgcolor: 'grey.200' }, '& .apexcharts-theme-light .apexcharts-menu-icon:hover svg, .apexcharts-theme-light .apexcharts-reset-icon:hover svg, .apexcharts-theme-light .apexcharts-selection-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoom-icon:not(.apexcharts-selected):hover svg, .apexcharts-theme-light .apexcharts-zoomin-icon:hover svg, .apexcharts-theme-light .apexcharts-zoomout-icon:hover svg': { fill: theme.palette.grey[400] } }}>
              <Chart options={chartOptions} series={seriesData} type="bar" height={height} width={"100%"} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = { isLoading: PropTypes.bool };
