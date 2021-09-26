import express from 'express'

import { } from '../../Controller/WalletController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const WalletRouter = express.Router()

// * @route   GET Api/Wallet
// * @desc    Wallet Router
// * @access  Public
WalletRouter.get('/', (req, res) => res.send('Wallet Router'))