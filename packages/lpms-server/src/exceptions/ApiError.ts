export default class ApiError extends Error {
  public errors;
  public status: number;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorized');
  }

  static BadRequest(message, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static AccessDenied() {
    return new ApiError(403, 'Access denied');
  }
}
