const AsyncHandler = require('express-async-handler');
const Exam = require('../../model/academic/Exam');
const Teacher = require('../../model/staff/Teacher');

exports.createExam = AsyncHandler(async (req, res, next) => {
    const { name, description, subject, program, academicTerm, duration, examDate, examTime, examType, classLevel, academicYear } = req.body;

    const teacher = await Teacher.findById(req.userId);

    if (!teacher) {
        const error = new Error('Teacher not found!');
        error.statusCode = 404;
        throw error;
    }

    const examExists = await Exam.findOne({ name });

    if (examExists) {
        const error = new Error('Exam already exists!');
        error.statusCode = 409;
        throw error;
    }

    const createdExam = await Exam.create({
        name, description, subject, program, 
        academicTerm, duration, examDate, examTime, 
        examType, classLevel, academicYear,
        createdBy: req.userId
    });

    teacher.examsCreated.push(createdExam._id);
    await teacher.save();

    res.status(200).json({
        status: 'Success',
        data: createdExam
    });
});

exports.getAllExams = AsyncHandler(async (req, res, next) => {
    const exams = await Exam.find().populate({
        path: 'questions',
        populate: {
            path: 'createdBy'
        }
    });

    res.status(200).json({
        status: 'Success',
        data: exams
    })
});

exports.getExam = AsyncHandler(async (req, res, next) => {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
        const error = new Error('Exam not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: exam
    });
});

exports.updateExam = AsyncHandler(async (req, res, next) => {
    const { name, description, subject, program, academicTerm, duration, examDate, examTime, examType, classLevel, academicYear } = req.body;

    const subjectFound = await Subject.findById(req.params.id);

    if (!subjectFound) {
        const error = new Error('Subject not found!');
        error.statusCode = 404;
        throw error;
    }

    const examExists = await Exam.findOne({ name });

    if (examExists) {
        const error = new Error('Exam already exists!');
        error.statusCode = 409;
        throw error;
    }


    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, 
        { name, description, subject, program, academicTerm, duration, 
          examDate, examTime, examType, classLevel, academicYear, 
          createdBy: req.userId 
        }, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedExam
    });
});