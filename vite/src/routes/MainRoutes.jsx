import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

//importacion menu

const PacientesInscripcion = Loadable(lazy(() => import('../views/pacientes/pacientes_formulario')));
const PacientesLista = Loadable(lazy(() => import('../views/pacientes/pacientes_list'))); 
const PacientesTriajeList = Loadable(lazy(() => import('../views/pacientes/pacientes_list_triaje')));
const UserForm = Loadable(lazy(() => import('../views/user/User_f')));
import UserList from '../views/user/list_user';
import Consulta from '../views/consulta/consulta_formulario';
import ConsultaList from '../views/consulta/consulta_list';
import Doctoresform from '../views/Doctores/Doctores_formulario';
import DoctorList from '../views/Doctores/Doctores_list'; 

// Quimioterapia
import QuimioList from '../views/quimio/quimio_list';
import QuimioFormulario from '../views/quimio/quimio_formulario';

// Hospitalización
import HospitalizacionList from '../views/hospitalizacion/hospitalizacion.list';
import HospitalizacionFormulario from '../views/hospitalizacion/hospitalizacion_formulario';

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: '/pacientes_inscripcion',
      element: <PacientesInscripcion/>
    },
    {
      path: '/pacientes_lista',
      element: <PacientesLista />
    },

    { 
      path: '/Users',
      element: < UserForm />
    },
    
    {
      path: '/user_lista',
      element: <UserList />
    },
    
    {
      path: '/consultas',
      element : <Consulta/>
    },
    {
      path: '/consultas_lista',
      element: <ConsultaList />
    },
    {
      path: './doctores',
      element: <Doctoresform />
    },
    {
      path: '/doctores_lista',
      element: <DoctorList />
    },
    {
      path: '/pacientes/triaje/list',
      element: <PacientesTriajeList />
    },
    // Rutas de Quimioterapia
    {
      path: '/quimio_lista',
      element: <QuimioList />
    },
    {
      path: '/quimio_formulario',
      element: <QuimioFormulario />
    },
    // Rutas de Hospitalización
    {
      path: '/hospitalizacion_lista',
      element: <HospitalizacionList />
    },
    {
      path: '/hospitalizacion_formulario',
      element: <HospitalizacionFormulario />
    },
  ]
};

export default MainRoutes;
