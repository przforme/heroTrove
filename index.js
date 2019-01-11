var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var mainRouter = require('./routes/mainRouter');
var heroRouter = require('./routes/heroRouter');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var upload = multer();

var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'haggleblauz:schmosslus',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

require('./dbinfo.js');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(upload.array());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/', mainRouter);
app.use('/heroes', heroRouter);

// app.get('/', function (req, res) {
//     sess = req.session;
//     if (sess.user) {
//         var chars;
//         var query = userModel.where({
//             email: 'leo@sigillum.cc'
//         });
//         query.findOne(function (err, email) {
//             if (err) return console.log(err);
//             if (email) {
//                 charModel.find({
//                     owner: email['_id']
//                 }, function (err, arr) {
//                     if (err) return console.log(err);
//                     chars = arr;
//                 });
//                 console.log(chars);
//             }
//         });
//         res.render('layout', {
//             logged: sess.user,
//             posts: chars
//         });
//     } else
//         res.render('layout');
// });

// app.post('/logout', function (req, res) {
//     req.session.destroy(function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render('/');
//         }
//     })
//     res.render('layout', {
//         message: "Logged out succesfully!",
//         type: "success"
//     });
// })


// app.post('/login', function (req, res) {
//     sess = req.session;
//     userModel.findOne({
//         email: req.body.email
//     }, function (err, User) {
//         if (err) {
//             res.render('index', {
//                 message: "Wrong email OR password!",
//                 type: "error"
//             });
//         } else {
//             bcrypt.compare(req.body.password, User.password, function (err, isMatch) {
//                 if (err) {
//                     res.render('index', {
//                         message: "Wrong email OR password!",
//                         type: "error"
//                     });
//                 } else {
//                     if (isMatch) {
//                         sess.user = req.body.email;
//                         res.render('index', {
//                             message: "Logged in: ",
//                             type: "success",
//                             name: req.body.email,
//                             logged: sess.user
//                         });
//                     } else {
//                         res.render('index', {
//                             message: "Wrong email OR password!",
//                             type: "error"
//                         });
//                     }
//                 }
//             })
//         }
//     })
// });

app.all('*', function (req, res) {
    res.send('Sorry, this is an invalid URL.');
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})