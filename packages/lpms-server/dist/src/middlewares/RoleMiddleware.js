'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const ApiError_1 = __importDefault(require('../exceptions/ApiError'));
exports.default = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError_1.default.UnauthorizedError());
      }
      const userRoles = req.user.roles;
      let hasRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return next(ApiError_1.default.AccessDenied());
      }
      next();
    } catch (e) {
      return next(ApiError_1.default.AccessDenied());
    }
  };
};
//# sourceMappingURL=RoleMiddleware.js.map
