import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

import { UserModel } from "../Model/UserModal.js"
import { RoleModel } from '../Model/RoleModel.js'


export const UserRepository = {
    GetUserByEmail: async (email) => {
        return UserModel.findOne({ email })
    },
    GetUserByPhone: async (phone) => {
        return UserModel.findOne({ phone })
    },
    Register: async (fullName, phone, location, email, password, fcmToken) => {
        const profilePic = gravatar.url(email, {
            s: '200',
            r: 'pg',  // ! to avoid naked images
            d: 'mm',
        })
        const roleName = "User"
        let role = await RoleModel.findOne({ roleName }).select('-users')
        let userModel = new UserModel({
            fullName,
            phone,
            location,
            email,
            password,
            profilePic,
            fcmTokens: [fcmToken],
            role,
        })
        const salt = await bcrypt.genSalt(10)
        userModel.password = await bcrypt.hash(password, salt)
        await userModel.save()
        return userModel
    },
    Login: async (email, password, fcmToken) => {
        let userModel = await UserModel.findOne({ email }).select()
        if (!userModel)
            return null
        const isMatch = await bcrypt.compare(password, userModel.password)
        console.log(isMatch)
        if (!isMatch)
            return null
        if (!userModel.fcmTokens.includes(fcmToken))
            userModel.fcmTokens.push(fcmToken)
        userModel.save()
        return userModel
    },
    Logout: async (id, fcmToken) => {
        let result = await UserModel.updateOne({ $and: [{ id }, { fcmTokens: fcmToken }] }, { $pullAll: { fcmTokens: [fcmToken] } }) // * will find and update user
        console.log("RESULT")
        console.log(result)
        if (result.modifiedCount == 0)
            return false
        return true
    },
    GenerateToken: async (id, fcmToken) => {
        const payload = {
            user: {
                id,
                fcmToken
            }
        }
        let token = await jwt.sign(
            payload,
            // config.get('jwtSecret'),
            "myTokenSecretKey",
            { expiresIn: 3600000 } // ! use 3600 in production
        )
        return token
    }
}