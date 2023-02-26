const bcrypt = require('bcryptjs');
const AsyncHandler = require('express-async-handler');

const Admin = require('../../model/Staff/Admin');

exports.registerAdmin = AsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const adminFound = await Admin.findOne({ email });

    if (adminFound) {
        const error = new Error('Admin exists');
        error.statusCode = 409;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({
        status: 'Success',
        data: admin
    });
});

exports.loginAdmin = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: admin
    });
});

exports.getAllAdmins = (req, res, next) => {
    
}

exports.getAdmin = (req, res, next) => {
    
}

exports.updateAdmin = (req, res, next) => {
    
}

exports.deleteAdmin = (req, res, next) => {
    
}

exports.adminSuspendTeacher = (req, res, next) => {
    
}

exports.adminUnSuspendTeacher = (req, res, next) => {
    
}

exports.adminWithdrawTeacher = (req, res, next) => {
    
}

exports.adminUnWithdrawTeacher = (req, res, next) => {
    
}

exports.adminPublishExamResults = (req, res, next) => {
    
}

exports.adminUnPublishExamResults = (req, res, next) => {
    
}
