'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorized');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static AccessDenied() {
    return new ApiError(403, 'Access denied');
  }
}

exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map
