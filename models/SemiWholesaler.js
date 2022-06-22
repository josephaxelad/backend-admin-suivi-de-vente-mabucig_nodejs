const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const addressSchema = mongoose.Schema({
  name: { type: String, required: true },
  neighborhood: { type: String, required: true},
  gpsLat: { type:  Number, required: false},
  gpsLong: { type:  Number, required: false},
  idCity : {type :  Schema.ObjectId, required: true}
});

const semiWholesalerSchema = mongoose.Schema({
  idAccount: { type: String, required: true, unique : 'le numéro de compte, {VALUE} existe déja.', sparse:true, uppercase : true },
  idWholesaler: { type: Schema.ObjectId, required: true },
  name: { type: String, required: true, unique :  'le nom, {VALUE} existe déja.', sparse:true },
  phone1: { type: String, required: false, default : ''},
  phone2: { type: String, required: false, default : ''},
  picture: { type: String, required: false},
  address : { type: addressSchema, required: true},
  isDisabled: { type: Boolean, required: true, default : false },
  // isDeleted: { type: Boolean, required: true, default : false },
});

semiWholesalerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SemiWholesaler', semiWholesalerSchema);