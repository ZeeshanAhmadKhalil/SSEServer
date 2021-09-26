import mongoose from "mongoose"

const CitySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true,
    },
    // products: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product'
    // }],
})

export const CityModel = mongoose.model('City', CitySchema)