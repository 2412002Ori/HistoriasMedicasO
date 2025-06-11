// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const PacientesR = {
  id: 'pacientesR',
  title: 'Pacientes',
  type: 'group',
  children : [
    {
      id: 'pacientes_inscripcion',
      title: 'TRIAJE ',
      type: 'item',
      url: '/pacientes/triaje/list',
      icon: FolderSharedIcon,
      breadcrumbs: false
    },
    {
      id: 'pacientes_lista',
      title: 'EXPEDIENTES',
      type: 'item',
      url: '/pacientes_lista',
      icon: FolderSharedIcon,
      breadcrumbs: false
    }
  ]

};

export default PacientesR;
