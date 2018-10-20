'use strict'

const mongoose = require('mongoose');
const app = require('./src/index');

if (!process.env.JWT_SECRET) {
  console.log('set JWT_SECRET enviroment');
  process.exit();
}
const env = process.env.NODE_ENV || 'dev';
const host = env === 'production' ? 'mongodb' : '127.0.0.1';
mongoose.connect(`mongodb://${host}/blog-${env}`, {useNewUrlParser: true, useFindAndModify: false});

const port = process.env.PORT || 8000;

const server = app.listen(port);
console.log('Server is listening on the port', port);

module.exports = server;
