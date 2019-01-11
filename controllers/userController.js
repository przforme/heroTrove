var async = require('async');
var bcrypt = require('bcrypt');
var request = require('request');
var session = require('express-session');
var secretKey = require('../captcha-secret');

var User = require('../models/userModel');
var Hero = require('../models/heroModel');
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

var BCRYPT_SALT_ROUNDS = 12;

// Display list of all Users.
exports.user_list = function (req, res) {
    res.send('NOT IMPLEMENTED: User list');
};

// Display detail page for a specific User.
exports.user_detail = function (req, res, next) {

    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback)
        },
        users_heroes: function (callback) {
            Hero.find({
                    'owner': req.params.id
                }, 'heroName heroDesc')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        } // Error in API usage.
        if (results.user == null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', {
            title: 'User Detail',
            user: results.user,
            user_heroes: results.users_heroes
        });
    });

};

// Handle User create on POST.
exports.user_register = [

    body('email').isLength({
        min: 5
    }).trim().withMessage('e-mail address must be specified.'),
    body('password').isLength({
        min: 10
    }).trim().withMessage('Password must be at least 10 characters long.'),
    sanitizeBody('email').trim().escape(),
    sanitizeBody('password').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('welcome', {
                errors: errors
            });
            return;
        } else {

            const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body["g-recaptcha-response"] + "&remoteip=" + req.connection.remoteAddress;
            request(verificationURL, function (error, response, captchaBody) {
                captchaBody = JSON.parse(captchaBody);
                if (captchaBody.success !== undefined && !captchaBody.success) {
                    return res.render('welcome', {
                        errors: captchaBody
                    });
                }
                bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        var user = new User({
                            name: "user",
                            email: req.body.email,
                            password: hash
                        });
                        user.save(function (err) {
                            if (err) {
                                res.render('welcome', {
                                    errors: err
                                })
                            }
                            // Successful - redirect to new User page.
                            res.render('welcome', {
                                message: user.email
                            });
                        });
                    }
                });
            });
        }
    }
];

// Handle User delete on POST.
exports.user_delete = function (req, res) {
    res.send('NOT IMPLEMENTED: User delete');
};

// Handle User login on POST.
exports.user_login = function (req, res) {
    sess = req.session;
    User.findOne({
        email: req.body.email
    }, function (err, logUser) {
        if (err) {
            res.render('welcome', {
                errors: "Wrong email OR password!"
            });
        } else {
            bcrypt.compare(req.body.password, logUser.password, function (err, isMatch) {
                if (err) {
                    res.render('welcome', {
                        errors: "Wrong email OR password!"
                    });
                } else {
                    if (isMatch) {
                        sess.user = req.body.email;
                        res.render('user_detail', {
                            message: "Logged in: ",
                            user: logUser
                        });
                    } else {
                        res.render('welcome', {
                            errors: "Wrong email OR password!"
                        });
                    }
                }
            })
        }
    })
}

exports.user_logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/heroes');
        }
    })
}