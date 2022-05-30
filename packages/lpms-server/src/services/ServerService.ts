import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import router from '../router/index';
import { Express } from 'express-serve-static-core';
import errorMiddleware from '../middlewares/ErrorMiddleware';
import { debugEnabled } from '../config';
import responseTime from 'response-time';
import { MetricsService } from './MetricsService';

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
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // CORS
    const corsOptions = {
      origin: process.env.CLIENT_URL, // @todo Add handling of origins array
      optionsSuccessStatus: 200,
      methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
      exposedHeaders: 'Content-Range,X-Content-Range',
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    // Security middleware
    this.app.set('trust proxy', 1);
    this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(helmet.contentSecurityPolicy());
    this.app.use(helmet.crossOriginEmbedderPolicy());
    this.app.use(helmet.crossOriginOpenerPolicy());
    this.app.use(helmet.crossOriginResourcePolicy());
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.expectCt());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.originAgentCluster());
    this.app.use(helmet.permittedCrossDomainPolicies());
    this.app.use(helmet.referrerPolicy());
    this.app.use(helmet.xssFilter());

    this.app.use(responseTime((request: Request, response: Response, time: number) => {
      if (request?.route?.path) {
        MetricsService.restResponseTimeHistogram.observe({
          method: request.method,
          route: request.route.path,
          status_code: response.statusCode
        }, time / 1000); //in seconds
      }
    }));

    if (debugEnabled) {
      this.app.use(morgan('dev'));
    }

    this.app.use('/api', router);

    this.app.use(errorMiddleware);
  }

  get getApp(): Express {
    return this.app;
  }

  async start() {
    try {
      this.server = this.app.listen(this.PORT, () => console.log(`Server started on PORT = ${this.PORT}`));
    } catch (e) {
      console.error(e);
    }
    return this.server;
  }
}
