const AsyncHandler = require('express-async-handler');
const Question = require('../../model/academic/Question');
const Exam = require('../../model/academic/Exam');
const Teacher = require('../../model/staff/Teacher');

exports.createQuestion = AsyncHandler(async (req, res, next) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer }  = req.body;

    const examId = req.params.examId;

    const exam = await Exam.findById(examId);

    if (!exam) {
        const error = new Error('Exam not found!');
        error.statusCode = 404;
        throw error;
    }

    const questionExists = await Question.findOne({ question });

    if (questionExists) {
        const error = new Error('Question already exists!');
        error.statusCode = 404;
        throw error;
    }


    const createdQuestion = await Question.create({
        question, optionA, optionB, optionC,  optionD, correctAnswer, createdBy: req.userId
    });

    exam.questions.pust(createdQuestion._id);
    await exam.save();

    res.status(201).json({
        status: 'Success',
        data: createdQuestion
    });
});

exports.getAllQuestions = AsyncHandler(async (req, res, next) => {
    const questions = await Question.find();

    res.status(200).json({
        status: 'Success',
        data: questions
    });
});

exports.getQuestion = AsyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        const error = new Error('Question not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: question
    });
});

exports.updateQuestion = AsyncHandler(async (req, res, next) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer }  = req.body;

    const questionFound = await Question.findById(req.params.id);

    if (!questionFound) {
        const error = new Error('Question not found!');
        error.statusCode = 404;
        throw error;
    }

    const foundWithSameName = await Question.findOne({ question });

    if (foundWithSameName) {
        const error = new Error('Question already exists!');
        error.statusCode = 409;
        throw error;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, 
        { question, optionA, optionB, optionC, optionD, correctAnswer, createdBy: req.userId }, 
        { new: true }
    );

    res.status(200).json({
        status: 'Success',
        data: updatedQuestion
    });
});
