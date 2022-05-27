import { NextFunction, Request, Response } from 'express';
import userService from '../services/UserService';
import { AppRole, AuthRequest } from '../types';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiError';
import { refreshTokenMaxAge } from '../config';

export class UserController {

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { login, password } = req.body;
      const data = await userService.login(login, password);

      res.cookie('refreshToken', data.refreshToken, {
        maxAge: refreshTokenMaxAge,
        httpOnly: true
      });

      return res.json({
        id: data.id,
        login: data.login,
        roles: data.roles,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } catch (e) {
      next(e);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();

      return res.json({ users });
    } catch (e) {
      next(e);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const login = req.body.login;
      const password = req.body.password;
      const roles: AppRole[] = req.body.roles;

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

      const data = await userService.refresh(refreshToken);

      res.cookie('refreshToken', data.refreshToken, {
        maxAge: refreshTokenMaxAge,
        httpOnly: true
      });

      return res.json({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } catch (e) {
      next(e);
    }
  }

  public async updateUserPassword(req: AuthRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation error', errors.array()));
    }

    const userId = req.body.userId;
    const password = req.body.password;

    if (!req.user.roles.includes(AppRole.MANAGER) && req.user.id !== userId) {
      return next(ApiError.AccessDenied());
    }

    try {
      await userService.updateUserPassword(userId, password);

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  public async updateUserRoles(req: AuthRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation error', errors.array()));
    }

    try {
      const userId: number = req.body.userId;
      const roles: AppRole[] = req.body.roles;

      await userService.updateUserRoles(userId, roles);

      return res.json({ success: true });
    } catch (e) {
      next(e);
    }

  }
}

export default new UserController();
