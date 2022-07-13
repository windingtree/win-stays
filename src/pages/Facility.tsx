import type { LatLngTuple } from "leaflet";
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Box, Text } from 'grommet';
import { useMemo } from 'react';

export const Facility = ({ }) => {
  const { isConnecting, facilities } = useAppState();
  const facility = useMemo(() => facilities.find(f => '/facility/' + f.id === window.location.pathname), [facilities])

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search',
          path: `/`
        }
      ]}
    >
      {!isConnecting && facility !== undefined &&
        <Box align='center' overflow='hidden'>
          <Text weight={500} size='2rem' margin='small'>
            {facility.name}
          </Text>
        </Box>
      }
    </PageWrapper>
  );
};
