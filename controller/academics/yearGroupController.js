const AsyncHandler = require('express-async-handler');
const YearGroup = require('../../model/academic/YearGroup');
const AcademicYear = require('../../model/academic/AcademicYear');
const Admin = require('../../model/staff/Admin');

exports.createYearGroup = AsyncHandler(async (req, res, next) => {
    const { name, academicYear } = req.body;

    const academicYearFound = await AcademicYear.findById(academicYear);

    if (!academicYearFound) {
        const error = new Error('Year group not found!');
        error.statusCode = 404;
        throw error;
    }

    const yearGroup = await YearGroup.findOne({ name });

    if (yearGroup) {
        const error = new Error('Year group already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdYearGroups = await YearGroup.create({
        name, academicYear, createdBy: req.userId
    });

    const admin = await Admin.findById(req.userId);
    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }
    admin.yearGroups.push(createdSubject._id);
    await admin.save();
    
    res.status(201).json({
        status: 'Success',
        data: createdYearGroups
    });
});

exports.getAllYearGroups = AsyncHandler(async (req, res, next) => {
    const yearGroups = await YearGroup.find();

    res.status(200).json({
        status: 'Success',
        data: yearGroups
    });
});

exports.getYearGroup = AsyncHandler(async (req, res, next) => {
    const yearGroup = await YearGroup.findById(req.params.id);

    if (!yearGroup) {
        const error = new Error('Year group not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: yearGroup
    });
});

exports.updateYearGroup = AsyncHandler(async (req, res, next) => {
    const { name, academicYear } = req.body;

    const academicYearFound = await AcademicYear.findById(academicYear);

    if (!academicYearFound) {
        const error = new Error('Year group not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await YearGroup.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Year group already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedYearGroup = await YearGroup.findByIdAndUpdate(req.params.id, 
        { name, academicYear, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedYearGroup
    });
});

exports.deleteYearGroup = AsyncHandler(async (req, res, next) => {
    const yearGroup = await YearGroup.findById(req.params.id);

    if (!yearGroup) {
        const error = new Error('Year group not found!');
        error.statusCode = 404;
        throw error;
    }

    await yearGroup.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});