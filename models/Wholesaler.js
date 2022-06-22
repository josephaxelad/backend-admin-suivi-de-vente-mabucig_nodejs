const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const wholesalerSchema = mongoose.Schema({
  idAccount: { type: String, required: true, uppercase : true },
  name: { type: String, required: true, unique : 'le nom, {VALUE} existe déja.', sparse:true },
  login: { type: String, required: true, unique : 'le login, {VALUE} existe déja.', sparse:true, lowercase : true },
  password: { type: String, required: true },
  phone: { type: String, required: false},
  picture: { type: String, required: false},
  company : { type : String, required: true,unique : "l'entreprise, {VALUE} existe déja."},
  idsMarket : { type : [Schema.ObjectId], required: true},
  idAgency : { type : Schema.ObjectId, required: true},
  idGroup : { type : Schema.ObjectId, required: false},
  isDisabled: { type: Boolean, required: true, default : false },
  // isDeleted: { type: Boolean, required: true, default : false },
});

wholesalerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Wholesaler', wholesalerSchema);