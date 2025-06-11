// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const User = {
  id: 'usuarios',
  title: 'Usuarios',
  type: 'group',
  children : [
    {
        id: 'pacientes_lista',
        title: 'Lista de usuarios',
        type: 'item',
        url: '/user_lista',
        icon: FolderSharedIcon,
        breadcrumbs: false
    }
    
  ]

};

export default User;