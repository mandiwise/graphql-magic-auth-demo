import { rule, shield } from "graphql-shield";

const hasDidToken = rule()((parent, args, { user }, info) => {
  return user !== null;
});

const permissions = shield(
  {
    Query: {
      users: hasDidToken,
      user: hasDidToken
    },
    Mutation: {
      login: hasDidToken,
      logout: hasDidToken
    }
  },
  { debug: process.env.NODE_ENV === "development" }
);

export default permissions;
