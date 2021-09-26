import mongoose from "mongoose"

const ConditionSchema = new mongoose.Schema({
    conditionName: {
        type: String,
        required: true,
    },
    // products: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Product'
    // }],
})

export const ConditionModel = mongoose.model('Condition', ConditionSchema)