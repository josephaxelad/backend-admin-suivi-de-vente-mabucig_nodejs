const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const markSchema = mongoose.Schema({
  name: { type: String, required: true, unique : true, sparse:true }
});

markSchema.plugin(uniqueValidator, { message: "La marque de produit, {VALUE} existe déja." });

module.exports = mongoose.model('Mark', markSchema);