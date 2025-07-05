import dashboard from './dashboard';
import pages from './pages';
import PacientesR from './pacientesR';
import Consultas from './consultas';
import Quimio from './quimio';
import Hospitalizacion from './hospitalizacion';
import user from './user';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, PacientesR, Consultas, Quimio, Hospitalizacion, user]
};

export default menuItems;
