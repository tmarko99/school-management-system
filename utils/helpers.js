const bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
}

exports.isPasswordMatch = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}