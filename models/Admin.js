const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  login: { type: String, required: true, unique : true, sparse:true, lowercase : true },
  password: { type: String, required: true },
  picture: { type: String, required: false},
  role: { type: String, required: true, lowercase : true, default : 'admin',enum : ['admin','superadmin','root']},//superadmin,admin
  isDisabled: { type: Boolean, required: true, default : false },
  // isDeleted: { type: Boolean, required: true, default : false },
});

adminSchema.plugin(uniqueValidator, { message: "le login, {VALUE} existe déja." });

module.exports = mongoose.model('Admin', adminSchema);