const User = require('../models/user');
const CustomError = require('../helpers/customError');
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            throw new CustomError(401, 'no Authorization provided');
        const currentUser = await User.getUserFromToken(token);
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
}