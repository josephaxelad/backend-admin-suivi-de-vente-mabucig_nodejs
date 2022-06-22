const express = require('express');
const router = express.Router();

const semiWholesalerCtrl = require('../controllers/semiWholesaler');
const adminAuth = require('../middleware/adminAuth');
const wholesalerAuth = require('../middleware/wholesalerAuth');


router.delete('/delete/:id', adminAuth.roles(['superadmin','root']), semiWholesalerCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), semiWholesalerCtrl.getOne);
router.get('/getAll', adminAuth.roles(['superadmin','root']),semiWholesalerCtrl.getAll);
router.get('/getByWholesaler/:id' ,semiWholesalerCtrl.getByWholesaler);
router.post('/create/', adminAuth.roles(['superadmin','root']),  semiWholesalerCtrl.create);
router.put('/modify/:id', adminAuth.roles(['superadmin','root']), semiWholesalerCtrl.modify);
router.put('/isDisabled/:id', adminAuth.roles(['superadmin','root']), semiWholesalerCtrl.isDisabled);




module.exports = router;