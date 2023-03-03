const AsyncHandler = require('express-async-handler');
const generateToken = require('../../utils/generateToken');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');

const Student = require('../../model/academic/Student');


exports.registerStudent = AsyncHandler(async (req, res, next) => {
    const { name, email, password, classLevel, academicYear, program } = req.body;

    const studentFound = await Student.findOne({ email });

    if (studentFound) {
        const error = new Error('Student already exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const student = await Student.create({ name, email, classLevel, academicYear, program, password: hashedPassword });

    res.status(201).json({
        status: 'Success',
        data: student
    });
});

exports.loginStudent = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    const isPasswordValid = isPasswordMatch(password, student.password);

    if (!student || !isPasswordValid) {
        const error = new Error('Invalid login credentials!');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(student._id, student.email);

    res.status(200).json({
        status: 'Success',
        token
    });
});

exports.getAllStudents = AsyncHandler(async (req, res, next) => {
    const students = await Student.find().select('-password -createdAt -updatedAt');

    res.status(200).json({
        status: 'Success',
        data: students
    })
});

exports.getStudent = AsyncHandler(async (req, res, next) => {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: student
    });
});



exports.getStudentProfile = AsyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.userId)
        .select('-password -createdAt -updatedAt');

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: student
    });
});

exports.updateStudentProfile = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const emailExists = await Student.findOne({ email });

    if (emailExists) {
        const error = new Error('This email is taken!');
        error.statusCode = 409;
        throw error;
    }

    let updatedStudent;

    if (password) {
        const hashedPassword = await hashPassword(password);

        updatedStudent = await Student.findByIdAndUpdate(req.userId,
            { email, password: hashedPassword }, 
            { new: true, runValidators: true }
        );
    }

    updatedStudent = await Student.findByIdAndUpdate(req.userId, 
        { email }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedStudent
    });

});

exports.adminUpdateStudentProfile = AsyncHandler(async (req, res, next) => {
    const studentId = req.params.studentId;
    const { program, classLevel, academicYear, name, email, prefectName } = req.body;

    const student = await Teacher.findById(studentId);

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    
    const updatedStudent = await Student.findByIdAndUpdate(studentId, 
        { 
            $set: {
                program, academicYear, name, email, prefectName
            },
            $addToSet: {
                classLevels
            }
        }, 
        { new: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedStudent
    });

});



