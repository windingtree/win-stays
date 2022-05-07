import type  { Waku } from 'js-waku';
import type { MessageType } from '@protobuf-ts/runtime';
import { WakuMessage } from 'js-waku';

export const sendMessage = <T extends object>(
  waku: undefined | Waku,
  protoMessageInstance: MessageType<T>,
  message: T,
  topic: string
): Promise<void> => {
  if (!waku) {
    throw new Error('Protocol is not ready');
  }

  return WakuMessage
    .fromBytes(protoMessageInstance.toBinary(message), topic)
    .then(waku.relay.send);
};

export const processMessage = <T extends object>(
  protoMessageInstance: MessageType<T>,
  wakuMessage: WakuMessage
): T | undefined => {
  if (!wakuMessage.payload) return;
  return protoMessageInstance.fromBinary(wakuMessage.payload);
};
