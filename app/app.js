const express = require('express');
const morgan = require('morgan');

const { globalErrHandler, notFoundErr } = require('../middlewares/globalErrHandler');

const adminRouter = require('../routes/staff/adminRouter');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/admins', adminRouter);

//Error middleware
app.use(notFoundErr);
app.use(globalErrHandler);


module.exports = app;