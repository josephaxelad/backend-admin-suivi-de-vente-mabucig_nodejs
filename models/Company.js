const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const companySchema = mongoose.Schema({
  name: { type: String, required: true, unique : true, sparse:true },
  idGroup: { type:  Schema.ObjectId, required: false}
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Company', companySchema);