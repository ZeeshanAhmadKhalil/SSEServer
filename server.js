import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { ConnectDB } from './Config/SSEContext.js'
import { AdminRouter } from './Web/Routes/Api/AdminRouter.js'

import { CartRouter } from './Web/Routes/Api/CartRouter.js'
import { ChatRouter } from './Web/Routes/Api/ChatRouter.js'
import { ProductRouter } from './Web/Routes/Api/ProductRouter.js'
import { UserRouter } from './Web/Routes/Api/UserRouter.js'
import { WalletRouter } from './Web/Routes/Api/WalletRouter.js'

const app = express()
const router = express.Router()

// * Swagger Configuration  
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SSE Server",
            version: "0.3.0",
            description: "Search, Scan & Exchange"
        },
        servers: [
            {
                url: "https://sseserver1.herokuapp.com"
            },
            {
                url: "http://localhost:6900"
            },
            // {
            //     url: "http://192.168.10.4:6900"
            // },
        ],
    },
    apis: ["./Web/Routes/Api/*.js"]
}
const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
// router.use('/api-docs', swaggerUI.serve);
// router.get('/api-docs', swaggerUI.setup(swaggerDocs));

// * Connect to DB
ConnectDB()

// * Init Middleware
app.use(express.json({ extended: false }))
app.get('/', (req, res) => {
    var hostname = req.headers.host;
    res.writeHead(302, {
        'Location': `/api-docs`
        //add other headers here...
    });
    res.end();
})

// * Define Routes

app.use('/Api/Cart', CartRouter)
app.use('/Api/Chat', ChatRouter)
app.use('/Api/Product', ProductRouter)
app.use('/Api/User', UserRouter)
app.use('/Api/Wallet', WalletRouter)
app.use('/Api/Admin', AdminRouter)

const PORT = process.env.PORT || 6900
app.listen(
    PORT,
    // `192.168.10.8`, //todo: home PTCL1
    // `192.168.10.6`, //todo: home PTCL2
    `192.168.10.4`, //todo: home PTCL3
    // `192.168.43.249`, //todo: home Zong4G 
    () => console.info(`Server is running on port ${PORT}`)
)