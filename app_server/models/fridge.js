var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Import data to mongodb
// https://docs.mongodb.org/getting-started/shell/import-data/

var fridgeSchema = new Schema({});

module.exports = mongoose.model('fridge', fridgeSchema, 'fridge');
