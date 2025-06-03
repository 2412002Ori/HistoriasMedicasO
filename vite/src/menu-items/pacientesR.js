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
      title: 'Inscripción',
      type: 'item',
      url: '/pacientes_inscripcion',
      icon: FolderSharedIcon,
      breadcrumbs: false
    },
    {
      id: 'pacientes_lista',
      title: 'Consulta',
      type: 'item',
      url: '/pacientes_lista',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    }
  ]

};

export default PacientesR;
