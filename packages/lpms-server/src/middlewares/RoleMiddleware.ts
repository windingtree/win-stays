import ApiError from '../exceptions/ApiError';

export default (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.UnauthorizedError());
      }
      const userRoles = req.user.roles;
      let hasRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return next(ApiError.AccessDenied());
      }
      next();
    } catch (e) {
      return next(ApiError.AccessDenied());
    }
  };
}
