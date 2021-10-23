import express from 'express'
import { check } from 'express-validator'

import { AddProductToCart, GetMyCart, RemoveProductFromCart, TotalOfAllCartProcucts, TotalProductsInCart } from '../../Controller/CartController.js'
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
/**
 * @swagger
 * /Api/Cart/RemoveProductFromCart:
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
    '/RemoveProductFromCart',
    [
        UserAuth,
        [
            check('productId', 'Product id is required').not().isEmpty(),
        ]
    ],
    RemoveProductFromCart
)
/**
 * @swagger
 * /Api/Cart/GetMyCart:
 *  get: 
 *      summary: Get My Cart 
 *      tags:
 *      - Cart
 *      responses:
 *          '200':
 *              description: My Cart is successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
CartRouter.get(
    '/GetMyCart',
    UserAuth,
    GetMyCart
)
/**
 * @swagger
 * /Api/Cart/TotalProductsInCart:
 *  get: 
 *      summary: Get Total Products in the cart
 *      tags:
 *      - Cart
 *      responses:
 *          '200':
 *              description: Total products in cart count is successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
CartRouter.get(
    '/TotalProductsInCart',
    UserAuth,
    TotalProductsInCart
)
/**
 * @swagger
 * /Api/Cart/TotalOfAllCartProcucts:
 *  get: 
 *      summary: Get Total cost of Products in the cart
 *      tags:
 *      - Cart
 *      responses:
 *          '200':
 *              description: Total cost of products in cart count is successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
CartRouter.get(
    '/TotalOfAllCartProcucts',
    UserAuth,
    TotalOfAllCartProcucts
)
