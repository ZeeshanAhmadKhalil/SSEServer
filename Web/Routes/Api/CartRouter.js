import express from 'express'

import { } from '../../Controller/CartController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const CartRouter = express.Router()

// * @route   GET Api/Cart
// * @desc    Cart Router
// * @access  Public
CartRouter.get('/', (req, res) => res.send('Cart Router'))