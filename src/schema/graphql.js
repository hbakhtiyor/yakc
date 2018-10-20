const graphqlType = require('graphql/type');

const Post = require('../models/Post');

function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

const postType = new graphqlType.GraphQLObjectType({
  name: 'Post',
  description: 'Blog post',
  fields: {
    _id: {
      // @todo https://github.com/graphql/graphql-js/issues/1518
      type: graphqlType.GraphQLID,
      description: 'The ID of the post',
    },
    title: {
      type: graphqlType.GraphQLString,
      description: 'The title of the post',
    },
    body: {
      type: graphqlType.GraphQLString,
      description: 'The body of the post'
    }
  }
});

const schema = new graphqlType.GraphQLSchema({
  query: new graphqlType.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      posts: {
        type: new graphqlType.GraphQLList(postType),
        args: {
          _id: {
            name: '_id',
            type: graphqlType.GraphQLID
          }
        },
        resolve: (root, {_id}, source, fieldASTs) => {
          const projections = getProjection(fieldASTs);
          const foundItems = new Promise((resolve, reject) => {
            const condition = _id ? {_id} : {};
            Post.find(condition, projections, (err, posts) => {
              err ? reject(err) : resolve(posts);
            })
          });
          return foundItems;
        }
      },
      post: {
        type: postType,
        args: {
          _id: {
            name: '_id',
            type: new graphqlType.GraphQLNonNull(graphqlType.GraphQLID)
          }
        },
        resolve: (root, {_id}, source, fieldASTs) => {
          const projections = getProjection(fieldASTs);
          const foundItem = new Promise((resolve, reject) => {
            Post.findById(_id, projections, (err, post) => {
              err ? reject(err) : resolve(post);
            })
          });
          return foundItem;
        }
      }
    }
  })
});

module.exports = schema;
