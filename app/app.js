const express = require('express');
const morgan = require('morgan');

const { globalErrHandler, notFoundErr } = require('../middlewares/globalErrHandler');

const adminRouter = require('../routes/staff/adminRouter');
const teacherRouter = require('../routes/staff/teacherRouter');

const studentRouter = require('../routes/student/studentRouter');

const academicYearRouter = require('../routes/academics/academicYearRouter');
const academicTermRouter = require('../routes/academics/academicTermRouter');
const classLevelRouter = require('../routes/academics/classLevelRouter');
const programRouter = require('../routes/academics/programRouter');
const subjectRouter = require('../routes/academics/subjectRouter');
const yearGroupRouter = require('../routes/academics/yearGroupRouter');
const examRouter = require('../routes/academics/examRouter');
const questionRouter = require('../routes/academics/questionRouter');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/academic-years', academicYearRouter);
app.use('/api/v1/academic-terms', academicTermRouter);
app.use('/api/v1/class-levels', classLevelRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/year-groups', yearGroupRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/questions', questionRouter);

//Error middleware
app.use(notFoundErr);
app.use(globalErrHandler);


module.exports = app;