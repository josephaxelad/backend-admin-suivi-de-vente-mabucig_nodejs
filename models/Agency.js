const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const agencySchema = mongoose.Schema({
  code: { type: String, required: true, unique : true, sparse:true },
  idCity : {type : Schema.ObjectId, required: true},
});

agencySchema.plugin(uniqueValidator, { message: "l'agence de distribution, {VALUE} existe déja." });

module.exports = mongoose.model('Agency', agencySchema);