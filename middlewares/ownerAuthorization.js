const Post = require('../models/post')
const CustomError = require('../helpers/customError');
module.exports = async (req, res, next) => {
    try {
        const { params: { id: postId }, user: { id: userId } } = req;

        const post = await Post.findById(postId);
        if (!post.user.equals(userId)) {
            const err = new CustomError(403, "Not Authorized");
            err.statusCode = 403;
            throw err;
        }
        next();
    } catch (err) {
        next(err)
    }

}