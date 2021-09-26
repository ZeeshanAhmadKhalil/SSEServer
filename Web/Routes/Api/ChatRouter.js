import express from 'express'

import { } from '../../Controller/ChatController.js'
import { UserAuth } from '../../Middleware/UserAuth.js'

export const ChatRouter = express.Router()

// * @route   GET Api/Chat
// * @desc    Chat Router
// * @access  Public
ChatRouter.get('/', (req, res) => res.send('Chat Router'))