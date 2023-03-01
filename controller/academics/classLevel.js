const AsyncHandler = require('express-async-handler');
const ClassLevel = require('../../model/Academic/ClassLevel');
const Admin = require('../../model/Staff/Admin');

exports.createClassLevel = AsyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const classLevel = await ClassLevel.findOne({ name });

    if (classLevel) {
        const error = new Error('Class level already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdClassLevel = await ClassLevel.create({
        name, description, createdBy: req.userId
    });

    const admin = await Admin.findById(req.userId);
    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }
    admin.classLevels.push(createdClassLevel._id);
    await admin.save();
    
    res.status(201).json({
        status: 'Success',
        data: createdClassLevel
    });
});

exports.getAllClassLevels = AsyncHandler(async (req, res, next) => {
    const classLevels = await ClassLevel.find();

    res.status(200).json({
        status: 'Success',
        data: classLevels
    });
});

exports.getClassLevel = AsyncHandler(async (req, res, next) => {
    const classLevel = await ClassLevel.findById(req.params.id);

    if (!classLevels) {
        const error = new Error('Class level not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: classLevel
    });
});

exports.updateClassLevel = AsyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const classLevel = await ClassLevel.findById(req.params.id);

    if (!classLevel) {
        const error = new Error('Class level not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await ClassLevel.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Class level already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedClassLevel = await ClassLevel.findByIdAndUpdate(req.params.id, 
        { name, description, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedClassLevel
    });
});

exports.deleteClassLevel = AsyncHandler(async (req, res, next) => {
    const classLevel = await ClassLevel.findById(req.params.id);

    if (!classLevel) {
        const error = new Error('Class level not found!');
        error.statusCode = 404;
        throw error;
    }

    await classLevel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});