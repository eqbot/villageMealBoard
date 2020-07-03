var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
     title: "Trent's Dev Site",
     links: [
       {text: "Village Meal Boards", url: "/villageBoard"},
       {text: "Foundry VTT", url: req.protocol + '://' + req.get('host').split(':')[0] + ":30000"}
     ]
  });
});

module.exports = router;
