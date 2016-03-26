var express = require('express');
var router = express.Router();
var db = require('../app_server/models/dbs');
var hod = require('havenondemand');
var request = require('request');
var cheerio = require('cheerio');
var client = new hod.HODClient("9f68afe8-cdd7-43b3-a9e6-bfdb9e1d93bb", "v1");
/* GET home page. */
router.get('/', function(req, res, next) {
  db.Recipes.find({}, {"_id": 0}).limit(1).exec(function(err, data) {
    if (err) console.log(err);
    request(data[0].url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        // http://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators
        var allP = $("body p").contents().map(function() {
          return (this.type === 'text') ? $(this).text() : '';
        }).get().join("");
        client.call('analyzesentiment', {
          'text': allP
        }, function(err, resp, body) {
          if (err) console.log(err);
          db.Fridge.find({}, {
            "_id": 0
          }, function(err, d) {
            if (err) console.log(err);
            res.render('index', {
              data: JSON.parse(JSON.stringify(d[0])),
              recommend: body.aggregate
            });
            console.log(body.aggregate);
          });
        });
      }
    });
  });
});

module.exports = router;
