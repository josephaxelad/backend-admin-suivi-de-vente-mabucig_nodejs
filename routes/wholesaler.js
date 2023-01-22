const express = require('express');
const router = express.Router();

const wholesalerCtrl = require('../controllers/wholesaler');
const adminAuth = require('../middleware/adminAuth');


router.delete('/delete/:id', adminAuth.roles(['admin','superadmin','root']), wholesalerCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['admin','superadmin','root']), wholesalerCtrl.getOne);
router.get('/getAll', adminAuth.roles(['admin','superadmin','root']),wholesalerCtrl.getAll);
router.post('/create/', adminAuth.roles(['admin','superadmin','root']),  wholesalerCtrl.create);
router.post('/login', wholesalerCtrl.login);
router.put('/modify/:id', adminAuth.roles(['admin','superadmin','root']), wholesalerCtrl.modify);
router.put('/isDisabled/:id', adminAuth.roles(['admin','superadmin','root']), wholesalerCtrl.isDisabled);
router.put('/resetPassword/:id', adminAuth.roles(['admin','superadmin','root']), wholesalerCtrl.resetPassword);



module.exports = router;