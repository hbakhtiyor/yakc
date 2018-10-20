'use strict'

const Router = require('koa-router');
const jwt = require('koa-jwt');
const mongoose = require('mongoose');

const PostController = require('../controllers/PostController');

const router = new Router({prefix: '/posts'});
const jwtMiddleware = jwt({secret: process.env.JWT_SECRET})

const postController = new PostController()

router
  .param('id', (id, ctx, next) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.status = 400;
      ctx.body = {message: 'ID should be valid'};
      return;
    }
    return next();
  })
  .get('/', postController.index)
  .post('/', jwtMiddleware, postController.create)
  .get('/:id', postController.show)
  .put('/:id', jwtMiddleware, postController.update)
  .delete('/:id', jwtMiddleware, postController.delete);

module.exports = router;
