const express = require('express');
const router = express.Router();

const agencyCtrl = require('../controllers/agency');
const adminAuth = require('../middleware/adminAuth');


router.delete('/delete/:id', adminAuth.roles(['superadmin','root']), agencyCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), agencyCtrl.getOne);
router.get('/getAll', adminAuth.roles(['admin','superadmin','root']),agencyCtrl.getAll);
router.post('/create/', adminAuth.roles(['superadmin','root']),  agencyCtrl.create);
router.put('/modify/:id', adminAuth.roles(['superadmin','root']), agencyCtrl.modify);




module.exports = router;