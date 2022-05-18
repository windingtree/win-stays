import ApiError from '../exceptions/ApiError';
import { NextFunction, Request, Response } from 'express';

export default (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Something went wrong' });
}
