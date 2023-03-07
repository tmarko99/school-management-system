const AsyncHandler = require('express-async-handler');
const generateToken = require('../../utils/generateToken');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');

const Admin = require('../../model/staff/Admin');

exports.registerAdmin = AsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const adminFound = await Admin.findOne({ email });

    if (adminFound) {
        const error = new Error('Admin exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({
        status: 'Success',
        data: admin
    });
});

exports.loginAdmin = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    const isPasswordValid = isPasswordMatch(password, admin.password);

    if (!admin || !isPasswordValid) {
        const error = new Error('Invalid login credentials!');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(admin._id, admin.email);

    res.status(200).json({
        status: 'Success',
        token
    });
});

exports.getAllAdmins = AsyncHandler(async (req, res, next) => {
    res.status(200).json(res.results);
});

exports.getAdminProfile = AsyncHandler(async (req, res, next) => {
    const adminId = req.userId;

    const admin = await Admin.findById(adminId)
        .select('-password -createdAt -updatedAt')
        .populate('academicYears')
        .populate('academicTerms')
        .populate('programs')
        .populate('yearGroups')
        .populate('teachers')
        .populate('students', '-password')
        .populate('classLevels', '-password');

    if (!admin) {
        const error = new Error('Admin not found!');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        data: admin
    });
});

exports.updateAdmin = AsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const emailExists = await Admin.findOne({ email });

    if (emailExists) {
        const error = new Error('This email is taken!');
        error.statusCode = 409;
        throw error;
    }

    let updatedadmin;

    if (password) {
        const hashedPassword = await hashPassword(password);

        updatedadmin = await Admin.findByIdAndUpdate(req.userId, 
            { name, email, password: hashedPassword }, 
            { new: true, runValidators: true }
        );
    }

    updatedadmin = await Admin.findByIdAndUpdate(req.userId, { name, email }, { new: true, runValidators: true });

    res.status(200).json({
        status: 'Success',
        data: updatedAdmin
    });

});

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
