import { useMemo } from 'react';
import { useRoutes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from './store';

// Pages
import { Home } from './pages/Home';
import { Wallet } from './pages/Wallet';
import { Login } from './pages/Login';

export interface ProtectedProps {
  component: React.ReactNode;
  path?: string;
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  title: string;
  label?: string;
  protected?: boolean;
  onClick?: () => void;
}

export type Routes = RouteConfig[];

export const Protected = ({
  component,
  path = '/login'
}: ProtectedProps) => {
  const location = useLocation();
  const { account } = useAppState();

  return (
    <>
      {
        account !== undefined
          ? component
          : <Navigate to={path} state={{ location }} />
      }
    </>
  );
};

export const pagesRoutesConfig: Routes = [
  {
    path: "/",
    element: <Home />,
    title: "Home",
    label: "Home",
  },
  {
    path: "/wallet",
    element: <Wallet />,
    title: "Wallet",
    label: "Wallet",
  },
  {
    path: "/login",
    element: <Login />,
    title: "Login",
    label: "Login",
  },
];

export const processPagesConfig = (config: Routes): Routes =>
  config.map(
    (route: RouteConfig) => route.protected
      ? {
        ...route,
        element: <Protected component={route.element} />
      }
      : route
  );

export const AppRoutes = () => useRoutes(
  useMemo(
    () => processPagesConfig(pagesRoutesConfig), []
  )
);

export const GlobalMenu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();
  const buildMenuConfig = useMemo(
    () => pagesRoutesConfig
      .reduce<Routes>(
        (a, v) => ([
          ...a,
          ...(
            v.label // Items without labels are ignored
              ? [
                {
                  ...v,
                  onClick: () => navigate(v.path)
                }
              ]
              : []
          )
        ]),
        []
      ),
    [navigate]
  );

  return (
    <Menu
      dropBackground={{ color: 'black', opacity: 0.7 }}
      dropAlign={{
        top: "bottom",
        left: "left",
      }}
      margin='small'
      disabled={isConnecting}
      icon={(<MenuIcon color='brand' />)}
      items={buildMenuConfig}
    />
  );
};
