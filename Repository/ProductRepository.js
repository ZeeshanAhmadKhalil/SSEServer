import { CartModel } from "../Model/CartModel.js";
import { CategoryModel } from "../Model/CategoryModel.js";
import { CityModel } from "../Model/CityModel.js";
import { ConditionModel } from "../Model/ConditionModel.js"
import { MediaModel } from "../Model/MediaModel.js";
import { ProductModel } from "../Model/ProductModel.js";
import { UserModel } from "../Model/UserModal.js";
import { WishlistModel } from "../Model/WishlistModel.js";


export const ProductRepository = {
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
        })
        let product = await productModel.save()
        return product
    },
    GetProductById: async (productId) => {
        return await ProductModel.findById(productId).populate('category').populate('city').populate('condition').populate('user').exec()
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
    GetSellingProducts: async (skip, limit) => {
        // let model = ProductModel.aggregate.lookup({ from: 'wishlist', localField: '_id', foreignField: 'student', as: 'wishlist' })
        // let model = ProductModel.find({ forExchange: false }).select('productName price description')
        let model = await ProductModel
            // .find({ forExchange: false })
            .aggregate([  // TODO : check if works fine after like/unlike & cart API is implemented
                {
                    $lookup: {
                        from: "wishlist", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked"
                    },
                },
                {
                    $lookup: {
                        from: "cart", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },//! there is no user match filter
                { $match: { forExchange: false } }, // TODO : test this when there are multiple product entries
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
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked.length != 0 ? true : false
            modelTemp[key].quantityInCart = item.quantityInCart.length
        })
        return modelTemp
    },
    GetExchangeProducts: async (skip, limit) => {
        // let model = ProductModel.aggregate.lookup({ from: 'wishlist', localField: '_id', foreignField: 'student', as: 'wishlist' })
        // let model = ProductModel.find({ forExchange: false }).select('productName price description')
        let model = await ProductModel
            // .find({ forExchange: false })
            .aggregate([  // TODO : check if works fine after like/unlike & cart API is implemented
                {
                    $lookup: {
                        from: "wishlist", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "isLiked"
                    },
                },
                {
                    $lookup: {
                        from: "cart", // * collection name in db
                        localField: "_id",
                        foreignField: "product",
                        as: "quantityInCart"
                    }
                },//! there is no user match filter
                { $match: { forExchange: true } }, // TODO : test this when there are multiple product entries
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
                { "$limit": limit == undefined ? 1000000 : parseInt(skip + limit) },
                { "$skip": skip == undefined ? 0 : parseInt(skip) },
            ]).exec()
        let modelTemp = model
        model.map((item, key) => {
            modelTemp[key].isLiked = item.isLiked.length != 0 ? true : false
            modelTemp[key].quantityInCart = item.quantityInCart.length
        })
        return modelTemp
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
        let user = await UserModel.findOne({ _id: id }).select()
        let product = await ProductModel.findOne({ _id: productId }).select()
        let wishlistModel = new WishlistModel({
            product,
            user,
        })
        let wishlist = await wishlistModel.save()
        return wishlist
    }
}