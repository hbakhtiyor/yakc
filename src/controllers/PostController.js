'use strict'

const Post = require('../models/Post');

class PostController {
  async index(ctx) {
    try {
      const posts = await Post.find({});
      ctx.body = posts;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  }

  async create(ctx) {
    try {
      const post = new Post(ctx.request.body);
      await post.save();
      ctx.status = 201;
      ctx.body = post;
    } catch (err) {
      if (err.name === 'ValidationError') {
        ctx.status = 422;
        ctx.body = {message: 'Validation Failed'};
        return;
      }
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  }

  async show(ctx) {
    try {
      const post = await Post.findById(ctx.params.id);
      if (!post) {
        ctx.status = 404;
        return;
      }
      ctx.body = post;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  }

  async update(ctx) {
    try {
      const post = await Post.findOneAndUpdate({_id: ctx.params.id}, ctx.request.body, {new: true});
      if (!post) {
        ctx.status = 404;
        return;
      }
      ctx.status = 204;
      ctx.body = post;
    } catch (err) {
      if (err.name === 'ValidationError') {
        ctx.status = 422;
        ctx.body = {message: 'Validation Failed'};
        return;
      }
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  }

  async delete(ctx) {
    try {
      const result = await Post.deleteOne({_id: ctx.params.id});
      if (result.n === 0) {
        ctx.status = 404;
        return;
      }
      ctx.status = 204;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  }
}

module.exports = PostController;
