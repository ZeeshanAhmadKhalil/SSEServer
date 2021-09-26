import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    // products: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product'
    // }],
})

export const CategoryModel = mongoose.model('Category', CategorySchema)