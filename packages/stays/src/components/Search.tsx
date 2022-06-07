import type { LatLngExpression } from "leaflet";
import { Box, Button, Form, FormField, TextInput } from 'grommet';
import Logger from "../utils/logger";
import axios from 'axios';
import { useCallback, useState } from 'react';
import { MessageBox, MessageLoadingBox } from "./MessageBox";

const logger = Logger('Search');

export const Search: React.FC<{
  onSubmit: React.Dispatch<React.SetStateAction<LatLngExpression>>
}> = ({ onSubmit }) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleSubmit = useCallback(
    async () => {
      logger.info('Submit')
      setLoading(true);
      setError(undefined);
      try {
        const res = await axios.request({
          url: `https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`,
          method: 'GET'
        })

        if (res.data === undefined) {
          throw Error('Something went wrong')
        }
        if (res.data.length === 0) {
          throw Error('Could not find place')
        }

        onSubmit([res.data[0].lat, res.data[0].lon])
        setLoading(false);
      } catch (error) {
        logger.error(error);
        const message = (error as Error).message || 'Unknown Search error'
        setError(message);
        setLoading(false);
      }
    }, [searchValue, onSubmit])
  return (
    <Form onSubmit={() => handleSubmit()}>
      <Box direction="row" align="end">
        <FormField label="Place">
          <TextInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="type here"
          />
        </FormField>
        <Box pad={{ vertical: 'small', horizontal: 'xsmall' }}>
          <Button type='submit' label='Search...' />
        </Box>
      </Box>
      <MessageLoadingBox type='info' show={loading}>
        loading...
      </MessageLoadingBox>
      <MessageBox type='error' show={!!error}>
        {error}
      </MessageBox>
    </Form>
  );
};
