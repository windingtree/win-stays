run server for dev - `yarn dev`

run swagger - `npx ts-node ./swagger/server.ts`

How to add observer on waku:

`Test - is instanse from protobuff`

```typescript
import WakuService from './services/WakuService';
import { Test } from "./proto/test";
import WakuService, { WakuMessageHandler } from './services/WakuService';

const wakuService = await WakuService
  .getInstance()
  .connect()
;

const handler: WakuMessageHandler = (message) => {
  return wakuService.processMessage(Test, message);
};

await wakuService.makeWakuObserver(handler, ['some-topic']);
```

```typescript
const wakuService = await WakuService
  .getInstance()
  .connect()
;

const testPayload: Test = {
  test1: 'some-message',
  test2: 'some-message 2'
};

await wakuService.sendMessage(Test, testPayload, 'some-topic');
```

Prometheus implementation:
Set .env variables

```dotenv
APP_PROMETHEUS_PORT=9100
PROMETHEUS_ENABLED=true
```

```
http://localhost:9100/metrics - metrics api
```
