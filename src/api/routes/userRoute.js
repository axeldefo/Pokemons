const { authenticateToken } = require("../../loaders/authMiddleware");
const  userController  = require("../Controllers/userController")
var express = require('express');
var router = express.Router();

router.get('/', authenticateToken, userController.getAll);

module.exports = router;