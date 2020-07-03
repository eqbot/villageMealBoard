#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Village = require('./models/village')
var Meal = require('./models/meal')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var villages = []
var meals = []

function villageCreate(village_name, village_admin_key, village_user_key, cb){
    villagedetail = {village_name:village_name, village_admin_key:village_admin_key, village_user_key:village_user_key};
    var village = new Village(villagedetail);
    village.save(
        function (err) {
            if (err) {
              cb(err, null)
              return
            }
            console.log('New Village: ' + village);
            villages.push(village)
            cb(null, village)
        }
    )
}

function mealCreate(village, maker, meal_date, cb){
    mealdetail = {village:village, meal_date:meal_date};
    if (maker != false) mealdetail.maker = maker;

    var meal = new Meal(mealdetail);
    meal.save(
        function (err) {
            if (err) {
              cb(err, null)
              return
            }
            console.log('New Meal: ' + meal);
            meals.push(meal)
            cb(null, meal)
        }
    )
}

function createVillages(cb){
    async.parallel([
        function(callback){
            villageCreate("6:30 Club", "villageadmin", "village", callback)
        }
    ], cb)
}

function createMeals(cb){
    async.parallel([
        function(callback){
            mealCreate(villages[0], "Trent", '2020-7-5', callback)
        },
        function(callback){
            mealCreate(villages[0], false, '2020-7-12', callback)
        }
    ], cb)
}



async.series([
    createVillages,
    createMeals
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        //console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




