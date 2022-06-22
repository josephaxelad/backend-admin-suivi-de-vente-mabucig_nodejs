const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const groupSchema = mongoose.Schema({
  name: { type: String, required: true, unique : true, sparse:true }
});

groupSchema.plugin(uniqueValidator, { message: "le groupe d'entreprise, {VALUE} existe déja." });

module.exports = mongoose.model('Group', groupSchema);