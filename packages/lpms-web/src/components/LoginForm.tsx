import React from 'react';

import { Box, MaskedInput, Button, TextInput } from 'grommet';
import { Hide, View, Lock, MailOption } from 'grommet-icons';

export const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [reveal, setReveal] = React.useState(false);

  const emailMask = [
    {
      regexp: /^[\w\-_.]+$/,
      placeholder: 'example',
    },
    { fixed: '@' },
    {
      regexp: /^[\w]+$/,
      placeholder: 'my',
    },
    { fixed: '.' },
    {
      regexp: /^[\w]+$/,
      placeholder: 'com',
    },
  ];

  return (
    <Box fill align="center" justify="start" pad="large">
      <Box width="medium" gap="small">
        <MaskedInput
          icon={<MailOption />}
          mask={emailMask}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Box
          width="medium"
          direction="row"
          round="xsmall"
          border
        >
          <TextInput
            plain
            icon={<Lock />}
            type={reveal ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            plain
            margin={{ horizontal: 'xsmall' }}
            icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
            onClick={() => setReveal(!reveal)}
          />
        </Box>
        <Button
          label='Login'
          // plain
          onClick={() => console.log('SUBMIT')}
        />
      </Box>
    </Box>
  );
}
