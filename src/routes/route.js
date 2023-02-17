const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const { addMessage, getMessages }  =  require('../controllers/chatController')
const middleWare = require('../middleware/auth')


router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)
router.delete('/userDelete/:userId',middleWare.authenticate,userController.deleteUser)




router.all('/*', function (req, res) {
    res.status(400).send({ status: false, message: "Invalid HTTP request" });
})


module.exports = router