import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

import { UserModel } from "../Model/UserModal.js"
import { RoleModel } from '../Model/RoleModel.js'
import { ProductModel } from '../Model/ProductModel.js'
import { CartModel } from '../Model/CartModel.js'


export const CartRepository = {
    CheckIfForExchangeProduct: async (productId) => {
        var model = await ProductModel.findOne({ _id: productId }).select('forExchange -_id')
        return model.forExchange
    },
    AddProductToCart: async (productId, id) => {
        let cart
        let model = await CartModel.findOne({ user: id, product: productId }).select()
        if (model) {
            model.quantity = model.quantity + 1
            cart = await model.save()
        } else {
            let user = await UserModel.findById(id).select()
            let product = await ProductModel.findById(productId).select()
            let cartModel = new CartModel({
                product,
                user,
                quantity: 1,
            })
            cart = await cartModel.save()
        }
        return cart
    },
}