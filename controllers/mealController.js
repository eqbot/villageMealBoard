var Meal = require('../models/meal');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.meal_list = function(req, res){
    res.send("NOT IMPLEMENTED: meal list");
}

exports.meal_detail = function(req, res){
    async.parallel({
        meal: function(callback){
            Meal.findById(req.params.id)
                .populate('village')
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.meal == null) {
            var err = new Error('Meal not found');
            err.status = 404;
            return next(err);
        }

        res.render('meal_detail', {title: "Meal Detail", meal: results.meal})
    })
}

exports.meal_create_get = function(req, res){
    res.render('meal_form', {title: "Create Meal"})
}

exports.meal_create_post = [

    // Validate fields.
    body('meal_date').optional({checkFalsy: true}).isISO8601(),

    // Sanitize fields.
    sanitizeBody('meal_date').escape(),
    sanitizeBody('maker').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('meal_form', { title: 'Create Meal', meal: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Meal object with escaped and trimmed data.
            var meal = new Meal(
                {
                    village: req.params.village_id,
                    maker: req.body.maker,
                    meal_date: req.body.meal_date
                });
                meal.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new meal record.
                res.redirect(meal.url);
            });
        }
    }
];

exports.meal_delete_get = function(req, res){
    res.send("NOT IMPLEMENTED: meal delete GET");
}

exports.meal_delete_post = function(req, res){
    res.send("NOT IMPLEMENTED: meal delete POST");
}

exports.meal_update_get = function(req, res){
    async.parallel({
        meal: function(callback){
            Meal.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.meal==null) {
            var err = new Error('Meal not found');
            err.status = 404;
            return next(err);
        }

        res.render('meal_form', {title: 'Update meal', meal: results.meal, date_readonly: true})
    })
}

exports.meal_update_post = [

    // Validate fields.
    body('meal_date').optional({checkFalsy: true}).isISO8601(),

    // Sanitize fields.
    sanitizeBody('meal_date').escape(),
    sanitizeBody('maker').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('meal_form', { title: 'Create Meal', meal: req.body, errors: errors.array(), date_readonly: true });
            return;
        }
        else {
            // Data from form is valid.
            
            // Create an Meal object with escaped and trimmed data.
            var savedMeal = Meal.findById(req.params.id);
            var newMeal = new Meal({
                village: savedMeal.village,
                _id: req.params.id,
                meal_date: savedMeal.meal_date,
                maker: req.body.maker
            })
            
            Meal.findByIdAndUpdate(req.params.id, newMeal, {}, function(err, themeal){
                if(err) { return next(err); }
                // Successful - redirect to new meal record.
                res.redirect(themeal.url);
            });
        }
    }
];