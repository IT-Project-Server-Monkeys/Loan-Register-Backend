const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');


userRouter.get('/', userController.getAllUser)
userRouter.get('/:id', userController.getSpecificUser)

module.exports = userRouter
