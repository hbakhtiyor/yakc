'use strict'

const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new Router();

router.post('/login', (ctx) => {
  if (ctx.request.body.password === 'password') {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({password: 'password', role: 'admin'}, process.env.JWT_SECRET)
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      message: "Authentication Error"
    };
  }
});

module.exports = router;
