const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../model/user'); // Assuming your schema is defined in schema.js
const resolvers = require('../controller/createUser'); // Assuming your resolvers are defined in resolvers.js

const router = express.Router();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app: router, path: '/graphql' });

module.exports = router;
