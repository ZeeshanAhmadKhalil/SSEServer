import { validationResult } from "express-validator"
import { AdminRepository } from "../../Repository/AdminRepository.js"

export const GetDepositRequests = async (req, res) => {
    const { skip, limit } = req.query
    const { id, fcmToken } = req.user
    try {
        let depositRequests = await AdminRepository.GetDepositRequests(skip, limit, id)
        if (!depositRequests)
            return res.status(500).send('Internal Server Error while getting the deposit requests')
        return res.send(depositRequests)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
export const ChangeDepositRequestStatus = async (req, res) => {
    const { depositRequestId, status } = req.body
    try {
        let depositRequestStatus = await AdminRepository.GetDepositRequestStatus(depositRequestId)
        if (depositRequestStatus != "Pending")
            return res.status(400).send('You already changed the status!')
        let result = await AdminRepository.ChangeDepositRequestStatus(depositRequestId, status)
        if (!result)
            return res.status(500).send('Internal Server Error while changing status')
        return res.send(`Deposit requist is ${status} successfully!`)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send(error.message)
    }
}
