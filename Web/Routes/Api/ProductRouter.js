import express from 'express'
import { check, body } from 'express-validator'

import {
    AddProduct,
    ChangeOrderStatus,
    DeleteProduct,
    EditProduct,
    ExchangeProducts,
    GetCategories,
    GetCities,
    GetConditions,
    GetExchangeProducts,
    GetMostlyLikedProducts,
    GetMyOrders,
    GetMyProducts,
    GetMyWishlist,
    GetOrderById,
    GetProductById,
    GetProductsByCategory,
    GetProductsToExchange,
    GetRequestedExchanges,
    GetRequestingExchanges,
    GetSellingProducts,
    LikeProduct,
    OrderProducts,
    SearchProducts,
    SearchProductsByKeywords
} from '../../Controller/ProductController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const ProductRouter = express.Router()

/**
 * @swagger
 * /Api/Product/AddProduct:
 *  post: 
 *      summary: Add the product
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Product is successfully added
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
 *                          productName:
 *                              type: string
 *                          price:
 *                              type: string
 *                          quantity:
 *                              type: string
 *                          forExchange:
 *                              type: string
 *                          description:
 *                              type: string
 *                          categoryId:
 *                              type: string
 *                          cityId:
 *                              type: string
 *                          conditionId:
 *                              type: string
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 */
ProductRouter.post(
    '/AddProduct',
    [
        UserAuth,
        [
            check('productName', 'Product name is required').not().isEmpty(),
            check('price', 'Price should be a number').isNumeric(),
            check('forExchange', 'ForExchange should be boolean').isBoolean(),
            check('description', 'Description is required').not().isEmpty(),
            check('categoryId', 'Category should be a number').not().isEmpty(),
            check('cityId', 'City should be a number').not().isEmpty(),
            check('conditionId', 'Condition should be a number').not().isEmpty(),
            body('images').custom((value, { req }) => {
                if (value.length < 3) {
                    throw new Error('Each product should have at least 3 images');
                }
                // Indicates the success of this synchronous custom validator
                return true;
            }),
        ]
    ],
    AddProduct
)
/**
 * @swagger
 * /Api/Product/LikeProduct:
 *  patch: 
 *      summary: Like the product 
 *      tags:
 *      - Product
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
ProductRouter.patch(
    '/LikeProduct',
    [
        UserAuth,
        [
            check('productId', 'Product id is required').not().isEmpty(),
        ]
    ],
    LikeProduct
)
/**
 * @swagger
 * /Api/Product/OrderProducts:
 *  patch: 
 *      summary: Order all products in the cart
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Order is successfully placed
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
 *                          deliveryAddress:
 *                              type: string
 *                          isPaymentByHand:
 *                              type: boolean
 */
ProductRouter.patch(
    '/OrderProducts',
    [
        UserAuth,
        [
            check('isPaymentByHand', 'isPaymentByHand is required').not().isEmpty(),
            check('deliveryAddress', 'deliveryAddress is required').not().isEmpty(),
        ]
    ],
    OrderProducts,
)
/**
 * @swagger
 * /Api/Product/ExchangeProducts:
 *  patch: 
 *      summary: Order all products in the cart
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Order is successfully placed
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
 *                          deliveryAddress:
 *                              type: string
 *                          requestedProduct:
 *                              type: string
 *                          requestingProduct:
 *                              type: string
 *                          isPaymentByHand:
 *                              type: boolean
 */
ProductRouter.patch(
    '/ExchangeProducts',
    [
        UserAuth,
        [
            check('isPaymentByHand', 'isPaymentByHand is required').not().isEmpty(),
            check('deliveryAddress', 'deliveryAddress is required').not().isEmpty(),
            check('requestingProduct', 'requestingProduct is required').not().isEmpty(),
            check('requestedProduct', 'requestedProduct is required').not().isEmpty(),
        ]
    ],
    ExchangeProducts,
)
/**
 * @swagger
 * /Api/Product/ChangeOrderStatus:
 *  patch: 
 *      summary: Change Deposit Request Status
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Deposit Request Status is successfully changed
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
 *                          orderId:
 *                              type: string
 *                          status:
 *                              type: string
 */
ProductRouter.patch(
    '/ChangeOrderStatus',
    [
        UserAuth,
        [
            check('orderId', 'orderId is required').not().isEmpty(),
            check('status', 'status is required').not().isEmpty(),
        ]
    ],
    ChangeOrderStatus
)
/**
 * @swagger
 * /Api/Product/GetProductById:
 *  get: 
 *      summary: Get product details
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Product details are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: productId
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetProductById',
    UserAuth,
    GetProductById
)
/**
 * @swagger
 * /Api/Product/GetOrderById:
 *  get: 
 *      summary: Get Order details
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Order details are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: orderId
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetOrderById',
    UserAuth,
    GetOrderById
)
/**
 * @swagger
 * /Api/Product/SearchProducts:
 *  get: 
 *      summary: Search product by name, description and category
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Searched products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *      - in: query
 *        name: searchQuery
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/SearchProducts',
    UserAuth,
    SearchProducts
)
/**
 * @swagger
 * /Api/Product/SearchProductsByKeywords:
 *  get: 
 *      summary: Search product by name, description and category
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Searched products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          keywords:
 *                              type: array
 *                              items:
 *                                  type: string
 */
