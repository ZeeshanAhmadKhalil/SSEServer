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
export const GetOrderById = async (req, res) => {
    const { orderId } = req.query
    const { id, fcmToken } = req.user

    try {
        let orderDetail = await ProductRepository.GetOrderById(orderId)
        if (!orderDetail)
            return res.status(500).send('Internal Server Error while getting the order detail')
        return res.send(orderDetail)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetRecommendedProducts = async (req, res) => {
    const { id, fcmToken } = req.user

    try {
        let products = await ProductRepository.GetRecommendedProducts(id)
        if (!products)
            return res.status(500).send('Internal Server Error while getting the order detail')
        return res.send(products)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const SearchProductsByKeywords = async (req, res) => {
    const { skip, limit } = req.query
    const { keywords } = req.body
    const { id, fcmToken } = req.user
    try {
        let products = await ProductRepository.SearchProductsByKeywords(skip, limit, keywords, id)
        if (!products)
            return res.status(500).send('Internal Server Error while getting the products')
        return res.send(products)
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
export const GetProductsByCategory = async (req, res) => {
    const { categoryId, currentProductId } = req.query
    const { id, fcmToken } = req.user
    try {
        let products = await ProductRepository.GetProductsByCategory(categoryId, currentProductId, id)
        if (!products)
            return res.status(500).send('Internal Server Error while getting the products')
        return res.send(products)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetRequestingExchanges = async (req, res) => {
    const { } = req.query
    const { id, fcmToken } = req.user
    try {
        let exchanges = await ProductRepository.GetRequestingExchanges(id)
        if (!exchanges)
            return res.status(500).send('Internal Server Error while getting the exchanges')
        return res.send(exchanges)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetRequestedExchanges = async (req, res) => {
    const { } = req.query
    const { id, fcmToken } = req.user
    try {
        let exchanges = await ProductRepository.GetRequestedExchanges(id)
        if (!exchanges)
            return res.status(500).send('Internal Server Error while getting the exchanges')
        return res.send(exchanges)
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
export const GetMyOrders = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetMyOrders(skip, limit, id)
        if (!product)
            return res.status(500).send('Internal Server Error while getting the orders')
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
export const GetProductsToExchange = async (req, res) => {
    const { skip, limit, categoryId } = req.query
    const { id, fcmToken } = req.user
    try {
        let product = await ProductRepository.GetProductsToExchange(skip, limit, id, categoryId)
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
            return res.status(400).send({ errorMsg: "There are no products in your cart" })
        let balance = await WalletRepository.GetBalance(id)
        if (totalAmount > balance)
            return res.status(400).send({ errorMsg: "You have insufficient balance" })
        if (!isPaymentByHand) {
            let result = await WalletRepository.AddOrderTransactions(id)
            if (!result)
                return res.status(500).send("Error while adding transaction and updating wallet")
        }
        let result = await ProductRepository.OrderProducts(id, isPaymentByHand, deliveryAddress)
        if (!result)
            return res.status(500).send("Error while ordering the product")
        return res.send({ msg: "Your order is sucessfully placed" })

    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const ExchangeProducts = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { isPaymentByHand, deliveryAddress, requestedProduct, requestingProduct } = req.body
    const { id, fcmToken } = req.user

    try {
        let alreadyRequesting = await ProductRepository.CheckifAlreadingRequesting(requestingProduct)
        if (alreadyRequesting.length != 0)
            return res.status(400).send({ data: "Selected product is already a in an exchange!" })
        let amountDifference = await ProductRepository.GetPriceDifference(requestedProduct, requestingProduct)
        let balance = await WalletRepository.GetBalance(id)
        if (amountDifference > balance)
            return res.status(400).send({ data: "You have insufficient balance" })
        let result = await ProductRepository.ExchangeProducts(isPaymentByHand, deliveryAddress, requestedProduct, requestingProduct)
        if (!result)
            return res.status(500).send("Error while ordering the product")
        return res.send({ data: "Your product is succesfully added for exchange" })

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
export const MarkAsExchanged = async (req, res) => {
    const { exchangeId } = req.body
    const { id, fcmToken } = req.user
    try {
        let exchange = await ProductRepository.GetExchangeById(exchangeId)
        if (!exchange)
            return res.status(500).send({ data: 'Internal Server Error while getting exchange by id' })
        const { requestedProduct, requestingProduct, isPaymentByHand } = exchange

        if (!isPaymentByHand) {
            let amountDifference = await ProductRepository.GetPriceDifference(requestingProduct, requestedProduct)
            if (amountDifference > 0) {
                let balance = await WalletRepository.GetBalance(id)
                if (amountDifference > balance)
                    return res.status(400).send({ data: "You have insufficient balance" })
            } else {
                let requesting = await ProductRepository.GetProductById(requestingProduct)
                let requestingBalance = await WalletRepository.GetBalance(requesting.user)
                if (Math.abs(amountDifference) > requestingBalance)
                    return res.status(400).send({ data: "Requesting user has insufficient balance" })
            }
            let result = await WalletRepository.AddExchangeTransactions(amountDifference, requestedProduct, requestingProduct)
            if (!result)
                return res.status(500).send("Error while adding transaction and updating wallet")
        }
        await ProductRepository.ExpireAllExchanges(requestedProduct)
        await ProductRepository.ExpireAllExchanges(requestingProduct)
        let result = await ProductRepository.MarkAsExchanged(exchangeId)
        if (!result)
            return res.status(500).send({ data: 'Internal Server Error while marking as exchanged' })
        return res.send({ data: `Marked as exchanged successfully!` })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetConditions = async (req, res) => {
    try {
        let conditions = await ProductRepository.GetConditions()
        if (!conditions)
            return res.status(500).send('Internal Server Error while getting the conditions')
        return res.send(conditions)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetCategories = async (req, res) => {
    try {
        let categories = await ProductRepository.GetCategories()
        if (!categories)
            return res.status(500).send('Internal Server Error while getting the categories')
        return res.send(categories)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetCities = async (req, res) => {
    try {
        let cities = await ProductRepository.GetCities()
        if (!cities)
            return res.status(500).send('Internal Server Error while getting the cities')
        return res.send(cities)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}