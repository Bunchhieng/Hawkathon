// Database source: https://github.com/fictivekin/openrecipes
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
  _id: String,
  name: String,
  ingredients: String,
  url: String,
  image: String,
  ts: Date,
  cookTime: String,
  source: String,
  recipeYield: String,
  datePublished: String,
  prepTime: String,
  description: String
});
// Load pre-existing database
// http://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
module.exports = mongoose.model('recipes', recipeSchema, 'recipes');
