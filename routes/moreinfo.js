var express = require('express');
var router = express.Router();
var db = require('../app_server/models/dbs');

router.get('/:name', function(req, res, next) {
  var d = req.params.name;
  db.Fridge.find({
    name: d
  }, {
    "_id": 0
  }, function(err, data) {
    if (err) console.log(err);
    res.render('moreinfo', {
      data: data
    });
  });
});

module.exports = router;
