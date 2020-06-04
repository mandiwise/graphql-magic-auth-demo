import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    lastLoginAt: String!
  }

  type Query {
    user(id: ID!): User!
    users: [User]
  }
`;

export default typeDefs;
