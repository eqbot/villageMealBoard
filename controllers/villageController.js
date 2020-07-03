var Village = require('../models/village');
var Meal = require('../models/meal');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res){
    async.parallel({
        villages: function(callback) {
            Village.find(callback);
        }
    }, function(err, results){
        res.render('villageBoard', {title: 'Village Board Home', error: err, data: results})
    })
}

exports.village_list = function(req, res){
    res.send("NOT IMPLEMENTED: Village list");
}

exports.village_detail = function(req, res, next){
    async.parallel({
        village: function(callback){
            Village.findById(req.params.id).exec(callback);
        },
        village_meals: function(callback) {
            Meal.find({'village': req.params.id}, 'maker meal_date').exec(callback);
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.village == null) {
            var err = new Error('Village not found');
            err.status = 404;
            return next(err);
        }

        res.render('village_detail', {title: "Village Detail", village: results.village, village_meals: results.village_meals})
    })
}

exports.village_create_get = function(req, res){
    res.render('village_form', {title: 'Create Village'});
}

exports.village_create_post = [

    // Validate fields.
    body('village_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
    body('village_admin_key').isLength({ min: 1 }).trim().withMessage('Village admin key must be specified.'),

    // Sanitize fields.
    sanitizeBody('village_name').escape(),
    sanitizeBody('village_admin_key').escape(),
    sanitizeBody('village_user_key').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('village_form', { title: 'Create Village', village: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Village object with escaped and trimmed data.
            var village = new Village(
                {
                    village_name: req.body.village_name,
                    village_admin_key: req.body.village_admin_key,
                    village_user_key: req.body.village_user_key
                });
            village.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new village record.
                res.redirect(village.url);
            });
        }
    }
];

exports.village_delete_get = function(req, res){
    res.send("NOT IMPLEMENTED: Village delete GET");
}

exports.village_delete_post = function(req, res){
    res.send("NOT IMPLEMENTED: Village delete POST");
}

exports.village_update_get = function(req, res){
    res.send("NOT IMPLEMENTED: Village update GET");
}

exports.village_update_post = function(req, res){
    res.send("NOT IMPLEMENTED: Village update POST")
}