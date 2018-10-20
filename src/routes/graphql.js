'use strict'

const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const GraphQLSchema = require('../schema/graphql');

const router = new Router();

router.all('/graphql', graphqlHTTP({
  schema: GraphQLSchema,
  graphiql: process.env.NODE_ENV !== 'production'
}));

module.exports = router;
