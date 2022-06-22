const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const addressSchema = mongoose.Schema({
  name: { type: String, required: true },
  neighborhood: { type: String, required: true},
  gpsLat: { type:  Number, required: true},
  gpsLong: { type:  Number, required: true},
  idCity : {type :  Schema.ObjectId, required: true}
});

addressSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Address', addressSchema);