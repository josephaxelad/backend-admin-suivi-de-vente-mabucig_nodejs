const express = require('express');
const router = express.Router();

const orderCtrl = require('../controllers/order');
const adminAuth = require('../middleware/adminAuth');
const wholesalerAuth = require('../middleware/wholesalerAuth');


// router.delete('/delete/:id', adminAuth.roles(['superadmin']), orderCtrl.delete);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), orderCtrl.getOne);
router.get('/getAll/', adminAuth.roles(['admin','superadmin','root']),orderCtrl.getAll);
router.get('/getAllReports/', adminAuth.roles(['admin','superadmin','root']) ,orderCtrl.getAllGroupBySemiWholesalerAndProduct);
router.get('/getAllByWholesaler/:id',wholesalerAuth,orderCtrl.getAllByWholesaler);
router.get('/getAllByWholesalerNumber/:id',wholesalerAuth,orderCtrl.getAllByWholesalerNumber);
router.get('/sortBy/:key/:value', adminAuth.roles(['admin','superadmin','root']),orderCtrl.sortBy);
router.post('/filter/', adminAuth.roles(['admin','superadmin','root']),orderCtrl.filter);
router.post('/filterReports/', adminAuth.roles(['admin','superadmin','root']),orderCtrl.filterGroupBySemiWholesalerAndProduct);
router.post('/create/', wholesalerAuth,  orderCtrl.create);
router.post('/createMany/',  wholesalerAuth, orderCtrl.createMany);
// router.put('/modify/:id', adminAuth.roles(['superadmin']), orderCtrl.modify);


module.exports = router;