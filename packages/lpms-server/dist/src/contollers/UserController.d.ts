import { NextFunction, Request, Response } from 'express';

export declare class UserController {
  login(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;

  getAll(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;

  createUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;

  logout(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;

  refresh(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}

declare const _default: UserController;
export default _default;
