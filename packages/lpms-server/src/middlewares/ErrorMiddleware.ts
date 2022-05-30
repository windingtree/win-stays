import ApiError from '../exceptions/ApiError';
import { NextFunction, Request, Response } from 'express';
import LogService from '../services/LogService';
import { debugEnabled } from '../config';
import { MetricsService } from '../services/MetricsService';

export default (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    if (debugEnabled) {
      LogService.yellow(`Handle error: ${err.message}`);
    }
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  if (debugEnabled) {
    LogService.red(`Fatal error: ${err.message}`);
  }

  MetricsService.fatalErrorCounter.inc();

  return res.status(500).json({ message: 'Something went wrong' });
}
