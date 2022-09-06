const express = require('express');
const loanRouter = express.Router()
const loanController = require('../controllers/loanController');
const bodyParser = require('body-parser');


loanRouter.get('/', loanController.loanGetHandler)

loanRouter.post('/', loanController.loanPostHandler)

loanRouter.put('/', loanController.loanPutHandler)

loanRouter.delete('/', loanController.loanDeleteHandler)

module.exports = loanRouter
