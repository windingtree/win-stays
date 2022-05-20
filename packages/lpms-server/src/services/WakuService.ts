import { Waku, WakuMessage } from 'js-waku';
import type { MessageType } from '@protobuf-ts/runtime';
import { wakuConfig } from '../config';

export type WakuMessageHandler = (message: WakuMessage) => void;

export class WakuService {
  public waku: Waku;

  public async connect(): Promise<WakuService> {
    if (this.waku) {
      return this;
    }

    console.log("Connecting to Waku...");
    const waku = await Waku.create(wakuConfig);
    await waku.waitForRemotePeer();
    console.log("...Connected");

    this.waku = waku;
    return this;
  }

  public async sendMessage<T extends object>(
    protoMessageInstance: MessageType<T>,
    message: T,
    topic: string
  ): Promise<void> {
    if (!this.waku) {
      await this.connect();
    }

    const msg = await WakuMessage
      .fromBytes(protoMessageInstance.toBinary(message), topic);
    await this.waku.relay.send(msg);
  }

  public processMessage<T extends object>(
    protoMessageInstance: MessageType<T>,
    wakuMessage: WakuMessage
  ): T | undefined {
    if (!wakuMessage.payload) return;
    return protoMessageInstance.fromBinary(wakuMessage.payload);
  }

  public async makeWakuObserver(messageHandler: WakuMessageHandler, topics: string[]) {
    if (!this.waku) {
      await this.connect();
    }
    this.waku.relay.addObserver(messageHandler, topics);
    console.log('Subscribed to topics:', topics);

    return () => {
      this.waku.relay.deleteObserver(messageHandler, topics);
      console.log('Unsubscribed from topics:', topics);
    };
  }
}

export default new WakuService();
