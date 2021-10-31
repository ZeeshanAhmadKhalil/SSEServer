import { validationResult } from "express-validator"
import { CartRepository } from "../../Repository/CartRepository.js"
import { ProductRepository } from "../../Repository/ProductRepository.js"
import { WalletRepository } from "../../Repository/WalletRepository.js"

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
export const SearchProducts = async (req, res) => {
    const { skip, limit, searchQuery } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.SearchProducts(skip, limit, searchQuery, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetSellingProducts = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetSellingProducts(skip, limit, id)
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
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetExchangeProducts(skip, limit, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetMyWishlist = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetMyWishlist(skip, limit, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetMyProducts = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetMyProducts(skip, limit, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the product')
        return res.send(product)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetMostlyLikedProducts = async (req, res) => { // * first five
    try {
        let product = await ProductRepository.GetMostlyLikedProducts()
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
        let result1 = await ProductRepository.CheckIfProductBelongsToUser(productId, id)
        if (result1)
            return res.status(401).send("You can not add your own product in the wishlist")
        let result = await ProductRepository.LikeProduct(productId, id)
        if (result == 0)
            return res.status(500).send('Internal Server Error while liking the product')
        if (result == 1)
            return res.send("Product is added to your wishlist")
        if (result == -1)
            return res.send("Product is removed from your wishlist")
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const OrderProducts = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { isPaymentByHand, deliveryAddress } = req.body
    const { id, fcmToken } = req.user

    try {
        let unavailibleProducts = await ProductRepository.CheckIfCartProductsAreAvailible(id)
        if (unavailibleProducts.length != 0)
            return res.status(400).send(unavailibleProducts) //* some products are not availible
        let totalAmount = await CartRepository.TotalOfAllCartProcucts(id)
        if (totalAmount == 0)
            return res.status(400).send("There are no products in your cart")
        let balance = await WalletRepository.GetBalance(id)
        if (totalAmount > balance)
            return res.status(400).send("You have insufficient balance")
        if (!isPaymentByHand) {
            let result = await WalletRepository.AddOrderTransactions(id)
            if (!result)
                return res.status(500).send("Error while adding transaction and updating wallet")
        }
        let result = await ProductRepository.OrderProducts(id, isPaymentByHand, deliveryAddress)
        if (!result)
            return res.status(500).send("Error while ordering the product")
        return res.send("Your order is sucessfully placed")

    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const ChangeOrderStatus = async (req, res) => {
    const { orderId, status } = req.body
    const { id, fcmToken } = req.user
    try {
        let result = await ProductRepository.CheckIfOrderBelongsToUser(id, orderId)
        if (!result)
            return res.status(400).send('Order not found in your orders!')
        let depositRequestStatus = await ProductRepository.GeOrderStatus(orderId)
        if (depositRequestStatus != "Delivering")
            return res.status(400).send('You already changed the status!')
        let order = await ProductRepository.ChangeOrderStatus(orderId, status)
        if (!order)
            return res.status(500).send('Internal Server Error while changing status')
        return res.send(`Order is marked as ${status} successfully!`)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}