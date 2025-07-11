import PropTypes from 'prop-types';
import React from 'react';

// material-ui

import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';


export default function PopularCard({ isLoading, pacientesPorAnio = [], pacientesUltimoAnio = 0, height = 200, fontSizeTitle = 14, fontSizeValue = 22 }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid size={12}>
                <Grid container sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
                  <Grid>
                    <Typography variant="h4" sx={{ fontSize: fontSizeTitle }}>Pacientes Agregados</Typography>
                  </Grid>
                  <Grid>
                    <Typography variant="h4" sx={{ fontSize: fontSizeValue }}>{pacientesUltimoAnio}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12} sx={{ mt: -1 }}>
                <BajajAreaChartCard pacientesPorAnio={pacientesPorAnio} height={height} />
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { isLoading: PropTypes.bool };
