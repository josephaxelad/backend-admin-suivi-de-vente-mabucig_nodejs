const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin');
const adminAuth = require('../middleware/adminAuth');


router.delete('/deleteHard/:id', adminAuth.roles(['superadmin','root']), adminCtrl.deleteHard);
router.get('/isSignedIn/', adminAuth.roles(['admin','superadmin','root']), adminCtrl.isSignedIn);
router.get('/getOne/:id', adminAuth.roles(['superadmin','root']), adminCtrl.getOne);
router.get('/getMe/', adminAuth.roles(['admin','superadmin','root']), adminCtrl.getMe);
router.get('/getAll', adminAuth.roles(['superadmin','root']),adminCtrl.getAll);
router.get('/getVeryAll', adminAuth.roles(['superadmin','root']),  adminCtrl.getVeryAll);
router.post('/create/', adminAuth.roles(['superadmin','root']), adminCtrl.create);
router.post('/login', adminCtrl.login);
router.put('/modifyUser/', adminAuth.roles(['admin','superadmin','root']), adminCtrl.modifyUser);
router.put('/modifyPassword/', adminAuth.roles(['admin','superadmin','root']), adminCtrl.modifyPassword);
router.put('/resetPassword/:id', adminAuth.roles(['superadmin','root']), adminCtrl.resetPassword);
router.put('/isDisabled/:id', adminAuth.roles(['superadmin','root']), adminCtrl.isDisabled);
// router.put('/modifyRole/:id', adminCtrl.modifyRole);
// router.put('/delete/:id', adminCtrl.delete);
router.post('/createtest/',  adminCtrl.create);


module.exports = router;