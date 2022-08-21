const express = require('express');
const itemRouter = express.Router();
const itemController = require("../controllers/itemController");
itemRouter.get('/', itemController.getAllItem)

module.exports = itemRouter
