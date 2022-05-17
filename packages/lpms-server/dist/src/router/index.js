'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const router = (0, express_1.Router)();
const UserController_1 = __importDefault(require('../contollers/UserController'));
const express_validator_1 = require('express-validator');
const AuthMiddleware_1 = __importDefault(require('../middlewares/AuthMiddleware'));
const RoleMiddleware_1 = __importDefault(require('../middlewares/RoleMiddleware'));
const types_1 = require('../types');
/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: get access token
 *    tags: [Auth service]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *                login:
 *                  type: string
 *                  description: user's login
 *                password:
 *                  type: string
 *                  description: user's password
 *
 *    responses:
 *      200:
 *        description: It's ok
 *      400:
 *        description: Handled Error
 *      500:
 *        description: Some server error
 */
router.post('/user/login', (0, express_validator_1.body)('login').isString(), (0, express_validator_1.body)('password').isString().isLength({ min: 3 }), UserController_1.default.login);
/**
 * @swagger
 * /user/get-all:
 *   get:
 *     summary: get all users
 *     tags: [Auth service]
 *     responses:
 *       200:
 *         description: get all users
 *       401:
 *         description: User is not Auth
 */
router.get('/user/get-all', AuthMiddleware_1.default, UserController_1.default.getAll);
/**
 * @swagger
 * /user/create:
 *  post:
 *    security:
 *       - bearerAuth: []
 *    summary: create a new user (only for manager role)
 *    tags: [Auth service]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *                login:
 *                  type: string
 *                  description: user's login
 *                password:
 *                  type: string
 *                  description: user's password
 *                roles:
 *                  type: array
 *                  items:
 *                    type: string
 *                    enum: [manager, staff]
 *                  description: roles (staff, manager)
 *    responses:
 *      200:
 *        description: It's ok
 *      400:
 *        description: Handled Error
 *      401:
 *        description: User is not Auth
 *      403:
 *        description: Access denied
 *      500:
 *        description: Some server error
 */
router.post('/user/create', AuthMiddleware_1.default, (0, RoleMiddleware_1.default)([types_1.AppRole.MANAGER]), (0, express_validator_1.body)('login').isString(), (0, express_validator_1.body)('password').isString().isLength({ min: 3 }), (0, express_validator_1.body)('roles').isArray(), UserController_1.default.createUser);
router.post('/user/refresh', UserController_1.default.refresh);
/**
 * @swagger
 * /user/logout:
 *  post:
 *    security:
 *       - bearerAuth: []
 *    summary: logout
 *    tags: [Auth service]
 *    responses:
 *      200:
 *        description: It's ok
 *      400:
 *        description: Handled Error
 *      401:
 *        description: User is not Auth
 *      500:
 *        description: Some server error
 */
router.post('/user/logout', AuthMiddleware_1.default, UserController_1.default.logout);
exports.default = router;
//# sourceMappingURL=index.js.map
