const express = require('express');

const academicTermController = require('../../controller/academics/academicTerm');
const isAuth = require('../../middlewares/is-auth');
const isAdmin = require('../../middlewares/is-admin');

const router = express.Router();

router.post('/', isAuth, isAdmin, academicTermController.createAcademicTerm);
router.get('/', isAuth, isAdmin, academicTermController.getAllAcademicTerms);
router.get('/:id', isAuth, isAdmin, academicTermController.getAcademicTerm);
router.put('/:id', isAuth, isAdmin, academicTermController.updateAcademicTerm);
router.put('/:id', isAuth, isAdmin, academicTermController.deleteAcademicTerm);

module.exports = router;