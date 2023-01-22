const express = require('express');
const router = express.Router();

const productCtrl = require('../controllers/product');
const adminAuth = require('../middleware/adminAuth');
const multer = require('../middleware/multer-config');


router.delete('/delete/:id', adminAuth.roles(['admin','superadmin','root']), productCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['admin','superadmin','root']), productCtrl.getOne);
router.get('/getAll',productCtrl.getAll);
router.post('/create/', adminAuth.roles(['superadmin','root']),multer  ,productCtrl.create);
router.put('/modify/:id', adminAuth.roles(['superadmin','root']),multer ,productCtrl.modify);




module.exports = router;