const AsyncHandler = require('express-async-handler');
const AcademicTerm = require('../../model/Academic/AcademicTerm');
const Admin = require('../../model/Staff/Admin');

exports.createAcademicTerm = AsyncHandler(async (req, res, next) => {
    const { name, description, duration } = req.body;

    const academicTerm = await AcademicTerm.findOne({ name });

    if (academicTerm) {
        const error = new Error('Academic term already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdAcademicTerm = await AcademicTerm.create({
        name, description, duration, createdBy: req.userId
    });

    const admin = await Admin.findById(req.userId);
    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }
    admin.academicTerms.push(createdAcademicTerm._id);
    await admin.save();
    
    res.status(201).json({
        status: 'Success',
        data: createdAcademicTerm
    });
});

exports.getAllAcademicTerms = AsyncHandler(async (req, res, next) => {
    const academicTerms = await AcademicTerm.find();

    res.status(200).json({
        status: 'Success',
        data: academicTerms
    });
});

exports.getAcademicTerm = AsyncHandler(async (req, res, next) => {
    const academicTerm = await AcademicTerm.findById(req.params.id);

    if (!academicTerm) {
        const error = new Error('Academic term not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: academicTerm
    });
});

exports.updateAcademicTerm = AsyncHandler(async (req, res, next) => {
    const { name, description, duration } = req.body;

    const academicTerm = await AcademicTerm.findById(req.params.id);

    if (!academicTerm) {
        const error = new Error('Academic term not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await AcademicTerm.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Academic term already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedAcademicTerm = await AcademicTerm.findByIdAndUpdate(req.params.id, 
        { name, description, duration, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedAcademicTerm
    });
});

exports.deleteAcademicTerm = AsyncHandler(async (req, res, next) => {
    const academicTerm = await AcademicTerm.findById(req.params.id);

    if (!academicTerm) {
        const error = new Error('Academic year not found!');
        error.statusCode = 404;
        throw error;
    }

    await AcademicTerm.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});