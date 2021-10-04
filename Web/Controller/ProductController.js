import { validationResult } from "express-validator"
import { ProductRepository } from "../../Repository/ProductRepository.js"

export const AddProduct = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images } = req.body
    const { id, fcmToken } = req.user

    try {
        let product = await ProductRepository.AddProduct(productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images, id)
        if (!product)
            return res.status(500).send('Internal Server Error while adding the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetProductById = async (req, res) => {
    const { productId } = req.query
    const { id, fcmToken } = req.user

    try {
        let product = await ProductRepository.GetProductById(productId)
        let isLiked = await ProductRepository.CheckIfProductIsLikedByUser(productId, id)
        let quantityInCart = await ProductRepository.QuantityAddedToCard(productId, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send({ product, isLiked, quantityInCart })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetSellingProducts = async (req, res) => {
    const { skip, limit } = req.query
    try {
        let product = await ProductRepository.GetSellingProducts(skip, limit)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetExchangeProducts = async (req, res) => {
    const { skip, limit } = req.query
    try {
        let product = await ProductRepository.GetExchangeProducts(skip, limit)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const EditProduct = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productId, productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images } = req.body
    const { id, fcmToken } = req.user

    try {
        let result = await ProductRepository.CheckIfProductBelongsToUser(productId, id)
        if (!result)
            return res.status(401).send("You are not authorized to edit this product")
        let product = await ProductRepository.EditProduct(productId, productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images)
        if (!product)
            return res.status(500).send('Internal Server Error while editing the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const DeleteProduct = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productId } = req.body
    const { id, fcmToken } = req.user

    try {
        let result = await ProductRepository.CheckIfProductBelongsToUser(productId, id)
        if (!result)
            return res.status(401).send("You are not authorized to delete this product")
        let product = await ProductRepository.DeleteProduct(productId)
        if (!product)
            return res.status(500).send('Internal Server Error while deleting the product')
        return res.send("Product is successfully deleted")
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const LikeProduct = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { productId } = req.body
    const { id, fcmToken } = req.user

    try {
        let wishlist = await ProductRepository.LikeProduct(productId, id)
        if (!wishlist)
            return res.status(500).send('Internal Server Error while liking the product')
        return res.send("Product is added to your wishlist")
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}