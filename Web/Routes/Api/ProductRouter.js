import express from 'express'
import { check, body } from 'express-validator'

import { AddProduct, DeleteProduct, EditProduct, GetProductById } from '../../Controller/ProductController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const ProductRouter = express.Router()

// * @route   POST Api/Product/AddProduct
// * @desc    Add a Product
// * @access  Protected
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
// * @route   POST Api/Product/GetProductById
// * @desc    Get Product By Id
// * @access  Protected
ProductRouter.get(
    '/GetProductById',
    UserAuth,
    GetProductById
)
// * @route   POST Api/Product/EditProduct
// * @desc    Edit a Product
// * @access  Protected
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
// * @route   POST Api/Product/DeleteProduct
// * @desc    Edit a Product
// * @access  Protected
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