const express = require('express');
const router = express.Router();

const cityCtrl = require('../controllers/city');
const adminAuth = require('../middleware/adminAuth');


router.delete('/delete/:id', adminAuth.roles(['superadmin','root']), cityCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), cityCtrl.getOne);
router.get('/getAll', adminAuth.roles(['admin','superadmin','root']),cityCtrl.getAll);
router.post('/create/', adminAuth.roles(['superadmin','root']),  cityCtrl.create);
router.put('/modify/:id', adminAuth.roles(['superadmin','root']), cityCtrl.modify);




module.exports = router;