import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import { AppRole } from '../types';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiError';

export class UserController {

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const userService = new UserService();
      const { login, password } = req.body;
      const data = await userService.login(login, password);

      res.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      return res.json({
        id: data.id,
        login: data.login,
        roles: data.roles,
        accessToken: data.accessToken
      });
    } catch (e) {
      next(e);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userService = new UserService();
      const users = await userService.getAllUsers();

      return res.json({ users });
    } catch (e) {
      next(e);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const login = req.body.login;
      const password = req.body.password;
      const roles: AppRole[] = req.body.roles;

      const userService = new UserService();
      await userService.createUser(login, password, roles);

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return next(ApiError.UnauthorizedError());
      }

      const userService = new UserService();
      await userService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json({
        status: 'success'
      });
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const userService = new UserService();
      const data = await userService.refresh(refreshToken);

      res.cookie('refreshToken', data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });

      return res.json({
        accessToken: data.accessToken
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
