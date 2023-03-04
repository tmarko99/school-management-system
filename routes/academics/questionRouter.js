const express = require('express');

const questionController = require('../../controller/academics/question');
const isAuth = require('../../middlewares/isAuth');
const isTeacher = require('../../middlewares/isTeacher');

const router = express.Router();

router.post('/:examId', isAuth, isTeacher, questionController.createQuestion);
router.get('/', isAuth, isTeacher, questionController.getAllQuestions);
router.get('/:id', isAuth, isTeacher, questionController.getQuestion);
router.put('/:id', isAuth, isTeacher, questionController.updateQuestion);

module.exports = router;