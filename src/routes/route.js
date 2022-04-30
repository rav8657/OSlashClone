const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const shortLinkController = require('../controllers/shortLinkController')


const MW = require('../middlewares/authMiddleware')


router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/createShortLink',MW.userAuth, shortLinkController.createShortLink)

router.get('/:urlCode', shortLinkController.getUrl) 


module.exports = router;