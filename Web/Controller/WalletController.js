import { validationResult } from "express-validator"
import { WalletRepository } from "../../Repository/WalletRepository.js"

export const DepositRequest = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { bankName, accountNumber, accountTitle, amount, depositedOn, } = req.body
    const { id, fcmToken } = req.user

    try {
        let depositRequest = await WalletRepository.DepositRequest(bankName, accountNumber, accountTitle, amount, depositedOn, id)
        if (!depositRequest)
            return res.status(500).send('Internal Server Error while adding the deposit request')
        return res.send(depositRequest)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const GetDepositRequests = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let depositRequests = await WalletRepository.GetDepositRequests(skip, limit, id)
        if (!depositRequests)
            return res.status(500).send('Internal Server Error while getting the deposit requests')
        return res.send(depositRequests)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}