import { AuthenticationError } from "apollo-server-express";
import magic from "../config/magic";
import users from "../config/users";

const resolvers = {
  Query: {
    user(root, { id }, context, info) {
      return users.findOne({ issuer: id });
    },
    users(root, args, context, info) {
      return users.find({});
    }
  }
};

export default resolvers;
