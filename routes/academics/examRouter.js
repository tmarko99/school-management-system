const express = require('express');

const examController = require('../../controller/academics/exam');
const isTeacher = require('../../middlewares/isTeacher');
const isAuth = require('../../middlewares/isAuth');

const router = express.Router();

router.post('/', isAuth, isTeacher, examController.createExam);
router.get('/', isAuth, isTeacher, examController.getAllExams);
router.get('/:id', isAuth, isTeacher, examController.getExam);
router.put('/:id', isAuth, isTeacher, examController.updateExam);

module.exports = router;