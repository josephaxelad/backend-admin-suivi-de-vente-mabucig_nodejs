const mongoose = require('mongoose');
const commandLine = require('./CommandLine');
var Schema = mongoose.Schema;

const commandLineSchema = mongoose.Schema({
  qty: { type: Number, required: true, min : 1 },
  price: { type: Number , required: true,min : 0 },
  productName : { type : String, required: true},
  idProduct : { type : Schema.ObjectId, required: true}
});

const orderSchema = mongoose.Schema({
  date : {type: Date,required: true},
  cart: { type: [commandLineSchema], required: true},
  price: { type: Number, required: true,min : 0 },
  idWholesaler : { type : Schema.ObjectId, required: true},
  idSemiWholesaler : { type : Schema.ObjectId, required: true},
  sent : { type: Boolean, required: true, default : true },
});


module.exports = mongoose.model('Order', orderSchema);