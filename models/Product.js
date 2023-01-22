const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
  sku: { type: String, required: true, unique : 'le Produit, {VALUE} existe déja.', sparse:true },
  price: { type: Number , required: true,min : 0 },
  numberByPack: { type: Number , required: true,min : 0,default : 0 },
  cartridge: { type: Number , required: true,min : 0,default : 0 },
  picture: { type: String , required: true },
  idMark : { type :  Schema.ObjectId, required: true},
  idCodeQr : {type : String, required: false},
  isDisabled: { type: Boolean, required: true, default : false },
  // isDeleted: { type: Boolean, required: true, default : false },
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);