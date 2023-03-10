const express = require('express');

const classLevelController = require('../../controller/academics/classLevelController');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', isAuth, isAdmin, classLevelController.createClassLevel);
router.get('/', isAuth, isAdmin, classLevelController.getAllClassLevels);
router.get('/:id', isAuth, isAdmin, classLevelController.getClassLevel);
router.put('/:id', isAuth, isAdmin, classLevelController.updateClassLevel);
router.delete('/:id', isAuth, isAdmin, classLevelController.deleteClassLevel);

module.exports = router;