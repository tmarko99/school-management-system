const express = require('express');

const studentController = require('../../controller/students/students');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');
const isStudent = require('../../middlewares/isStudent');
 
const router = express.Router();

//register
router.post('/register', isAuth, isAdmin, studentController.registerStudent);

//login
router.post('/login', studentController.loginStudent);

//get all
router.get('/', isAuth, isAdmin, studentController.getAllStudents);

//get single
router.get('/:studentId', isAuth, isAdmin, studentController.getStudent);

//get student profile
router.get('/profile', isAuth, isStudent, studentController.getStudentProfile);

//update
router.put('/', isAuth, isStudent, studentController.updateStudentProfile);

//admin update student
router.put('/:studentId/update', isAuth, isAdmin, studentController.adminUpdateStudentProfile);


module.exports = router;