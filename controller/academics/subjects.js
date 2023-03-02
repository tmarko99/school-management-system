const AsyncHandler = require('express-async-handler');
const Subject = require('../../model/academic/Subject');
const AcademicTerm = require('../../model/academic/AcademicTerm');

exports.createSubject = AsyncHandler(async (req, res, next) => {
    const programId = req.params.programId;

    const { name, description, academicTerm } = req.body;

    const program = await Program.findById(programId);

    if (!program) {
        const error = new Error('Program not found!');
        error.statusCode = 404;
        throw error;
    }

    const academicTermFound = await AcademicTerm.findById(academicTerm);

    if (!academicTermFound) {
        const error = new Error('Academic term not found!');
        error.statusCode = 404;
        throw error;
    }

    const subject = await Subject.findOne({ name });

    if (subject) {
        const error = new Error('Subject already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdSubject = await Subject.create({
        name, description, academicTerm, createdBy: req.userId
    });

    program.subjects.push(createdSubject._id);
    await program.save();
    
    res.status(201).json({
        status: 'Success',
        data: createdSubject
    });
});

exports.getAllSubjects = AsyncHandler(async (req, res, next) => {
    const subjects = await Subject.find();

    res.status(200).json({
        status: 'Success',
        data: subjects
    });
});

exports.getSubject = AsyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        const error = new Error('Subject not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: subject
    });
});

exports.updateSubject = AsyncHandler(async (req, res, next) => {
    const { name, description, academicTerm } = req.body;

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        const error = new Error('Subject not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await Subject.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Subject already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, 
        { name, description, academicTerm, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedSubject
    });
});

exports.deleteSubject = AsyncHandler(async (req, res, next) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        const error = new Error('Subject not found!');
        error.statusCode = 404;
        throw error;
    }

    await subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});