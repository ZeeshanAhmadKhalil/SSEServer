import express from 'express'
import { ConnectDB } from './Config/SSEContext.js'

import { CartRouter } from './Web/Routes/Api/CartRouter.js'
import { ChatRouter } from './Web/Routes/Api/ChatRouter.js'
import { ProductRouter } from './Web/Routes/Api/ProductRouter.js'
import { UserRouter } from './Web/Routes/Api/UserRouter.js'
import { WalletRouter } from './Web/Routes/Api/WalletRouter.js'

const app = express()

// * Connect to DB
ConnectDB()

// * Init Middleware
app.use(express.json({ extended: false }))
app.get('/', (req, res) => res.send('Server is running'))

// * Define Routes
app.use('/Api/Cart', CartRouter)
app.use('/Api/Chat', ChatRouter)
app.use('/Api/Product', ProductRouter)
app.use('/Api/User', UserRouter)
app.use('/Api/Wallet', WalletRouter)

const PORT = process.env.PORT || 6900
app.listen(PORT, () => console.info(`Server is running on port ${PORT}`))