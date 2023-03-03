const Student = require('../model/academic/Student');

module.exports = async (req, res, next) => {
    const student = await Student.findById(req.userId);
    
    if (student && student.role === 'student') {
        next();
    } else {
        const error = new Error('Access Denied.');
        error.statusCode = 403;
        next(error);
    }
}