const express = require('express');
const router = express.Router();

const groupCtrl = require('../controllers/group');
const adminAuth = require('../middleware/adminAuth');


router.delete('/delete/:id', adminAuth.roles(['superadmin','root']), groupCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), groupCtrl.getOne);
router.get('/getAll', adminAuth.roles(['superadmin','root']),groupCtrl.getAll);
router.post('/create/', adminAuth.roles(['superadmin','root']),  groupCtrl.create);
router.put('/modify/:id', adminAuth.roles(['superadmin','root']), groupCtrl.modify);




module.exports = router;