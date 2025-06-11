import { useEffect, useState } from 'react';

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

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid>

    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} sm={6} md={6} lg={7} > {/* Added item */}
        <TotalIncomeDarkCard isLoading={isLoading} />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={5}> {/* Added item */}
        <TotalIncomeLightCard
          {...{
            isLoading: isLoading,
            total: 20,
            label: 'expedientes retirados',
            icon: <StorefrontTwoToneIcon fontSize="inherit" />
          }}
        />
      </Grid>
    </Grid>
      <Grid size={12} sx={{ mt: 2 }}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8  }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
