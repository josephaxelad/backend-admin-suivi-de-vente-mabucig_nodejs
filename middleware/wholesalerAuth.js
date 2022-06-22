const jwt = require('jsonwebtoken');
const Wholesaler = require('../models/Wholesaler');

module.exports = (req, res, next) => {
  try {
    if (req.params.id ) {
      Wholesaler.findOne({ _id: req.params.id })
      .then(wholesaler =>{
        if (wholesaler.isDisabled == true) {
          throw 'Compte Introuvable';
        } 
      })
      .catch(error => {res.status(401).json({ error })})
    }
    if (req.body.idWholesaler) {
      Wholesaler.findOne({ _id: req.body.idWholesaler })
      .then(wholesaler =>{
        if (wholesaler.isDisabled == true) {
          throw 'Compte désactivé';
        } 
      })
      .catch(error => {res.status(401).json({ error })}) 
    }
    
    next();
    
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};