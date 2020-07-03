var express = require('express');
var router = express.Router();

var village_controller = require('../controllers/villageController');
var meal_controller = require('../controllers/mealController');

/* VILLAGE ROUTES */
//GET home page
router.get('/', village_controller.index);

//GET create Village
router.get('/village/create', village_controller.village_create_get);

//POST create Village
router.post('/village/create', village_controller.village_create_post);

//GET delete Village
router.get('/village/:id/delete', village_controller.village_delete_get);

//POST delete Village
router.post('/village/:id/delete', village_controller.village_delete_post);

//GET update Village
router.get('/village/:id/update', village_controller.village_update_get);

//POST update Village
router.post('/village/:id/update', village_controller.village_update_post);

//GET Village detail
router.get('/village/:id', village_controller.village_detail);

//GET Village list
router.get('/village', village_controller.village_list);

/*MEAL ROUTES*/

//GET create Meal
router.get('/village/:village_id/meal/create', meal_controller.meal_create_get);

//POST create Meal
router.post('/village/:village_id/meal/create', meal_controller.meal_create_post);

//GET delete Meal
router.get('/meal/:id/delete', meal_controller.meal_delete_get);

//POST delete Meal
router.post('/meal/:id/delete', meal_controller.meal_delete_post);

//GET update Meal
router.get('/meal/:id/update', meal_controller.meal_update_get);

//POST update Meal
router.post('/meal/:id/update', meal_controller.meal_update_post);

//GET Meal detail
router.get('/meal/:id', meal_controller.meal_detail);

//GET Meal list
router.get('/meal', meal_controller.meal_list);

module.exports = router;