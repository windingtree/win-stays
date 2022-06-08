import type { LatLngTuple } from "leaflet";
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box } from 'grommet';
import { useState } from 'react';

const defaultCenter: LatLngTuple = [51.505, -0.09]

export const Home = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter)


  return (
    <PageWrapper>
      {!isConnecting &&
        <Box>
          Hi
        </Box>
      }
      <Search onSubmit={setCenter} />
      <MapBox center={center} />
    </PageWrapper>
  );
};
