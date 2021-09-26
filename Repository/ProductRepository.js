import { CategoryModel } from "../Model/CategoryModel.js";
import { CityModel } from "../Model/CityModel.js";
import { ConditionModel } from "../Model/ConditionModel.js"
import { MediaModel } from "../Model/MediaModel.js";
import { ProductModel } from "../Model/ProductModel.js";
import { UserModel } from "../Model/UserModal.js";


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
}