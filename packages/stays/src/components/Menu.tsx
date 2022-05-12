import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as GMenu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import styled from 'styled-components';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { pagesRoutesConfig, Routes } from '../Routes';

const MenuWrap = styled(GMenu)`
  border-radius: 50%;
  border: 1px solid black;
`;

export const Menu = () => {
  const { isConnecting } = useAppState();
  const { winWidth } = useWindowsDimension();
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
    <MenuWrap
      style={{ padding: winWidth > 768 ? '' : '0.125rem' }}
      dropBackground={{ color: 'black', opacity: 0.9 }}
      dropAlign={{
        top: "bottom",
        left: "left",
      }}
      disabled={isConnecting}
      icon={(<MenuIcon color='black' />)}
      items={buildMenuConfig}
    />
  );
};
