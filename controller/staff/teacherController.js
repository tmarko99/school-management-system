const AsyncHandler = require('express-async-handler');
const generateToken = require('../../utils/generateToken');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');

const Teacher = require('../../model/staff/Teacher');
const Admin = require('../../model/staff/Admin');

exports.registerTeacher = AsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const admin = await Admin.findById(req.userId);

    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }

    const teacherFound = await Teacher.findOne({ email });

    if (teacherFound) {
        const error = new Error('Teacher already exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const teacher = await Teacher.create({ name, email, password: hashedPassword });

    admin.teachers.push(teacher._id);
    await admin.save();

    res.status(201).json({
        status: 'Success',
        data: teacher
    });
});

exports.loginTeacher = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });

    const isPasswordValid = isPasswordMatch(password, teacher.password);

    if (!teacher || !isPasswordValid) {
        const error = new Error('Invalid login credentials!');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(teacher._id, teacher.email);

    res.status(200).json({
        status: 'Success',
        token
    });
});

exports.getAllTeachers = AsyncHandler(async (req, res, next) => {
    // let teacherQuery = Teacher.find();
    // const currentPage = req.query.page || 1;
    // const perPage = 2;

    // const total = await Teacher.countDocuments();
    // const startIndex = (currentPage - 1) * perPage;
    // const endIndex = currentPage * perPage;

    // if (req.query.name) {
    //     teacherQuery.find({
    //         name: { $regex: req.query.name, $options: 'i' }
    //     });
    // }

    // const pagination = {};

    // if (endIndex < total) {
    //     pagination.next = {
    //         currentPage: currentPage + 1,
    //         perPage
    //     }
    // }

    // if (startIndex > 0) {
    //     pagination.prev = {
    //         currentPage: currentPage - 1,
    //         perPage
    //     }
    // }

    // const teachers = await teacherQuery.find().select('-password')
    //     .skip((currentPage - 1) * perPage)
    //     .limit(perPage);

    // res.status(200).json({
    //     status: 'Success',
    //     data: teachers,
    //     total,
    //     pagination
    // });

    res.status(200).json(res.results);
});

exports.getTeacher = AsyncHandler(async (req, res, next) => {
    const teacherId = req.params.teacherId;

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
        const error = new Error('Teacher not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: teacher
    });
});

exports.getTeacherProfile = AsyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.userId)
        .select('-password -createdAt -updatedAt');

    if (!teacher) {
        const error = new Error('Teacher not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: teacher
    });
});

exports.updateTeacherProfile = AsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const emailExists = await Teacher.findOne({ email });

    if (emailExists) {
        const error = new Error('This email is taken!');
        error.statusCode = 409;
        throw error;
    }

    let updatedTeacher;

    if (password) {
        const hashedPassword = await hashPassword(password);

        updatedTeacher = await Teacher.findByIdAndUpdate(req.userId,
            { name, email, password: hashedPassword }, 
            { new: true, runValidators: true }
        );
    }

    updatedTeacher = await Teacher.findByIdAndUpdate(req.userId, 
        { name, email }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedTeacher
    });

});

exports.adminUpdateTeacherProfile = AsyncHandler(async (req, res, next) => {
    const { program, classLevel, academicYear, subject } = req.body;

    const teacher = await Teacher.findById(req.params.teacherId);

    if (teacher.isWitdrawn) {
        const error = new Error('Action denied, teacher is withdraw');
        error.statusCode = 400;
        throw error;
    }

    if (!teacher) {
        const error = new Error('Teacher not found!');
        error.statusCode = 404;
        throw error;
    }

    if (program) {
        teacher.program = program;
        await teacher.save();
    }

    if (classLevel) {
        teacher.classLevel = classLevel;
        await teacher.save();
    }

    if (academicYear) {
        teacher.academicYear = academicYear;
        await teacher.save();
    }

    if (subject) {
        teacher.subject = subject;
        await teacher.save();
    }

    res.status(200).json({
        status: 'Success',
        data: teacher
    });

});



