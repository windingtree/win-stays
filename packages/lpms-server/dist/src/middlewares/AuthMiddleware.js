'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const ApiError_1 = __importDefault(require('../exceptions/ApiError'));
const TokenService_1 = __importDefault(require('../services/TokenService'));
exports.default = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError_1.default.UnauthorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError_1.default.UnauthorizedError());
    }
    const tokenService = new TokenService_1.default();
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError_1.default.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError_1.default.UnauthorizedError());
  }
};
//# sourceMappingURL=AuthMiddleware.js.map
