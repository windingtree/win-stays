import { Waku, WakuMessage } from 'js-waku';
import type { MessageType } from '@protobuf-ts/runtime';

export default class WakuService {
  private static _instance: WakuService = new WakuService();
  public waku: Waku;

  constructor() {
    if (WakuService._instance) {
      throw new Error("Error: Instantiation failed: Use DBService.getInstance() instead of new.");
    }
    WakuService._instance = this;
  }

  public static getInstance(): WakuService {
    return WakuService._instance;
  }

  public async connect(): Promise<WakuService> {
    if (this.waku) {
      return this;
    }

    console.log("Connecting to Waku...");
    const waku = await Waku.create({ bootstrap: { default: true } });
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

  public async makeWakuObserver(messageHandler, topics: string[]) {
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
