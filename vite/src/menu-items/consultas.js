// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const Consultas = {
  id: 'consultas',
  title: 'Consultas',
  type: 'group',
  children : [
    {
        id: 'consultas_lista',
        title: 'CONSULTAS',
        type: 'item',
        url: '/consultas_lista',
        icon: FolderSharedIcon,
        breadcrumbs: false
    } , 
  ]

};

export default Consultas;