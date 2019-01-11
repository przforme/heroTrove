var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// GET home page.
router.get('/', function(req, res) {
  res.render('welcome');
});

router.post('/register', user_controller.user_register);

router.post('/login', user_controller.user_login);

module.exports = router;