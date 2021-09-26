import mongoose from "mongoose"

const RoleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
    },
    // users: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User'
    // }],
})

export const RoleModel = mongoose.model('Role', RoleSchema)