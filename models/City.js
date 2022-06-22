const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const citySchema = mongoose.Schema({
  name: { type: String, required: true, unique :true, sparse:true }
});

citySchema.plugin(uniqueValidator, { message: "la ville, {VALUE} existe déja." });

module.exports = mongoose.model('City', citySchema);