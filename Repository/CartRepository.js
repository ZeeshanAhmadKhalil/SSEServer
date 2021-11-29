import mongoose from "mongoose";
import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

import { UserModel } from "../Model/UserModal.js"
import { RoleModel } from '../Model/RoleModel.js'
import { ProductModel } from '../Model/ProductModel.js'
import { CartModel } from '../Model/CartModel.js'


export const CartRepository = { //todo: dont add product in cart if its your own product
    CheckIfForExchangeProduct: async (productId) => {
        var model = await ProductModel.findOne({ _id: productId }).select('forExchange -_id')
        return model.forExchange
    },
    AddProductToCart: async (productId, id) => {
        let cart
        let model = await CartModel.findOne({ user: id, product: productId }).select()
        if (model) {
            let product = await ProductModel.findById(productId).select()
            if (product.quantity <= model.quantity)
                return false
            model.quantity = model.quantity + 1
            cart = await model.save()
        } else {
            let user = await UserModel.findById(id).select()
            let product = await ProductModel.findById(productId).select()
            if (product.quantity == 0)
                return false
            let cartModel = new CartModel({
                product,
                user,
                quantity: 1,
            })
            cart = await cartModel.save()
        }
        return cart
    },
    RemoveProductFromCart: async (productId, id) => {
        let cart
        let isDeleted = await CartModel.findOneAndRemove({ user: id, product: productId, quantity: 1 })
        if (isDeleted)
            return 1
        let model = await CartModel.findOne({ user: id, product: productId }).select()
        if (!model)
            return 0
        model.quantity = model.quantity - 1
        cart = await model.save()
        return cart
    },
    GetMyCart: async (id) => {
        return await CartModel.find({ user: mongoose.Types.ObjectId(id) })
            .populate({ // * deep populate
                path: 'product',
                populate: {
                    path: 'media'
                }
            })
            .select()
    },
    TotalProductsInCart: async (id) => {
        return await CartModel.count({ user: mongoose.Types.ObjectId(id) })
    },
    TotalOfAllCartProcucts: async (id) => {
        let models = await CartModel.find({ user: mongoose.Types.ObjectId(id) }).populate('product').select()
        let productsTotal = 0
        models.forEach(element => {
            productsTotal = productsTotal + element.product.price * element.quantity
        })
        return productsTotal
    },
}