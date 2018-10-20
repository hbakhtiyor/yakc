'use strict'

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const graphqlRouter = require('./routes/graphql');

const app = new Koa();

app.use(bodyParser());

app.use(postsRouter.routes());
app.use(postsRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(graphqlRouter.routes());
app.use(graphqlRouter.allowedMethods());

module.exports = app;
