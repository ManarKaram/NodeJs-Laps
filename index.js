const express = require('express');
require('express-async-errors');
require('dotenv').config()

const port = 3000;

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', usersRouter)
app.use('/posts', postsRouter)


//Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500) {
        res.status(statusCode).json({
            message: "Something went wrong",
            type: "Internal_Server_Error",
            details: []
        });
    }

    res.status(statusCode).json({
        message: err.message,
        type: err.type,
        details: err.details
    })

})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))