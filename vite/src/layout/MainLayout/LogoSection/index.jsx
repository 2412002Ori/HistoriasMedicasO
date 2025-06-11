import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
// import Logo from 'ui-component/Logo'; // Original import
import LogoImage from '../../../assets/images/logo.svg'; // Import the image directly
import { Box } from '@mui/material';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
      <Box component="img" src={LogoImage} alt="Logo" sx={{ width: 70, height: 'auto', mr: 4 }} />
    </Link>
  );
}
