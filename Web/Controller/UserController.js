import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'

import { UserRepository } from '../../Repository/UserRepository.js'

export const Register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { fullName, phone, location, email, password, fcmToken } = req.body

    try {
        let emailExists = await UserRepository.GetUserByEmail(email)
        let phoneExists = await UserRepository.GetUserByPhone(phone)
        if (emailExists && phoneExists)
            return res.status(400).json({ errors: [{ msg: "User with the same email & phone already exists" }] })
        if (emailExists)
            return res.status(400).json({ errors: [{ msg: "User with the same email already exists" }] })
        if (phoneExists)
            return res.status(400).json({ errors: [{ msg: "User with the same phone already exists" }] })
        let userModel
        if (userModel)
            return res.status(400).json({ errors: [{ msg: "User with the same phone already exists" }] })
        userModel = await UserRepository.Register(fullName, phone, location, email, password, fcmToken)
        const token = await UserRepository.GenerateToken(userModel.id, userModel.role.roleName, fcmToken)
        return res.json({ token, userModel })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message) // ! dont send error.message as it will give hint to user & he can penetrate
    }                                               // ! But its required to tell front-end dev whats the problem
}
export const Login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { email, password, fcmToken } = req.body

    try {
        let userModel = await UserRepository.Login(email, password, fcmToken)
        if (!userModel)
            return res.status(400).json({ errors: [{ msg: "Invalid Email or Password" }] })
        const token = await UserRepository.GenerateToken(userModel.id, userModel.role.roleName, fcmToken)
        return res.json({ token, userModel })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const Logout = async (req, res) => {
    console.log("REQ.USER")
    console.log(req.user)
    const { id, fcmToken } = req.user

    try {
        let result = await UserRepository.Logout(id, fcmToken)
        if (!result)
            return res.status(400).json('User session not found')
        return res.json('User session is successfully expired')
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}