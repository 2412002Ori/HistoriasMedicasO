// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';
import MedicationIcon from '@mui/icons-material/Medication';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| QUIMIOTERAPIA MENU ITEMS ||============================== //

const Quimio = {
  id: 'quimio',
  title: 'Quimioterapia',
  type: 'group',
  children : [
    {
      id: 'quimio_lista',
      title: 'LISTA DE QUIMIOTERAPIAS',
      type: 'item',
      url: '/quimio_lista',
      icon: MedicationIcon,
      breadcrumbs: false
    }
  ]
};

export default Quimio; 