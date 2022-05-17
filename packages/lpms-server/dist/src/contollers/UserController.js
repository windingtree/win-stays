'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator['throw'](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserController = void 0;
const UserService_1 = __importDefault(require('../services/UserService'));
const express_validator_1 = require('express-validator');
const ApiError_1 = __importDefault(require('../exceptions/ApiError'));

class UserController {
  login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          return next(ApiError_1.default.BadRequest('Validation error', errors.array()));
        }
        const userService = new UserService_1.default();
        const { login, password } = req.body;
        const data = yield userService.login(login, password);
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
    });
  }

  getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const userService = new UserService_1.default();
        const users = yield userService.getAllUsers();
        return res.json({ users });
      } catch (e) {
        next(e);
      }
    });
  }

  createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const login = req.body.login;
        const password = req.body.password;
        const roles = req.body.roles;
        const userService = new UserService_1.default();
        yield userService.createUser(login, password, roles);
        return res.json({ success: true });
      } catch (e) {
        next(e);
      }
    });
  }

  logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
          return next(ApiError_1.default.UnauthorizedError());
        }
        const userService = new UserService_1.default();
        yield userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json({
          status: 'success'
        });
      } catch (e) {
        next(e);
      }
    });
  }

  refresh(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { refreshToken } = req.cookies;
        const userService = new UserService_1.default();
        const data = yield userService.refresh(refreshToken);
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
    });
  }
}

exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map
