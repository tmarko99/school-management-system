const express = require('express');

const programController = require('../../controller/academics/programController');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', isAuth, isAdmin, programController.createProgram);
router.get('/', isAuth, isAdmin, programController.getAllPrograms);
router.get('/:id', isAuth, isAdmin, programController.getProgram);
router.put('/:id', isAuth, isAdmin, programController.updateProgram);
router.delete('/:id', isAuth, isAdmin, programController.deleteProgram);

module.exports = router;