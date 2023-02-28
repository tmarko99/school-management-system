const express = require('express');

const academicYearController = require('../../controller/academics/academicYear');
const isAuth = require('../../middlewares/is-auth');
const isAdmin = require('../../middlewares/is-admin');

const router = express.Router();

router.post('/', isAuth, isAdmin, academicYearController.createAcademicYear);
router.get('/', isAuth, isAdmin, academicYearController.getAllAcademicYears);
router.get('/:id', isAuth, isAdmin, academicYearController.getAcademicYear);
router.put('/:id', isAuth, isAdmin, academicYearController.updateAcademicYear);
router.put('/:id', isAuth, isAdmin, academicYearController.deleteAcademicYear);

module.exports = router;