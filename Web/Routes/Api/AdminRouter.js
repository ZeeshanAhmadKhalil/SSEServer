import express from 'express'
import { check } from 'express-validator'

import { ChangeDepositRequestStatus, GetDepositRequests } from '../../Controller/AdminController.js'
import { AdminAuth } from '../../Middleware/AdminAuth.js'

export const AdminRouter = express.Router()

/**
 * @swagger
 * /Api/Admin/ChangeDepositRequestStatus:
 *  patch: 
 *      summary: Change Deposit Request Status
 *      tags:
 *      - Admin
 *      responses:
 *          '200':
 *              description: Deposit Request Status is successfully changed
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
 *                          depositRequestId:
 *                              type: string
 *                          status:
 *                              type: string
 */
AdminRouter.patch(
    '/ChangeDepositRequestStatus',
    [
        AdminAuth,
        [
            check('depositRequestId', 'depositRequestId is required').not().isEmpty(),
            check('status', 'status is required').not().isEmpty(),
        ]
    ],
    ChangeDepositRequestStatus
)
/**
 * @swagger
 * /Api/Admin/GetDepositRequests:
 *  get: 
 *      summary: Get deposit requests 
 *      tags:
 *      - Admin
 *      responses:
 *          '200':
 *              description: Deposit requests are successfully fetched
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
AdminRouter.get(
    '/GetDepositRequests',
    AdminAuth,
    GetDepositRequests
)