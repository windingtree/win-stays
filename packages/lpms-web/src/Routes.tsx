import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAppState } from './store';

// Pages
import { Home } from './pages/Home';
import { Wallet } from './pages/Wallet';

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
  onClick?: () => void;
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
  {
    path: "/wallet",
    element: <Wallet />,
    title: "Light Wallet",
    label: "Wallet",
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
    <div>
      {buildMenuConfig.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
