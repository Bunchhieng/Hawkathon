var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/about');
var moreinfo = require('./routes/moreinfo');
var app = express();

// Import our databas connection handler
// https://github.com/HPE-Haven-OnDemand/havenondemand-node
var db = require('./app_server/models/dbs');
var hod = require('havenondemand');
var request = require('request');
var cheerio = require('cheerio');
var client = new hod.HODClient("9f68afe8-cdd7-43b3-a9e6-bfdb9e1d93bb", "v1");
/**
 * To test the sentimental analysis, I query one recipe from the pre existing
 * recipes database. Then call the havenondemand API to get the sentiment of each
 * text. Note that, the text is the most important content from `data.url`
 */
app.use('api/recipes', function(req, res) {

})
db.Fridge.find({}, {
  "_id": 0
}, function(err, data) {
  if (err) console.log(err);
  // This line took me quite a while to get it :(
  var d = JSON.parse(JSON.stringify(data[0]));
  var names = [];
  for (var key in d) {
    for (var i = 0; i < d[key].length; i++) {
      names.push(d[key][i].name);
    }
  }
  console.log("|======================================================INVENTORY FOODS======================================================|");
  console.log(names);
  var search = names.join(" ");
  db.Recipes.find({
    "$text": {
      "$search": search
    }
  }, {
    "score": {
      "$meta": "textScore"
    }
  }, {
    _id: 0
  }).sort({
    "score": {
      "$meta": "textScore"
    }
  }).limit(-2).exec(function(err, data) {
    console.log("|======================================================TOP 2 RECIPES======================================================|");
    console.log(data);
    data.map(function(item) {
      request(item.url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          $ = cheerio.load(body);
          // http://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators
          var allP = $("body p").contents().map(function() {
            return (this.type === 'text') ? $(this).text() : '';
          }).get().join("");
          // console.log(allP);
          client.call('analyzesentiment', {
            'text': allP
          }, function(err, resp, body) {
            if (err) console.log(err);
            console.log("|======================================================SENTIMENTAL ANALYSIS======================================================|");
            console.log(body.aggregate);
            console.log("|================================================================================================================================|");
          });
        }
      });
    });
  });
});
// db.Recipes.find().limit(1).exec(function(err, data) {
//   if (err) console.log(err);
//   request(data[0].url, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       $ = cheerio.load(body);
//       // http://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators
//       var allP = $("body p").contents().map(function() {
//         return (this.type === 'text') ? $(this).text() : '';
//       }).get().join("");
//       // console.log(allP);
//       client.call('analyzesentiment', {
//         'text': allP
//       }, function(err, resp, body) {
//         if (err) console.log(err);
//         console.log(body.aggregate);
//       });
//     }
//   });
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/moreinfo', moreinfo);
app.use('/api', function(req, res) {
  db.Recipes.find().limit(5).exec(function(err, data) {
    if (err) console.log(err);
    request(data[0].url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);
        // http://stackoverflow.com/questions/31543451/cheerio-extract-text-from-html-with-separators
        var allP = $("body p").contents().map(function() {
          return (this.type === 'text') ? $(this).text() : '';
        }).get().join("");
        // console.log(allP);
        client.call('analyzesentiment', {
          'text': allP
        }, function(err, resp, body) {
          if (err) console.log(err);
          res.json(data);
          // res.json(body.aggregate);
          console.log(body.aggregate);
        });
      }
    });
    console.log(data[0].description);
  });
});
app.use('/users', users);
app.use('/about', about);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
