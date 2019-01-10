var express = require('express');
var User = require('./user.js');
var bcrypt = require('bcrypt');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var upload = multer();

app.use(session({secret: "haggleblauz:schmosslus"}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.set('view engine', 'pug');
app.set('views', './views');

var BCRYPT_SALT_ROUNDS = 12;

var sess;

app.get('/', function (req, res) {
    sess = req.session;
    if(sess)
        res.render('index', { logged: sess.user });
    else
        res.render('index');
});

app.post('/logout', function (req, res){
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render('/');
        }
    })
    res.render('index', { message: "Logged out succesfully!", type: "success" });
})

app.post('/register', function (req, res) {
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
                        message: "New user added: ", type: "success", name: userInfo.email});
                });
        }
    });
});

app.post('/login', function(req, res){
    sess = req.session;
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
                        sess.user = req.body.email;
                        res.render('index', { message: "Logged in: ", type: "success", name: req.body.email, logged: sess.user });
                    } else {
                        res.render('index', { message: "Wrong email OR password!", type: "error" });
                    }
                }
            })
        } 
    })
});

app.all('*', function (req, res) {
    res.send('Sorry, this is an invalid URL.');
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})