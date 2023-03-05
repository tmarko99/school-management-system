const AsyncHandler = require('express-async-handler');
const generateToken = require('../../utils/generateToken');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');

const Student = require('../../model/academic/Student');
const Admin = require('../../model/staff/Admin');
const Exam = require('../../model/academic/Exam');
const ExamResult = require('../../model/academic/ExamResult');

exports.registerStudent = AsyncHandler(async (req, res, next) => {
    const { name, email, password, classLevel, academicYear, program } = req.body;

    const admin = await Admin.findById(req.userId);

    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }

    const studentFound = await Student.findOne({ email });

    if (studentFound) {
        const error = new Error('Student already exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const student = await Student.create({ name, email, classLevel, academicYear, program, password: hashedPassword });

    admin.students.push(student._id);
    await admin.save();

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
    // const students = await Student.find().select('-password -createdAt -updatedAt');

    // res.status(200).json({
    //     status: 'Success',
    //     data: students
    // })
    res.status(200).json(res.results);
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
        .select('-password -createdAt -updatedAt')
        .populate('examResult');

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    const studentProfile = {
        name: student.name,
        email: student.email,
        currentClassLevel: student.currentClassLevel,
        program: student.program,
        dateAdmitted: student.dateAdmitted,
        isSuspended: student.isSuspended,
        isWithdrawn: student.isWithdrawn,
        studentId: student.studentId,
        prefectName: student.prefectName
    }

    const examResults = student.examResults;
    const currentExamResult = examResults[examResults.length - 1];
    const isPublished = currentExamResult.isPublished;

    res.status(200).json({
        status: 'Success',
        data: {
            studentProfile,
            currentExamResult: isPublished ? currentExamResult : []
        }
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
    const { program, classLevels, academicYear, name, email, prefectName, isSuspended, isWithdrawn } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    
    const updatedStudent = await Student.findByIdAndUpdate(studentId, 
        { 
            $set: {
                program, academicYear, name, email, prefectName, isSuspended, isWithdrawn
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

exports.writeExam = AsyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.userId);

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    const exam = await Exam.findById(req.params.examId)
        .populate('questions')
        .populate('academicTerm');

    if (!exam) {
        const error = new Error('Exam not found!');
        error.statusCode = 404;
        throw error;
    }

    const questions = exam.questions;

    const answers = req.body.answers;

    // if (answers.length !== questions.length) {
    //     const error = new Error('You have not answered all the questions!');
    //     error.statusCode = 400;
    //     throw error;
    // }
 
    const studentFoundInResults = await ExamResult.findOne({ student: student._id });

    if (studentFoundInResults) {
        const error = new Error('You have already written this exam');
        error.statusCode = 404;
        throw error;
    }

    if (student.isSuspended || student.isSuspended) {
        const error = new Error('You are suspended/withdrawn, you cant take this exam');
        error.statusCode = 404;
        throw error;
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let status;
    let remarks;
    let grade = 0;
    let score = 0;
    let answeredQuestions = [];

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        if (question.correctAnswer === answers[i]) {
            correctAnswers++;
            score++;
            question.isCorrect = false;
        } else {
            wrongAnswers++;
        }
    }

    grade = (correctAnswers / questions.length) * 100;
    answeredQuestions = questions.map(question => {
        return {
            question: question.question,
            correctAnswer: question.correctAnswer,
            isCorrect: question.isCorrect
        }
    })

    if (grade > 50) {
        status = 'Pass';
    } else {
        status = 'Fail';
    }

    if (grade >= 80) {
        remarks = 'Excellent';
    } else if (grade >= 70) {
        remarks = 'Very good';
    } else if (grade >= 60) {
        remarks = 'Good';
    } else if (grade >= 50) {
        remarks = 'Fail';
    } else {
        remarks = 'Poor';
    }

    const examResult = await ExamResult.create({
        studentId: student.studentId,
        exam: exam._id,
        grade,
        score,
        remarks,
        classLevel: exam.classLevel,
        academicTerm: exam.academicTerm,
        academicYear: exam.academicYear,
        answeredQuestions
    });

    if (exam.academicTerm.name === '3rd term' && status === 'pass' && student.currentClassLevel === 'Level 100') {
        student.classLevels.push('Level 200');
        student.currentClassLevel = 'Level 200';
    }

    if (exam.academicTerm.name === '3rd term' && status === 'pass' && student.currentClassLevel === 'Level 200') {
        student.classLevels.push('Level 300');
        student.currentClassLevel = 'Level 300';
    }

    if (exam.academicTerm.name === '3rd term' && status === 'pass' && student.currentClassLevel === 'Level 300') {
        student.classLevels.push('Level 400');
        student.currentClassLevel = 'Level 400';
    }

    if (exam.academicTerm.name === '3rd term' && status === 'pass' && student.currentClassLevel === 'Level 400') {
        student.isGraduated = true;
        student.yearGraduated = new Date();
    }

    student.examResults.push(examResult._id);
    await student.save();

    res.status(200).json({
        status: 'Success',
        data: 'You have submited your exam. Check later for the results'
    });

});

