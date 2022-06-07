import type { LatLngExpression } from "leaflet";
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box } from 'grommet';
import { useState } from 'react';

const defaultCenter: LatLngExpression = [51.505, -0.09]

export const Home = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngExpression>(defaultCenter)

  return (
    <PageWrapper>
      {!isConnecting &&
        <Box>
          <Search onSubmit={setCenter}/>
          <MapBox center={center} />
        </Box>
      }
    </PageWrapper>
  );
};
