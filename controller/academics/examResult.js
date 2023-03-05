const AsyncHandler = require('express-async-handler');
const ExamResult = require('../../model/academic/ExamResult');
const Student = require('../../model/academic/Student');

exports.checkExamResult = AsyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.userId);

    if (!student) {
        const error = new Error('Student not found!');
        error.statusCode = 404;
        throw error;
    }

    const examResult = await ExamResult.findOne({
        studentId: student._id,
        _id: req.params.id
    })
    .populate({
        path: 'exam',
        populate: {
            path: 'questions'
        }
    })
    .populate('classLevel')
    .populate('academicTerm')
    .populate('academicYear');

    if (!examResult) {
        const error = new Error('Exam result not found!');
        error.statusCode = 404;
        throw error;
    }


    if (examResult.isPublished === 'false') {
        const error = new Error('Exam result is not available, check out later!');
        error.statusCode = 400;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: examResult
    });

});

exports.getAllExamResults = AsyncHandler(async (req, res, next) => {
    const examResults = await ExamResult.find().select('exam').populate('exam');

    res.status(200).json({
        status: 'Success',
        data: examResults,
        student
    });
});

exports.adminToggleExamResult = AsyncHandler(async (req, res, next) => {
    const examResult = await ExamResult.findById(req.params.id);

    if (!examResult) {
        const error = new Error('Exam result not found!');
        error.statusCode = 404;
        throw error;
    }

    examResult.isPublished = req.body.publish;
    const updatedExamResult = await examResult.save();


    res.status(200).json({
        status: 'Success',
        data: updatedExamResult
    });
});