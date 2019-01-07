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

router.post('/', function(req, res){
    // var loginAttempt = new User({
    //     name: "any",
    //     email: "",
    //     password: ""
    // })
    User.findOne({email: req.body.email}, function(err, User) {
        if(err) { 
            res.render('index', { message: "Wrong email OR password!", type: "error" });
            console.log("no such user");
        } else {
            bcrypt.compare(req.body.password, User.password, function(err, isMatch) {
                if (err) {
                    res.render('index', { message: "Wrong email OR password!", type: "error" });
                    console.log("no such password: " + req.body.password + " " + this.password);
                } else {
                    if(isMatch) {
                        res.render('index', { message: "Logged in: ", type: "success", name: req.body.email });
                    } else {
                        res.render('index', { message: "Wrong email OR password!", type: "error" });
                    }
                }
            })
        } 
    })
});

module.exports = router;