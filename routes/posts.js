const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Post = require('../models/post')
const User = require('../models/user')
const CustomError = require('../helpers/customError');
const authenticationMiddleware = require('./../middlewares/authentication')
const ownerAuthorization = require('./../middlewares/ownerAuthorization')


router.post('/',
    authenticationMiddleware,
    async (req, res, next) => {
        try {
            const { user, title, body, tags } = req.body;
            const userId = new mongoose.Types.ObjectId(user)
            const post = new Post({ user: userId, title, tags, body })
            await post.save()
            res.json(post)
        } catch (err) {
            throw new CustomError(422, "Not loggedIn")
            next(err);
        }
    });

router.get('/', async (req, res, next) => {

    //const posts = await User.find({}).populate('user');
    const posts = await User.find({}).populate({
        path: 'user',
        options: { limit: 10 }
    })
    res.json(posts)

})
router.patch('/:id',
    authenticationMiddleware,
    ownerAuthorization,
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const { title, body } = req.body;
            const postToEdit = await Post.findByIdAndUpdate(
                id,
                { title, body },
                {
                    new: true,
                    runValidators: true,
                    omitUndefined: true
                })
            res.status(200).json(postToEdit)
        }
        catch (err) {
            console.log(error);

        }
    })
router.get('/:userId', async (req, res, next) => {
    try {
        const id = req.params.userId;
        const userId = new mongoose.Types.ObjectId(id)
        const posts = await Post.find({}).filter(post => post.user === userId);

        res.json(posts)
    } catch (err) {
        next(err)
    }

})


module.exports = router;