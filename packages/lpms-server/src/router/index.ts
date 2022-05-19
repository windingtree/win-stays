import os from 'os';
import { Router } from 'express';
import { body, check } from 'express-validator';
import multer from 'multer';
import { AppRole } from '../types';
import authMiddleware from '../middlewares/AuthMiddleware';
import roleMiddleware from '../middlewares/RoleMiddleware';
import UserController from '../controllers/UserController';
import StorageController from '../controllers/StorageController';
import WalletController from '../controllers/WalletController';

const upload = multer({ dest: os.tmpdir() });
const router = Router();

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
router.post('/user/login',
  body('login').isString(),
  body('password').isString(),
  UserController.login);

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
router.get('/user/get-all', authMiddleware, UserController.getAll);

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
router.post('/user/create',
  authMiddleware,
  roleMiddleware([AppRole.MANAGER]),
  check('login').isString(),
  check('password').isString(),
  body('roles').isArray({ min: 1 }),
  body('roles.*').isIn([AppRole.STAFF, AppRole.MANAGER]),
  UserController.createUser
);

router.post('/user/refresh', UserController.refresh);

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
router.post('/user/logout', authMiddleware, UserController.logout);

/**
 * @swagger
 * /storage/file:
 *  post:
 *    security"
 *      - bearerAuth: []
 *    summary: file
 *    tags: [Storage service]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              filename:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
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
router.post('/storage/file', authMiddleware, upload.single('file'), StorageController.uploadFile);

/**
 * @swagger
 * /storage/metadata:
 *  post:
 *    security"
 *      - bearerAuth: []
 *    summary: file
 *    tags: [Storage service]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              filename:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
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
router.post('/storage/metadata', authMiddleware, upload.single('file'), StorageController.uploadMetadata);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: get all users
 *     tags: [Auth service]
 *     responses:
 *       200:
 *         description: get all users
 *       401:
 *         description: User is not Auth
 */
router.get('/addresses', WalletController.getWallets);

export default router;