ProductRouter.post(
    '/SearchProductsByKeywords',
    UserAuth,
    SearchProductsByKeywords
)
/**
 * @swagger
 * /Api/Product/GetSellingProducts:
 *  get: 
 *      summary: Get selling products 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Selling products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetSellingProducts',
    UserAuth,
    GetSellingProducts
)
/**
 * @swagger
 * /Api/Product/GetRequestingExchanges:
 *  get: 
 *      summary: Get Requesting Exchanges 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Requesting Exchanges are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 */
ProductRouter.get(
    '/GetRequestingExchanges',
    UserAuth,
    GetRequestingExchanges
)
/**
 * @swagger
 * /Api/Product/GetRequestedExchanges:
 *  get: 
 *      summary: Get Requested Exchanges 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Requested Exchanges are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 */
ProductRouter.get(
    '/GetRequestedExchanges',
    UserAuth,
    GetRequestedExchanges
)
/**
 * @swagger
 * /Api/Product/GetProductsByCategory:
 *  get: 
 *      summary: Get selling products 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Selling products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: categoryId
 *        schema:
 *          type: string
 *      - in: query
 *        name: currentProductId
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetProductsByCategory',
    UserAuth,
    GetProductsByCategory
)
/**
 * @swagger
 * /Api/Product/GetExchangeProducts:
 *  get: 
 *      summary: Get exchange products 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Exchange products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetExchangeProducts',
    UserAuth,
    GetExchangeProducts
)
/**
 * @swagger
 * /Api/Product/GetMyWishlist:
 *  get: 
 *      summary: Get Wishlist 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Wishlist are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetMyWishlist',
    UserAuth,
    GetMyWishlist
)
/**
 * @swagger
 * /Api/Product/GetMyOrders:
 *  get: 
 *      summary: Get My orders 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: My orders are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetMyOrders',
    UserAuth,
    GetMyOrders
)
/**
 * @swagger
 * /Api/Product/GetMyProducts:
 *  get: 
 *      summary: Get My products 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: My products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetMyProducts',
    UserAuth,
    GetMyProducts
)
/**
 * @swagger
 * /Api/Product/GetProductsToExchange:
 *  get: 
 *      summary: Get My products 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: My products are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *      - in: query
 *        name: categoryId
 *        schema:
 *          type: integer
 */
ProductRouter.get(
    '/GetProductsToExchange',
    UserAuth,
    GetProductsToExchange
)
/**
 * @swagger
 * /Api/Product/GetMostlyLikedProducts:
 *  get: 
 *      summary: Get 5 Mostly liked products
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: 5 Mostly liked productsare successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetMostlyLikedProducts',
    UserAuth,
    GetMostlyLikedProducts
)
/**
 * @swagger
 * /Api/Product/GetConditions:
 *  get: 
 *      summary: Get Conditions
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Conditions are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetConditions',
    UserAuth,
    GetConditions
)
/**
 * @swagger
 * /Api/Product/GetCategories:
 *  get: 
 *      summary: Get Categories
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Categories are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetCategories',
    UserAuth,
    GetCategories
)
/**
 * @swagger
 * /Api/Product/GetCities:
 *  get: 
 *      summary: Get Cities
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Cities are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 */
ProductRouter.get(
    '/GetCities',
    UserAuth,
    GetCities
)
/**
 * @swagger
 * /Api/Product/EditProduct:
 *  put: 
 *      summary: Edit the product
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Product is successfully edited
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
 *                          productName:
 *                              type: string
 *                          price:
 *                              type: string
 *                          forExchange:
 *                              type: string
 *                          description:
 *                              type: string
 *                          categoryId:
 *                              type: string
 *                          cityId:
 *                              type: string
 *                          conditionId:
 *                              type: string
 *                          images:
 *                              type: array
 *                              items:
 *                                  type: string
 */
ProductRouter.put(
    '/EditProduct',
    [
        UserAuth,
        [
            check('productId', 'Product id is required').not().isEmpty(),
            check('productName', 'Product name is required').not().isEmpty(),
            check('price', 'Price should be a number').isNumeric(),
            check('forExchange', 'ForExchange should be boolean').isBoolean(),
            check('description', 'Description is required').not().isEmpty(),
            check('categoryId', 'Category should be a number').not().isEmpty(),
            check('cityId', 'City should be a number').not().isEmpty(),
            check('conditionId', 'Condition should be a number').not().isEmpty(),
            body('images').custom((value, { req }) => {
                if (value.length < 3) {
                    throw new Error('Each product should have at least 3 images');
                }
                // Indicates the success of this synchronous custom validator
                return true;
            }),
        ]
    ],
    EditProduct
)
/**
 * @swagger
 * /Api/Product/DeleteProduct:
 *  delete: 
 *      summary: Delete the product 
 *      tags:
 *      - Product
 *      responses:
 *          '200':
 *              description: Product is successfully deleted
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
ProductRouter.delete(
    '/DeleteProduct',
    [
        UserAuth,
        [
            check('productId', 'Product id is required').not().isEmpty(),
        ]
    ],
    DeleteProduct
)