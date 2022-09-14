const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboardController');
const bodyParser = require('body-parser');


dashboardRouter.get('/', dashboardController.dashboardGetHandler);
dashboardRouter.post('/', dashboardController.testPostHandler);


module.exports = dashboardRouter
