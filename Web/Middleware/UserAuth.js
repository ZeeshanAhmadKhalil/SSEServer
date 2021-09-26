import jwt from 'jsonwebtoken'
import config from 'config'

export const UserAuth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token)
        return res.status(410).json({ msg: "You are not authorized to access this feature" })
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user
        next()
    } catch (error) {
        return res.status(410).json({ msg: "An unauthorized access is detected" })
    }
}