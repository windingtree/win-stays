import ApiError from '../exceptions/ApiError';
import TokenService from '../services/TokenService';
import UserService from '../services/UserService';
import { UserDTO } from '../types';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const tokenService = new TokenService();
    const userData: UserDTO = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    const userService = new UserService();
    const userExists = await userService.getUserIdByLogin(userData.login);

    if (!userExists) {
      return next(ApiError.UnauthorizedError());
    }

    const user = await userService.getUserById(userData.id);
    req.user = userService.getUserDTO(user);
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
