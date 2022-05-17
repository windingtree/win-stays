import { Express } from 'express-serve-static-core';

export default class ServerService {
  protected PORT: number;
  protected app: Express;
  protected server: any;

  constructor(port: number);

  private bootstrap;

  get getApp(): Express;

  start(): Promise<void>;
}
