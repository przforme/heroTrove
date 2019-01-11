var Hero = require('../models/heroModel');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    async.parallel({
        hero_count: function(callback) {
            Hero.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('heroes', {error: err, data: results});
    });
};

// Display list of all chars.
exports.hero_list = function(req, res, next) {

    Hero.find({}, 'charName owner')
      .populate('owner')
      .exec(function (err, list_heroes) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('hero_list', { title: 'Hero list', hero_list: list_heroes });
    });
      
};

// Display detail page for a specific char.
exports.hero_detail = function(req, res, next) {

    async.parallel({
        hero: function(callback) {

            Hero.findById(req.params.id)
              .populate('owner')
              .populate('heroName')
              .exec(callback);
        },
        hero_instance: function(callback) {

          HeroInstance.find({ 'hero': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.hero==null) { // No results.
            var err = new Error('Hero not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('hero_detail', { title: 'Hero', hero: results.hero } );
    });

};

// Display char create form on GET.
exports.hero_create_get = function(req, res, next) { 
      
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        owners: function(callback) {
            User.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('hero_form', { title: 'Create Hero', owners: results.owners});
    });
};

// Handle char create on POST.
exports.hero_create_post = [
    body('heroName', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('heroDesc', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        
        const errors = validationResult(req);

        var hero = new Hero(
          { heroName: req.body.name,
            owner: req.session.user,
            heroDesc: req.body.description,
           });

        if (!errors.isEmpty()) {

            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

// Display char delete form on GET.
exports.hero_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: hero delete GET');
};

// Handle char delete on POST.
exports.hero_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: hero delete POST');
};