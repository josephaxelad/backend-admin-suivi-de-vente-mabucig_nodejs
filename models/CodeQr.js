const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const codeQrSchema = mongoose.Schema({
  picture: { type: String, required: true, unique : true, sparse:true },
  idProduct: { type: Schema.ObjectId , required: true, unique : true, sparse:true }
});

codeQrSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CodeQr', codeQrSchema);