const express = require('express');
const bodyParser = require('body-parser');

const itemRouter = express.Router();
const itemController = require("../controllers/itemController");
itemRouter.get('/', itemController.itemHandler);

module.exports = itemRouter
