import mongoose from "mongoose";
import recombee from "recombee-api-client";
import { CartModel } from "../Model/CartModel.js";
import { CategoryModel } from "../Model/CategoryModel.js";
import { CityModel } from "../Model/CityModel.js";
import { ConditionModel } from "../Model/ConditionModel.js"
import { ExchangeModel } from "../Model/ExchangeModel,.js";
import { MediaModel } from "../Model/MediaModel.js";
import { OrderModel } from "../Model/OrderModel.js";
import { OrderProductModel } from "../Model/OrderProductModel.js";
import { OrderStatusModel } from "../Model/OrderStatusModel.js";
import { ProductModel } from "../Model/ProductModel.js";
import { TransactionModel } from "../Model/TransactionModel.js";
import { UserModel } from "../Model/UserModal.js";
import { WalletModel } from "../Model/WalletModel.js";
import { WishlistModel } from "../Model/WishlistModel.js";

var rqs = recombee.requests;

export const ProductRepository = { //todo: acending order by created on while fetching the products.
    AddProduct: async (productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images, id) => {
        let condition = await ConditionModel.findOne({ _id: conditionId }).select()
        if (!condition)
            return null;
        let city = await CityModel.findOne({ _id: cityId }).select()
        if (!city)
            return null;
        let category = await CategoryModel.findOne({ _id: categoryId }).select()
        if (!category)
            return null;
        let user = await UserModel.findOne({ _id: id }).select()
        if (!user)
            return null
        let mediaModel = []
        images.map((item, key) => {
            mediaModel.push({ path: item })
        })
        let media = await MediaModel.insertMany(mediaModel)
        let productModel = new ProductModel({
            productName,
            price,
            quantity,
            forExchange,
            description,
            category,
            city,
            condition,
            user,
            media,
            createdOn: Date.now(),
        })
        let product = await productModel.save()
        return product
    },
    GetProductById: async (productId) => {
        return await ProductModel.findById(productId).populate('category city condition user media').exec()
    },
    GetOrderById: async (orderId) => {
        return await OrderProductModel.find({ order: mongoose.Types.ObjectId(orderId) })
            .populate('product order')
            .populate({ // * deep populate
                path: 'product',
                populate: {
                    path: 'media'
                }
            }).exec()
    },
    EditProduct: async (productId, productName, price, quantity, forExchange, description, categoryId, cityId, conditionId, images) => {
        let model = await ProductModel.findOne({ _id: productId }).select()
        if (!model)
            return null

        let condition = await ConditionModel.findOne({ _id: conditionId }).select()
        if (!condition)
            return null;
        let city = await CityModel.findOne({ _id: cityId }).select()
        if (!city)
            return null;
        let category = await CategoryModel.findOne({ _id: categoryId }).select()
        if (!category)
            return null;
        let mediaModel = []
        images.map((item, key) => {
            mediaModel.push({ path: item })
        })
        let media = await MediaModel.insertMany(mediaModel)

        model.productName = productName
        model.price = price
        model.quantity = quantity
        model.forExchange = forExchange
        model.description = description
        model.category = category
        model.city = city
        model.condition = condition
        model.media = media

        let product = await model.save()
        return product
    },
    DeleteProduct: async (productId) => {
        let model = await ProductModel.findOne({ _id: productId }).select()
        if (!model)
            return null

        model.isDeleted = true
        await model.save()
        return true
    },
    CheckIfProductBelongsToUser: async (productId, id) => {
        let model = await ProductModel.findOne({ $and: [{ _id: productId }, { user: id }] }).select()
        if (!model)
            return false
        let product = await model.save()
        return product
    },
    SearchProducts: async (skip, limit, searchQuery, id) => {
        let searchRegex = new RegExp(searchQuery, "i")
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked",
                    },
                },
                {
                    $lookup: {
                        from: "carts", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },
                {
                    $lookup: {
                        from: "categories", // * collection name in db
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $addFields: {
                        "category": {
                            $arrayElemAt: ['$category', 0]
                        }
                    }
                },
                {
                    $addFields: {
                        "isLiked": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$isLiked',
                                        as: 'isLiked',
                                        cond: {
                                            $eq: ['$$isLiked.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "quantityInCart": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$quantityInCart',
                                        as: 'quantityInCart',
                                        cond: {
                                            $eq: ['$$quantityInCart.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $match: {
                        $or:
                            [
                                { productName: searchRegex },
                                { description: searchRegex },
                                { "category.categoryName": searchRegex },
                            ]
                    }
                },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "city": 0,
                        "condition": 0,
                        "__v": 0,
                    }
                },
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        model = await ProductModel.populate(model, { path: 'media' })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked != undefined ? true : false
            modelTemp[key].quantityInCart = item.quantityInCart != undefined ? item.quantityInCart.quantity : 0
        })
        return modelTemp
    },
    SearchProductsByKeywords: async (skip, limit, keywords, id) => {
        let keywordsSliced = keywords.slice(0, 4)
        let keywordsString = keywordsSliced.join('|')

        let searchRegex = new RegExp(keywordsString, "i")
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked",
                    },
                },
                {
                    $lookup: {
                        from: "carts", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },
                {
                    $lookup: {
                        from: "categories", // * collection name in db
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $addFields: {
                        "category": {
                            $arrayElemAt: ['$category', 0]
                        }
                    }
                },
                {
                    $addFields: {
                        "isLiked": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$isLiked',
                                        as: 'isLiked',
                                        cond: {
                                            $eq: ['$$isLiked.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "quantityInCart": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$quantityInCart',
                                        as: 'quantityInCart',
                                        cond: {
                                            $eq: ['$$quantityInCart.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $match: {
                        $or:
                            [
                                { productName: searchRegex },
                                { description: searchRegex },
                                { "category.categoryName": searchRegex },
                            ]
                    }
                },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "city": 0,
                        "condition": 0,
                        "__v": 0,
                    }
                },
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        model = await ProductModel.populate(model, { path: 'media' })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked != undefined ? true : false
            modelTemp[key].quantityInCart = item.quantityInCart != undefined ? item.quantityInCart.quantity : 0
        })
        return modelTemp
    },
    GetMyOrders: async (skip, limit, id) => {
        let model = await OrderModel.aggregate([
            { $match: { user: mongoose.Types.ObjectId(id) } }, //todo: do this for all $match for faster fetch
            {
                $lookup: {
                    from: 'orderproducts',
                    localField: '_id',
                    foreignField: 'order',
                    as: 'orderproducts'
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderproducts.product',
                    foreignField: '_id',
                    as: 'productDetails'
                },
            },
            {
                $lookup: {
                    from: 'media',
                    localField: 'productDetails.media',
                    foreignField: '_id',
                    as: 'media'
                },
            },
            {
                $addFields: {
                    "totalProducts": { $size: "$orderproducts" }
                },
            },
            // { //! $productDetails.price returning array, needed current index
            //     $addFields: {
            //         "totalAmount": { $sum: { $multiply: ["$productDetails.price", "$orderproducts.quantity"] } }
            //     },
            // },
            { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
            { "$skip": skip == undefined ? 0 : parseInt(skip) },
        ])
        // model = await OrderModel.populate(model, { path: 'productDetails', populate: { path: 'media' } })
        return model
    },
    GetProductsByCategory: async (categoryId, currentProductId, id) => {
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id", // todo: comment this if you want to uncomment pipeline
                        foreignField: "product",
                        as: "isLiked",
                    },
                },
                {
                    $lookup: {
                        from: "carts", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },
                {
                    $addFields: {
                        "isLiked": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$isLiked',
                                        as: 'isLiked',
                                        cond: {
                                            $eq: ['$$isLiked.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $match: {
                        $and: [
                            { category: mongoose.Types.ObjectId(categoryId) },
                            { _id: { $ne: mongoose.Types.ObjectId(currentProductId) } }
                        ]
                    }
                },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "category": 0,
                        "city": 0,
                        "condition": 0,
                        "__v": 0,
                    }
                },
                { "$limit": 5 },
                { "$skip": 0 },
            ]).exec()
        model = await ProductModel.populate(model, { path: 'media' })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked != undefined ? true : false
        })
        return modelTemp
    },
    GetSellingProducts: async (skip, limit, id) => {
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id", // todo: comment this if you want to uncomment pipeline
                        foreignField: "product",
                        as: "isLiked",
                        // let: {
                        //     'product': '$product'
                        // },
                        // pipeline: [
                        //     {
                        //         $match: {
                        //             $expr: {
                        //                 $and: [
                        //                     { $eq: ['$product', '$$product'] }, //! this line is't working
                        //                     { $eq: ['$user', mongoose.Types.ObjectId(id)] },
                        //                 ]
                        //             }
                        //         }
                        //     }
                        // ],
                    },
                },
                {
                    $lookup: {
                        from: "carts", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },
                {
                    $addFields: {
                        "isLiked": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$isLiked',
                                        as: 'isLiked',
                                        cond: {
                                            $eq: ['$$isLiked.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "quantityInCart": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$quantityInCart',
                                        as: 'quantityInCart',
                                        cond: {
                                            $eq: ['$$quantityInCart.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                { $match: { forExchange: false } },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "category": 0,
                        "city": 0,
                        "condition": 0,
                        "__v": 0,
                    }
                },
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        model = await ProductModel.populate(model, { path: 'media' })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked != undefined ? true : false
            modelTemp[key].quantityInCart = item.quantityInCart != undefined ? item.quantityInCart.quantity : 0
        })
        return modelTemp
    },
    GetExchangeProducts: async (skip, limit, id) => {
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked"
                    },
                },
                {
                    $addFields: {
                        "isLiked": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$isLiked',
                                        as: 'isLiked',
                                        cond: {
                                            $eq: ['$$isLiked.user', mongoose.Types.ObjectId(id)]
                                        }
                                    }
                                }, 0 // * arrayElemAt index 0
                            ]
                        }
                    }
                },
                { $match: { forExchange: true } },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "category": 0,
                        "city": 0,
                        "condition": 0,
                        "__v": 0,
                    }
                },
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        model = await ProductModel.populate(model, { path: 'media' })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked != undefined ? true : false
        })
        return modelTemp
    },
    GetMyWishlist: async (skip, limit, id) => {
        let model = await WishlistModel.aggregate([
            {
                $lookup: {
                    from: "carts", // * collection name in db
                    localField: "product",
                    foreignField: "product",
                    as: "quantityInCart"
                },
            },
            {
                $addFields: {
                    "quantityInCart": {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$quantityInCart',
                                    as: 'quantityInCart',
                                    cond: {
                                        $eq: ['$$quantityInCart.user', mongoose.Types.ObjectId(id)]
                                    }
                                }
                            }, 0 // * arrayElemAt index 0
                        ]
                    }
                }
            },
            { $match: { user: mongoose.Types.ObjectId(id) } },
            {
                $project: {
                    "user": 0,
                    "__v": 0,
                }
            },
            { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
            { "$skip": skip == undefined ? 0 : parseInt(skip) },
        ])
        model = await WishlistModel.populate(model, { path: 'product', populate: { path: 'media' } })
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].quantityInCart = item.quantityInCart != undefined ? item.quantityInCart.quantity : 0
        })
        return modelTemp
    },
    GetMyProducts: async (skip, limit, id) => {
        return await ProductModel.find({ user: mongoose.Types.ObjectId(id) }).populate('media').limit(limit == undefined ? 1000000 : parseInt(skip + limit)).skip(skip == undefined ? 0 : parseInt(skip)).select()
    },
    GetProductsToExchange: async (skip, limit, id, categoryId) => {
        return await ProductModel.find({ user: mongoose.Types.ObjectId(id), category: mongoose.Types.ObjectId(categoryId), forExchange: true })
            .populate('media')
            .limit(limit == undefined ? 1000000 : parseInt(skip + limit))
            .skip(skip == undefined ? 0 : parseInt(skip))
            .select()
    },
    GetPriceDifference: async (requestedProduct, requestingProduct) => {
        var model1 = await ProductModel.findById(requestedProduct).select()
        var model2 = await ProductModel.findById(requestingProduct).select()
        return model1.price - model2.price
    },
    ExchangeProducts: async (isPaymentByHand, deliveryAddress, requestedProduct, requestingProduct) => {
        let exchangeModel = new ExchangeModel({
            isPaymentByHand,
            deliveryAddress,
            isExchanged: false,
            requestingProduct,
            requestedProduct,
        })
        return await exchangeModel.save()
    },
    GetRequestedExchanges: async (id) => {
        let models = await ExchangeModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "requestingProduct",
                    foreignField: "_id",
                    as: "requestingProduct",
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "requestedProduct",
                    foreignField: "_id",
                    as: "requestedProduct",
                }
            },
            {
                $lookup: {
                    from: "media",
                    localField: "requestingProduct.media",
                    foreignField: "_id",
                    as: "requestingMedia",
                }
            },
            {
                $lookup: {
                    from: "media",
                    localField: "requestedProduct.media",
                    foreignField: "_id",
                    as: "requestedMedia",
                }
            },
            {
                $match: {
                    $and: [
                        { "requestedProduct.user": mongoose.Types.ObjectId(id) },
                        { isExchanged: false }
                    ]
                }
            },
        ]).exec()
        // model = await WishlistModel.populate(model, { path: 'product', populate: { path: 'media' } })
        models = await ExchangeModel.populate(models, { path: 'product', populate: { path: 'media' } })
        models = await ExchangeModel.populate(models, { path: 'product', populate: { path: 'media' } })
        return models
    },
    GetRequestingExchanges: async (id) => {
        let models = await ExchangeModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "requestingProduct",
                    foreignField: "_id",
                    as: "requestingProduct",
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "requestedProduct",
                    foreignField: "_id",
                    as: "requestedProduct",
                }
            },
            {
                $lookup: {
                    from: "media",
                    localField: "requestingProduct.media",
                    foreignField: "_id",
                    as: "requestingMedia",
                }
            },
            {
                $lookup: {
                    from: "media",
                    localField: "requestedProduct.media",
                    foreignField: "_id",
                    as: "requestedMedia",
                }
            },
            {
                $match: {
                    $and: [
                        { "requestingProduct.user": mongoose.Types.ObjectId(id) },
                        // { isExchanged: { $ne: null } }, //! created confusion
                        { isExchanged: false }
                    ]
                }
            },
        ]).exec()
        return models
    },
    CheckifAlreadingRequesting: async (requestingProduct) => {
        return await ExchangeModel.find({ requestingProduct: mongoose.Types.ObjectId(requestingProduct), isExchanged: false }).select()
    },
    GetMostlyLikedProducts: async () => {
        let model = await ProductModel
            .aggregate([
                {
                    $lookup: {
                        from: "wishlists", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked"
                    },
                },
                {
                    $addFields: {
                        "isLiked": { $size: '$isLiked' }
                    }
                },
                {
                    $project: {
                        "quantity": 0,
                        "forExchange": 0,
                        "isDeleted": 0,
                        "createdOn": 0,
                        "category": 0,
                        "city": 0,
                        "condition": 0,
                        "user": 0,
                        "__v": 0,
                    }
                },
                { $sort: { 'isLiked': -1 } },
                { "$limit": 5 },
                { "$skip": 0 },
            ]).exec()
        return await ProductModel.populate(model, { path: 'media' })
    },
    CheckIfProductIsLikedByUser: async (productId, id) => {
        let model = await WishlistModel.findOne({ product: productId, user: id }).select()
        if (!model)
            return false
        return true
    },
    QuantityAddedToCard: async (productId, id) => {
        let model = await CartModel.find({ product: productId, user: id }).select()
        if (model.length == 0)
            return 0
        return model.quantity
    },
    LikeProduct: async (productId, id) => {
        let result = await WishlistModel.findOneAndDelete({ user: id, product: productId })
        if (result)
            return -1
        let user = await UserModel.findOne({ _id: id }).select()
        let product = await ProductModel.findOne({ _id: productId }).select()
        let wishlistModel = new WishlistModel({
            product,
            user,
        })
        let wishlist = await wishlistModel.save()
        if (wishlist)
            return 1
        return 0
    },
    CheckIfCartProductsAreAvailible: async (id) => {
        let cartModel = await CartModel.find({ user: mongoose.Types.ObjectId(id) }).select()
        let unavailibleProducts = []
        for (const element of cartModel) {
            var product = await ProductModel.findById(element.product).select()
            if (product.quantity < element.quantity)
                unavailibleProducts.push(`${parseInt(element.quantity - product.quantity)} ${product.productName}`)
        }
        return unavailibleProducts
    },
    OrderProducts: async (id, isPaymentByHand, deliveryAddress) => {
        let cartModel = await CartModel.find({ user: mongoose.Types.ObjectId(id) }).select()
        if (cartModel.length == 0)
            return false
        let orderModel = new OrderModel({
            deliveryAddress,
            isPaymentByHand,
            createdOn: Date.now(),
            orderStatus: mongoose.Types.ObjectId("614f733793e00a99cca623b1"), //* Delivering order status
            user: mongoose.Types.ObjectId(id),
        })
        let order = await orderModel.save()
        for (const element of cartModel) {
            var productModel = await ProductModel.findById(element.product).select()
            if (!productModel)
                return false
            productModel.quantity = productModel.quantity - element.quantity
            var orderProductModel = new OrderProductModel({
                quantity: element.quantity,
                order: mongoose.Types.ObjectId(order._id),
                product: mongoose.Types.ObjectId(productModel._id)
            })
            orderProductModel.save()
            productModel.save()
        }
        await CartModel.deleteMany({ user: id })
        return true
    },
    CheckIfOrderBelongsToUser: async (id, orderId) => {
        let orderModel = await OrderModel.findById(orderId).select()
        if (!orderModel)
            return false
        if (orderModel.user != id)
            return false
        return true
    },
    GeOrderStatus: async (orderId) => {
        let orderModel = await OrderModel.findById(orderId).populate({ path: "orderStatus", model: OrderStatusModel }).select()
        return orderModel.orderStatus.orderStatus
    },
    ChangeOrderStatus: async (orderId, status) => {
        let orderModel = await OrderModel.findById(orderId).populate({ path: "orderStatus", model: OrderStatusModel }).select()
        if (!orderModel)
            return null
        let orderStatusModel = await OrderStatusModel.findOne({ orderStatus: status }).select()
        if (!orderStatusModel)
            return null
        orderModel.orderStatus = mongoose.Types.ObjectId(orderStatusModel._id)
        let order = await orderModel.save()
        return order;
    },
    GetExchangeById: async (exchangeId) => {
        return await ExchangeModel.findById(exchangeId).select()
    },
    MarkAsExchanged: async (exchangeId) => {
        let exchange = await ExchangeModel.findById(exchangeId).select()
        const { requestedProduct, requestingProduct } = exchange
        let requested = await ProductModel.findById(requestedProduct).select()
        let requesting = await ProductModel.findById(requestingProduct).select()
        let tempUser = requested.user
        requested.user = requesting.user
        requesting.user = tempUser
        exchange.isExchanged = true
        await requested.save()
        await requesting.save()
        await exchange.save()
        return true
    },
    ExpireAllExchanges: async (productId) => {
        let exchanges = await ExchangeModel.updateMany(
            {
                $and: [
                    {
                        $or: [
                            { requestingProduct: productId },
                            { requestedProduct: productId },
                        ]
                    },
                    {
                        $or: [
                            { isExchanged: false },
                        ]
                    },
                ]
            },
            { isExchanged: null }
        ).exec()
        return true
    },
    GetConditions: async () => {
        return await ConditionModel.find({}).select()
    },
    GetCategories: async () => {
        return await CategoryModel.find({}).select()
    },
    GetCities: async () => {
        return await CityModel.find({}).select()
    },
    GetRecommendedProducts: async (id) => {
        // let items = await ProductModel.find({}).select()
        // let itemIds = items.map(obj => obj._id.toString())
        // let users = await UserModel.find({}).select()
        // let userIds = users.map(obj => obj._id.toString())

        var client = new recombee.ApiClient('sse-dev', 'GIwHFvbXw24eWtdjIgrY4p6HgNfZMJLa1oCTdVGESyP9Gi16mf3A8FYOin6xjgtE');

        var likedProducts = [];

        let wishlist = await WishlistModel.find({}).select()
        wishlist.map(obj => likedProducts.push(new rqs.AddPurchase(obj.user.toString(), obj.product.toString(), { 'cascadeCreate': true })))

        // for (const userId of userIds) {
        //     var purchased = []
        //     for (const itemId of itemIds) {
        //         let counts = await WishlistModel.countDocuments({ user: mongoose.Types.ObjectId(userId), product: mongoose.Types.ObjectId(itemId) })
        //         if (counts > 0)
        //             purchased.push(itemId)
        //     }
        //     purchased.forEach((itemId) => {
        //         likedProducts.push(new rqs.AddPurchase(userId, itemId, { 'cascadeCreate': true }))
        //     });
        // }

        // const PROBABILITY_PURCHASED = 0.1;
        // userIds.forEach((userId) => {
        //     var purchased = itemIds.filter(() => Math.random() < PROBABILITY_PURCHASED);
        //     purchased.forEach((itemId) => {
        //         likedProducts.push(new rqs.AddPurchase(userId, itemId, { 'cascadeCreate': true }))
        //     });
        // });

        // Send the data to Recombee, use Batch for faster processing of larger data
        let result = await client.send(new rqs.Batch(likedProducts))
            .then(() => {
                //Get 10 recommended items for user with id
                return client.send(new rqs.RecommendItemsToUser(id, 10));
            })
        let productObjectIds = result.recomms.map(obj => mongoose.Types.ObjectId(obj.id))
        let products = await ProductModel.find({
            _id: {
                $in: productObjectIds
            }
        }).populate('media').select()

        return products
    },
}