const express = require('express');

const adminController = require('../../controller/staff/adminController');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');
const advancedResults = require('../../middlewares/advancedResults');
const Admin = require('../../model/staff/Admin');

const adminRouter = express.Router();

//register
adminRouter.post('/register', adminController.registerAdmin);

//login
adminRouter.post('/login', adminController.loginAdmin);

//get all
adminRouter.get('/', isAuth, advancedResults(Admin), adminController.getAllAdmins);

//get single
adminRouter.get('/profile', isAuth, isAdmin, adminController.getAdminProfile);

//update
adminRouter.put('/', isAuth, isAdmin, adminController.updateAdmin);

//delete
adminRouter.delete('/:id', adminController.deleteAdmin);

//suspend teacher
adminRouter.put('/suspend/teacher/:id', adminController.adminSuspendTeacher);

//unsuspend teacher
adminRouter.put('/unsuspend/teacher/:id', adminController.adminUnSuspendTeacher);

//withdrawn teacher
adminRouter.put('/withdraw/teacher/:id', adminController.adminWithdrawTeacher);

//unwithdrawn teacher
adminRouter.put('/unwithdraw/teacher/:id', adminController.adminUnWithdrawTeacher);

//publish exam results teacher
adminRouter.put('/publish/exam/:id', adminController.adminPublishExamResults);

//unpublish exam results teacher
adminRouter.put('/unpublish/exam/:id', adminController.adminUnPublishExamResults);

module.exports = adminRouter;