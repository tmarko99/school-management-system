const AsyncHandler = require('express-async-handler');
const AcademicYear = require('../../model/academic/AcademicYear');
const Admin = require('../../model/staff/Admin');

exports.createAcademicYear = AsyncHandler(async (req, res, next) => {
    const {name, fromYear, toYear } = req.body;

    const academicYear = await AcademicYear.findOne({ name });

    if (academicYear) {
        const error = new Error('Academic year already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdAcademicYear = await AcademicYear.create({
        name, fromYear, toYear, createdBy: req.userId
    });

    const admin = await Admin.findById(req.userId);
    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }
    admin.academicYears.push(createdAcademicYear._id);
    await admin.save();

    res.status(201).json({
        status: 'Success',
        data: createdAcademicYear
    });
});

exports.getAllAcademicYears = AsyncHandler(async (req, res, next) => {
    const academicYears = await AcademicYear.find();

    res.status(200).json({
        status: 'Success',
        data: academicYears
    });
});

exports.getAcademicYear = AsyncHandler(async (req, res, next) => {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
        const error = new Error('Academic year not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: academicYear
    });
});

exports.updateAcademicYear = AsyncHandler(async (req, res, next) => {
    const {name, fromYear, toYear } = req.body;

    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
        const error = new Error('Academic year not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await AcademicYear.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Academic year already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(req.params.id, 
        { name, fromYear, toYear, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedAcademicYear
    });
});

exports.deleteAcademicYear = AsyncHandler(async (req, res, next) => {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
        const error = new Error('Academic year not found!');
        error.statusCode = 404;
        throw error;
    }

    await AcademicYear.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});