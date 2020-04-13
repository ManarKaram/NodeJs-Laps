const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');

const saltSound = 7;
//const jwtSecret = "MySecret";

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 15
    },
    age: {
        type: Number,
        required: false,
        min: 13

    }

}, {
    timestamps: true,

    toJSON: {
        virtuals: true

    }
})


// await sign({ userId: "13456" },
//     'MySecretKey',
//     { expiresIn: '10m' });
// .then((token) => {

// })
// .catch(err => {
//     console.error(err)
// })
// await verify(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMzQ1NiIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.-yZEVjwKj5-Gi4pyOuFpN0pXhfQjkVn3eFod9ndxTXo",
//     'MySecret')
//.then(data => {
//     console.log(data)
// }).catch(err => {
//     console.error(err)
// })
UserSchema.methods.generateToken = function (expiresIn = '30m') {
    const userInstace = this;
    return sign({ userId: userInstace.id }, jwtSecret, { expiresIn })
}

UserSchema.pre('save', async function () {
    const userInstace = this;
    if (this.isModified('password')) {
        userInstace.password = await bcrypt.hash(userInstace.password, saltSound)
    }
})

UserSchema.statics.getUserFromToken = async function (token) {
    const User = this;
    const payload = await verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(payload.userId);
    if (!currentUser) throw new Error("User not found !!")
    return currentUser
}

//methods on instance of User 
UserSchema.methods.comparePassword = async function (plainPassword) {
    const userInstace = this;
    return bcrypt.compare(plainPassword, userInstace.password)
}
//m3a el populate
UserSchema.virtual('posts',
    {
        ref: 'Post',
        localField: '_id',
        //m3a el ref ele fl posts
        foreignField: 'user'
    })

const User = mongoose.model('User', UserSchema);
module.exports = User;
