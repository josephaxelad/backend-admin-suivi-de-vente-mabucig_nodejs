const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');
const adminAuth = require('../middleware/adminAuth');
const wholesalerAuth = require('../middleware/wholesalerAuth');


// router.delete('/delete/:id', adminAuth.roles(['superadmin']), orderCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), orderCtrl.getOne);
router.get('/getAll', adminAuth.roles(['superadmin','root']),orderCtrl.getAll);
router.get('/getAllByWholesaler/:id',wholesalerAuth,orderCtrl.getAllByWholesaler);
router.post('/create/', wholesalerAuth,  orderCtrl.create);
// router.put('/modify/:id', adminAuth.roles(['superadmin']), orderCtrl.modify);


module.exports = router;