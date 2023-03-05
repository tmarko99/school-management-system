const express = require('express');

const examRouterController = require('../../controller/academics/examResult');
const isStudent = require('../../middlewares/isStudent');
const isAdmin = require('../../middlewares/isAdmin');
const isAuth = require('../../middlewares/isAuth');

const router = express.Router();

// router.post('/', isAuth, isTeacher, examRouterController.createExam);
router.get('/', isAuth, isStudent, examRouterController.getAllExamResults);
router.get('/:id/checking', isAuth, isStudent, examRouterController.checkExamResult);
router.put('/:id/admin-toggle-publish', isAuth, isAdmin, examRouterController.adminToggleExamResult);

module.exports = router;