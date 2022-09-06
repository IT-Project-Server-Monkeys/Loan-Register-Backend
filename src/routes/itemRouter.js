const express = require('express');
const bodyParser = require('body-parser');

const itemRouter = express.Router();
const itemController = require("../controllers/itemController");
itemRouter.get('/', itemController.itemGetHandler);
itemRouter.post('/', itemController.itemPostHandler);
itemRouter.put('/', itemController.itemPutHandler);
itemRouter.delete('/', itemController.itemDeleteHandler);


module.exports = itemRouter
