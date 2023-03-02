const express = require('express');

const subjectController = require('../../controller/academics/subjects');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/:programId', isAuth, isAdmin, subjectController.createSubject);
router.get('/', isAuth, isAdmin, subjectController.getAllSubjects);
router.get('/:id', isAuth, isAdmin, subjectController.getSubject);
router.put('/:id', isAuth, isAdmin, subjectController.updateSubject);
router.delete('/:id', isAuth, isAdmin, subjectController.deleteSubject);

module.exports = router;