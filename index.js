var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index');
});

var register = require('./register.js');
app.use('/register', register);

var login = require('./login.js');
app.use('/login', login);

app.all('*', function (req, res) {
    res.send('Sorry, this is an invalid URL.');
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})