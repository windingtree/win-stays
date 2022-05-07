# React hooks

All custom hooks are in the `./src/hooks` directory.

## `useWaku`

Easy `js-waku` integration.

```typescript
import { useWaku } from '../hooks/useWaku';

const waku = useWaku(<options>); // options are optional
```

Initially `waku` instance is undefined. When connection is made - `waku` starts refer to `Waku` instance.

## `useWakuObserver`

Easy subscription to `waku` messages bus. When a component is unmounted all subscriptions made by `useWakuObserver` automatically stopped.

```typescript
import type { WakuMessage } from 'js-waku';
import { useState } from 'react';
import { useAppState } from '../store';
import { useWakuObserver } from '../hooks/useWakuObserver';
import { processMessage } from './utils/waku';
import { IncomingMessageProto } from 'path/to/protobuf/definitions';

export const myComponent = () => {
  const { waku } = useAppState();
  const [message, setMessage] = useState<string>('');

  const messageHandler = (incomingMessage: WakuMessage): void => {
    try {
      const decodedMessage = processMessage<IncomingMessageProto>(
        IncomingMessageProto,
        incomingMessage
      );
      setMessage(decodedMessage || '');
    } catch (error) {
      console.error(error);
      setMessage('');
    }
  };

  useWakuObserver(
    waku,
    messageHandler,
    `messages/channel/topic`
  );

  return (
    <div>
     {message !== '' &&
       <>
        Incoming message: {message}
       </>
     }
    </div>
  );
};
```
