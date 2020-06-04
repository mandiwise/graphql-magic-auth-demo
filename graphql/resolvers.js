import { ApolloError, ForbiddenError } from "apollo-server-express";
import magic from "../config/magic";
import users from "../config/users";

const resolvers = {
  User: {
    id(user, args, context, info) {
      return user.issuer;
    }
  },
  Query: {
    user(root, { id }, context, info) {
      return users.findOne({ issuer: id });
    },
    users(root, args, context, info) {
      return users.find({});
    }
  },
  Mutation: {
    async login(root, args, { user }, info) {
      const existingUser = await users.findOne({ issuer: user.issuer });

      if (!existingUser) {
        const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
        const newUser = {
          issuer: user.issuer,
          email: userMetadata.email,
          lastLoginAt: user.claim.iat
        };
        const doc = await users.insert(newUser);

        return { user: doc };
      } else {
        if (user.claim.iat <= user.lastLoginAt) {
          throw new ForbiddenError(
            `Replay attack detected for user ${user.issuer}}`
          );
        }
        const doc = await users.update(
          { issuer: user.issuer },
          { $set: { lastLoginAt: user.claim.iat } },
          { returnUpdatedDocs: true }
        );

        return { user: doc };
      }
    },
    async logout(root, args, { user }, info) {
      try {
        await magic.users.logoutByIssuer(user.issuer);
        return true;
      } catch (error) {
        throw new ApolloError(error.data[0].message);
      }
    }
  }
};

export default resolvers;
