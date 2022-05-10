import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useLocation, Navigate } from 'react-router-dom';
import { useAppState } from './store';

// Pages
import { Home } from './pages/Home';

export interface ProtectedProps {
  component: ReactNode;
  path?: string;
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  title: string;
  label?: string;
  protected?: boolean;
}

export type Routes = RouteConfig[];

export const Protected = ({
  component,
  path = '/'
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
    title: "Stays",
    label: "Home",
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
