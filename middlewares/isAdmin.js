const Admin = require('../model/staff/Admin');

module.exports = async (req, res, next) => {
    const adminId = req.userId;
    const admin = await Admin.findById(adminId);
    
    if (admin && admin.role === 'admin') {
        next();
    } else {
        const error = new Error('Access Denied.');
        error.statusCode = 403;
        next(error);
    }
}