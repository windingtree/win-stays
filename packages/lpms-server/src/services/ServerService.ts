import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '../router/index';
import { Express } from 'express-serve-static-core';
import errorMiddleware from '../middlewares/ErrorMiddleware';

export default class ServerService {
  protected PORT: number;
  protected app: Express;
  protected server;

  constructor(port: number) {
    this.PORT = port;
    this.app = express();
    this.bootstrap();
  }

  private bootstrap() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(cors({
      credentials: true,
      origin: process.env.CLIENT_URL
    }));

    this.app.use('/api', router);

    this.app.use(errorMiddleware);
  }

  get getApp(): Express {
    return this.app;
  }

  async start() {
    try {
      this.server = await this.app.listen(this.PORT, () => console.log(`Server started on PORT = ${this.PORT}`));
    } catch (e) {
      console.error(e);
    }
  }
}
