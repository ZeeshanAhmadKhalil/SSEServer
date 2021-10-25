import express from 'express'
import { check } from 'express-validator'

import { DepositRequest, GetDepositRequests } from '../../Controller/WalletController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const WalletRouter = express.Router()

/**
 * @swagger
 * /Api/Product/DepositRequest:
 *  post: 
 *      summary: Make deposit request
 *      tags:
 *      - Wallet
 *      responses:
 *          '200':
 *              description: Deposot request is successfully added
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          bankName:
 *                              type: string
 *                          accountNumber:
 *                              type: string
 *                          accountTitle:
 *                              type: string
 *                          amount:
 *                              type: string
 *                          depositedOn:
 *                              type: string
 */
WalletRouter.post(
    '/DepositRequest',
    [
        UserAuth,
        [
            check('bankName', 'Bank name is required').not().isEmpty(),
            check('accountNumber', 'Account number is required').not().isEmpty(),
            check('accountTitle', 'Account title is required').not().isEmpty(),
            check('amount', 'Amount should be a number').isNumeric(),
            check('depositedOn', 'Deposit Date is required').not().isEmpty(),
        ]
    ],
    DepositRequest
)
/**
 * @swagger
 * /Api/Wallet/GetDepositRequests:
 *  get: 
 *      summary: Get deposit requests of current user
 *      tags:
 *      - Wallet
 *      responses:
 *          '200':
 *              description: Deposit requests of current user are successfully fetched
 *      parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 */
WalletRouter.get(
    '/GetDepositRequests',
    UserAuth,
    GetDepositRequests
)