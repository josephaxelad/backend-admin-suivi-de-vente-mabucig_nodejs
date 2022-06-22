const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const commandLineSchema = mongoose.Schema({
  qte: { type: Number, required: true, min : 1 },
  price: { type: Number , required: true,min : 0 },
  productName : { type : String, required: true},
  idProduct : { type : Schema.ObjectId, required: true}
});

commandLineSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CommandLine', commandLineSchema);