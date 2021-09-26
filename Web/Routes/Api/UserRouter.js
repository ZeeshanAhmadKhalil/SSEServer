import express from 'express'
import { check } from 'express-validator'

import { Login, Logout, Register } from '../../Controller/UserController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const UserRouter = express.Router()

// * @route   POST Api/User/Register
// * @desc    User Registration
// * @access  Public
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

// * @route   POST Api/User/Login
// * @desc    Login
// * @access  Public
UserRouter.post(
    '/Login',
    [
        check('email', 'Enter a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        check('fcmToken', 'FCM token is required').not().isEmpty(),
    ],
    Login
)

// * @route   GET Api/User/Logout
// * @desc    Logout
// * @access  Protected
UserRouter.get(
    '/Logout',
    UserAuth,
    Logout
)