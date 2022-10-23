const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const bodyParser = require('body-parser');


userRouter.get('/', userController.userGetHandler);
userRouter.post('/', userController.userPostHandler);
userRouter.put('/', userController.userPutHandler);
userRouter.delete('/', userController.userDeleteHandler);


module.exports = userRouter
