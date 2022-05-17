export default class ApiError extends Error {
  errors: any[];
  status: number;

  constructor(status: number, message: string, errors?: any[]);

  static UnauthorizedError(): ApiError;

  static BadRequest(message: any, errors?: any[]): ApiError;

  static AccessDenied(): ApiError;
}
