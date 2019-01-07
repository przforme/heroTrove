var express = require('express');
var router = express.Router();
var User = require('./db_connection.js');
var bcrypt = require('bcrypt');

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(upload.array()); 

var BCRYPT_SALT_ROUNDS = 12;


router.post('/', function (req, res) {
    var userInfo = req.body; //Get the parsed information
    
    bcrypt.hash(userInfo.password, BCRYPT_SALT_ROUNDS, function(err, hash){
        if(err) {
            return res.status(500).json({
                error: err
             });
        }
        else {
            var newUser = new User({
                name: "user",
                email: userInfo.email,
                password: hash
            });
            newUser.save(function(err, User){
                if(err)
                    res.render('index', {message: "Sorry, you've provided wrong info: " + err, type: "error"});
                else
                    res.render('index', {
                        message: "New user added", type: "success", name: userInfo.email});
                });
        }
    });
});

module.exports = router;