import { gql } from "apollo-server-express";

const typeDefs = gql`
  type AuthPayload {
    user: User
  }

  type User {
    id: ID!
    email: String!
    lastLoginAt: String!
  }

  type Query {
    user(id: ID!): User!
    users: [User]
  }

  type Mutation {
    login: AuthPayload
    logout: Boolean
  }
`;

export default typeDefs;
