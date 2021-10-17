import { validationResult } from "express-validator"

import { CartRepository } from "../../Repository/CartRepository.js"

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
        let cart = await CartRepository.AddProductToCart(productId, id)
        if (!cart)
            return res.status(400).send('You already added all quantity in the cart')
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