const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    mobile: String!
  }

  type RegisterResponse {
    status: Int!
    message: String!
    data: User
  }

  type LoginResponse {
    status: Int!
    message: String!
    data: User
    token: String
  }
  type UpdateResponse {
    status: Int!
    message: String!
    data: User
  }
  type DeleteResponse {
    status: Int!
    message: String!
  }
  type Query {
    users: [User]
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      mobile: String!
    ): RegisterResponse
    updateUser(
      id: ID!
      name: String!
      email: String!
      password: String!
      mobile: String!
    ): UpdateResponse
    loginUser(email: String!, password: String!): LoginResponse
    deleteUser(id: ID!): DeleteResponse!
  }
`;

module.exports = typeDefs;
