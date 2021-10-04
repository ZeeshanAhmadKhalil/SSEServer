import express from 'express'
import { check } from 'express-validator'

import { AddProductToCart } from '../../Controller/CartController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const CartRouter = express.Router()

/**
 * @swagger
 * /Api/Cart/AddProductToCart:
 *  patch: 
 *      summary: Like the product 
 *      tags:
 *      - Cart
 *      responses:
 *          '200':
 *              description: Product is liked and added to wishlist
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          productId:
 *                              type: string
 */
CartRouter.patch(
    '/AddProductToCart',
    [
        UserAuth,
        [
            check('productId', 'Product id is required').not().isEmpty(),
        ]
    ],
    AddProductToCart
)