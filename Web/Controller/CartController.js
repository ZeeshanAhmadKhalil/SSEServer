import { validationResult } from "express-validator"

import { CartRepository } from "../../Repository/CartRepository.js"
import { ProductRepository } from "../../Repository/ProductRepository.js"

export const AddProductToCart = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productId } = req.body
    const { id, fcmToken } = req.user

    try {
        let result = await CartRepository.CheckIfForExchangeProduct(productId)
        if (result)
            return res.status(400).send('This feature is only availible for selling products')
        let result1 = await ProductRepository.CheckIfProductBelongsToUser(productId, id)
        if (result1)
            return res.status(401).send("You can not add your own product in the cart")
        let cart = await CartRepository.AddProductToCart(productId, id)
        if (!cart)
            return res.status(400).send('No more items availible')
        return res.send(cart)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const RemoveProductFromCart = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productId } = req.body
    const { id, fcmToken } = req.user

    try {
        let result = await CartRepository.CheckIfForExchangeProduct(productId)
        if (result)
            return res.status(400).send('This feature is only availible for selling products')
        let cart = await CartRepository.RemoveProductFromCart(productId, id)
        if (cart == 0)
            return res.status(200).send('Product not found in the cart')
        if (cart == 1)
            return res.status(200).send('Product is removed from the cart')
        return res.send(cart)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetMyCart = async (req, res) => {
    const { id, fcmToken } = req.user
    try {
        let product = await CartRepository.GetMyCart(id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the cart')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const TotalProductsInCart = async (req, res) => {
    const { id, fcmToken } = req.user
    try {
        let productCount = await CartRepository.TotalProductsInCart(id)
        if (!productCount)
            return res.status(500).send('Internal Server Error while getting total products')
        return res.send(productCount.toString())
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const TotalOfAllCartProcucts = async (req, res) => {
    const { id, fcmToken } = req.user
    try {
        let productsTotal = await CartRepository.TotalOfAllCartProcucts(id)
        if (!productsTotal)
            return res.status(500).send('Internal Server Error while getting total of products in the cart')
        return res.send(productsTotal.toString())
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}