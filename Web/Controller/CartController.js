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
            return res.status(500).send('Internal Server Error while adding product in the cart')
        return res.send("Product is added in the cart")
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}