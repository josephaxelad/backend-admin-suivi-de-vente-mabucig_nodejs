const express = require('express');
const router = express.Router();

const markCtrl = require('../controllers/mark');
const adminAuth = require('../middleware/adminAuth');


router.delete('/delete/:id', adminAuth.roles(['superadmin','root']), markCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), markCtrl.getOne);
router.get('/getAll', adminAuth.roles(['superadmin','root']),markCtrl.getAll);
router.post('/create/', adminAuth.roles(['superadmin','root']),  markCtrl.create);
router.put('/modify/', adminAuth.roles(['superadmin','root']), markCtrl.modify);




module.exports = router;