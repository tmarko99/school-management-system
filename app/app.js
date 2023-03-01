const express = require('express');
const morgan = require('morgan');

const { globalErrHandler, notFoundErr } = require('../middlewares/globalErrHandler');

const adminRouter = require('../routes/staff/adminRouter');
const academicYearRouter = require('../routes/academics/academicYearRouter');
const academicTermRouter = require('../routes/academics/academicTermRouter');
const classLevelRouter = require('../routes/academics/classLevelRouter');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/academic-years', academicYearRouter);
app.use('/api/v1/academic-terms', academicTermRouter);
app.use('/api/v1/class-levels', classLevelRouter);

//Error middleware
app.use(notFoundErr);
app.use(globalErrHandler);


module.exports = app;