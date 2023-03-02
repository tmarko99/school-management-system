const Teacher = require('../model/staff/Teacher');

module.exports = async (req, res, next) => {
    const teacherId = req.userId;
    const teacher = await Teacher.findById(teacherId);
    
    if (teacher && teacher.role === 'teacher') {
        next();
    } else {
        const error = new Error('Access Denied.');
        error.statusCode = 403;
        next(error);
    }
}