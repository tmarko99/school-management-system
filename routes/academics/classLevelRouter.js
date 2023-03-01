const express = require('express');

const classLevelController = require('../../controller/academics/classLevel');
const isAuth = require('../../middlewares/is-auth');
const isAdmin = require('../../middlewares/is-admin');

const router = express.Router();

router.post('/', isAuth, isAdmin, classLevelController.createClassLevel);
router.get('/', isAuth, isAdmin, classLevelController.getAllClassLevels);
router.get('/:id', isAuth, isAdmin, classLevelController.getClassLevel);
router.put('/:id', isAuth, isAdmin, classLevelController.updateClassLevel);
router.put('/:id', isAuth, isAdmin, classLevelController.deleteClassLevel);

module.exports = router;