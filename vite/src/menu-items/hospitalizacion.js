// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| HOSPITALIZACIÓN MENU ITEMS ||============================== //

const Hospitalizacion = {
  id: 'hospitalizacion',
  title: 'Hospitalización',
  type: 'group',
  children : [
    {
      id: 'hospitalizacion_lista',
      title: 'LISTA DE HOSPITALIZACIONES',
      type: 'item',
      url: '/hospitalizacion_lista',
      icon: LocalHospitalIcon,
      breadcrumbs: false
    }
  ]
};

export default Hospitalizacion; 