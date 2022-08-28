const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');


userRouter.get('/', userController.userHandler);


module.exports = userRouter
