const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const publicRouter = require('./public/publicRouter')
const authenticator = require('./auth/authenticator.js');
const authRouter = require('./auth/authRouter.js');
const recipesRouter = require('./recipes/recipesRouter.js')
const usersRouter = require('./users/usersRouter.js')

const server = express();

const fileupload = require("express-fileupload");
server.use(fileupload({ useTempFiles: true }));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: "up" })
});

server.use('/public', publicRouter);
server.use('/api/auth', authRouter);
server.use('/api/recipes', authenticator, recipesRouter) 
server.use('/api/users', authenticator, usersRouter);     

module.exports = server;