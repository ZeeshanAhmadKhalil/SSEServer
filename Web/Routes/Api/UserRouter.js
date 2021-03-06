import express from 'express'
import { check } from 'express-validator'

import { GetUserById, Login, Logout, Register } from '../../Controller/UserController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const UserRouter = express.Router()

/**
 * @swagger
 * /Api/User/Logout:
 *  get: 
 *      summary: Expire the use session
 *      tags:
 *      - User
 *      responses:
 *          '200':
 *              description: Session is expired sucessfully
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
UserRouter.get(
    '/Logout',
    UserAuth,
    Logout
)
/**
 * @swagger
 * /Api/User/GetUserById:
 *  get: 
 *      summary: Get user by id
 *      tags:
 *      - User
 *      responses:
 *          '200':
 *              description: User is sucessfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 */
UserRouter.get(
    '/GetUserById',
    UserAuth,
    GetUserById
)
/**
 * @swagger
 * /Api/User/Register:
 *  post: 
 *      summary: Register new user
 *      tags:
 *      - User
 *      responses:
 *          '200':
 *              description: User is registered successfully
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullName:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          location:
 *                              type: string
 *                          fcmToken:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 */
UserRouter.post(
    '/Register',
    [
        check('fullName', 'Full Name is required').not().isEmpty(),
        check('phone', 'Phone number should be 11 characters').isLength({ min: 11, max: 11 }),
        check('location', 'Location is required').not().isEmpty(),
        check('fcmToken', 'FCM token is required').not().isEmpty(),
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'Password length should be 8 at least').isLength({ min: 8 })
    ],
    Register
)
/**
 * @swagger
 * /Api/User/Login:
 *  patch: 
 *      summary: Login User
 *      tags:
 *      - User
 *      responses:
 *          '200':
 *              description: User is logged in successfully
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fcmToken:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 */
UserRouter.patch(
    '/Login',
    [
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        check('fcmToken', 'FCM token is required').not().isEmpty(),
    ],
    Login
)