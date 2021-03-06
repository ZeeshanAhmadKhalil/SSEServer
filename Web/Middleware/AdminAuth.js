import jwt from 'jsonwebtoken'
import config from 'config'

export const AdminAuth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token)
        return res.status(410).json({ msg: "You are not authorized to access this feature" })
    try {
        const decoded = jwt.verify(
            token,
            "myTokenSecretKey"
            // config.get('jwtSecret') //!error not working
        )
        if (decoded.user.roleName != "Admin")
            return res.status(410).json({ msg: "Only Admins are authorized to access this feature" })
        req.user = decoded.user
        next()
    } catch (error) {
        console.error("ERROR")
        console.error(error)
        return res.status(410).json({ msg: error.message })
    }
}