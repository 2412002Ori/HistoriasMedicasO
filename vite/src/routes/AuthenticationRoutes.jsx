import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '',
      element: <LoginPage />
    },
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'free',
      element: <LoginPage />
    }
  ]
};

export default AuthenticationRoutes;
