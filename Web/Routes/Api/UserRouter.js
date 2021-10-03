import express from 'express'
import { check } from 'express-validator'

import { Login, Logout, Register } from '../../Controller/UserController.js'
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
        check('phone', 'Phone is required').not().isEmpty(),
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