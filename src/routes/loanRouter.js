const express = require('express');
const loanRouter = express.Router();
const loanController = require('../controllers/loanController');


loanRouter.get('/', loanController.loanHandler)

module.exports = loanRouter
