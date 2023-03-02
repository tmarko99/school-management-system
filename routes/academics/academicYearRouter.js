const express = require('express');

const academicYearController = require('../../controller/academics/academicYear');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', isAuth, isAdmin, academicYearController.createAcademicYear);
router.get('/', isAuth, isAdmin, academicYearController.getAllAcademicYears);
router.get('/:id', isAuth, isAdmin, academicYearController.getAcademicYear);
router.put('/:id', isAuth, isAdmin, academicYearController.updateAcademicYear);
router.delete('/:id', isAuth, isAdmin, academicYearController.deleteAcademicYear);

module.exports = router;