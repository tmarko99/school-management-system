const express = require('express');

const teacherController = require('../../controller/staff/teacherController');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');
const isTeacher = require('../../middlewares/isTeacher');
const Teacher = require('../../model/staff/Teacher');
const advancedResults = require('../../middlewares/advancedResults');
 
const router = express.Router();

//register
router.post('/register', isAuth, isAdmin, teacherController.registerTeacher);

//login
router.post('/login', teacherController.loginTeacher);

//get all
router.get('/', 
    isAuth, 
    isAdmin, 
    advancedResults(Teacher, {
        path: 'examCreated',
        populate: {
            path: 'questions'
        }
    }), 
    teacherController.getAllTeachers
);

//get single
router.get('/:teacherId', isAuth, isAdmin, teacherController.getTeacher);

//get teacher profile
router.get('/profile', isAuth, isTeacher, teacherController.getTeacherProfile);

//update
router.put('/', isAuth, isTeacher, teacherController.updateTeacherProfile);

//admin update teacher
router.put('/:teacherId/update', isAuth, isAdmin, teacherController.adminUpdateTeacherProfile);


module.exports = router;