const jwt = require('jsonwebtoken')
const secretKey = "OSlash"
const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization', 'Bearer Token')

        if (!token) {
            return res.status(403).send({ status: false, message: `Missing authentication token in request` })
        }

        let T = token.split(' ')
        //console.log(T)
        let timeOut = jwt.decode(T[1])


        if (!timeOut) {
            return res.status(403).send({ status: false, message: `Invalid authentication token in request ` })
        }

        if (Date.now() > (timeOut.exp) * 1000) {
            return res.status(404).send({ status: false, message: `Session Expired, please login again` })
        }
        const verify = jwt.verify(T[1], secretKey)
        
        if (!verify) {
            return res.status(403).send({ status: false, message: `Invalid authentication token in request ` })
        }
       
           req.userId = timeOut.userId
           next()

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    userAuth
}