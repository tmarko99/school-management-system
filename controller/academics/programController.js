const AsyncHandler = require('express-async-handler');
const Program = require('../../model/academic/Program');
const Admin = require('../../model/staff/Admin');

exports.createProgram = AsyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const program = await Program.findOne({ name });

    if (program) {
        const error = new Error('Program already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdProgram = await Program.create({
        name, description, createdBy: req.userId
    });

    const admin = await Admin.findById(req.userId);

    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }
    
    admin.programs.push(createdProgram._id);
    await admin.save();
    
    res.status(201).json({
        status: 'Success',
        data: createdProgram
    });
});

exports.getAllPrograms = AsyncHandler(async (req, res, next) => {
    const programs = await Program.find();

    res.status(200).json({
        status: 'Success',
        data: programs
    });
});

exports.getProgram = AsyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program) {
        const error = new Error('Program not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: program
    });
});

exports.updateProgram = AsyncHandler(async (req, res, next) => {
    const { name, description, duration } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
        const error = new Error('Program not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await Program.findOne({ name });

    if (foundWithSameName) {
        const error = new Error('Program already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, 
        { name, description, duration, createdBy: req.userId }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedProgram
    });
});

exports.deleteProgram = AsyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program) {
        const error = new Error('Program not found!');
        error.statusCode = 404;
        throw error;
    }

    await program.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'Success'
    });
});