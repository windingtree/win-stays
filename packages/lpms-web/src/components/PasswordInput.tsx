import React from 'react';

import { Hide, View, Lock } from 'grommet-icons';
import { Box, Button, TextInput } from 'grommet';

export const PasswordInput = () => {
  const [value, setValue] = React.useState('');
  const [reveal, setReveal] = React.useState(false);

  return (
    <Box
      width="medium"
      direction="row"
      // align="center"
      round="xsmall"
      border
    >
      <TextInput
        plain
        icon={<Lock />}

        type={reveal ? 'text' : 'password'}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <Button
        plain
        margin={{ horizontal: 'xsmall' }}
        icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
        onClick={() => setReveal(!reveal)}
      />
    </Box>
  );
};
