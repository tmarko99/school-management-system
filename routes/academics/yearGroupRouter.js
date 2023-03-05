const express = require('express');

const yearGroupController = require('../../controller/academics/yearGroupController');
const isAuth = require('../../middlewares/isAuth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.post('/', isAuth, isAdmin, yearGroupController.createYearGroup);
router.get('/', isAuth, isAdmin, yearGroupController.getAllYearGroups);
router.get('/:id', isAuth, isAdmin, yearGroupController.getYearGroup);
router.put('/:id', isAuth, isAdmin, yearGroupController.updateYearGroup);
router.delete('/:id', isAuth, isAdmin, yearGroupController.deleteYearGroup);

module.exports = router;