const jwt = require('jsonwebtoken');

const generateToken = (id, email) => {
    return jwt.sign(
        {
            userId: id.toString(),
            userEmail: email
        }, 
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
    )
}

module.exports = generateToken;