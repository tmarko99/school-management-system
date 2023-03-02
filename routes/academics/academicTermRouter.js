const express = require('express');

const academicTermController = require('../../controller/academics/academicTerm');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', isAuth, isAdmin, academicTermController.createAcademicTerm);
router.get('/', isAuth, isAdmin, academicTermController.getAllAcademicTerms);
router.get('/:id', isAuth, isAdmin, academicTermController.getAcademicTerm);
router.put('/:id', isAuth, isAdmin, academicTermController.updateAcademicTerm);
router.delete('/:id', isAuth, isAdmin, academicTermController.deleteAcademicTerm);

module.exports = router;