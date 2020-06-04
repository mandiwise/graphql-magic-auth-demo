import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { SDKError as MagicSDKError } from "@magic-sdk/admin";
import express from "express";

import magic from "./config/magic";
import permissions from "./graphql/permissions";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

/* Express */

const port = process.env.PORT;
const app = express();

app.set("views");
app.set("view engine", "ejs");

app.get("/login", function (req, res) {
  res.render("login", {
    MAGIC_PUBLISHABLE_KEY: process.env.MAGIC_PUBLISHABLE_KEY
  });
});

/* Magic Link Middleware */

const didtCheck = function (req, res, next) {
  if (!!req.headers.authorization) {
    try {
      const didToken = magic.utils.parseAuthorizationHeader(
        req.headers.authorization
      );
      magic.token.validate(didToken);

      req.user = {
        issuer: magic.token.getIssuer(didToken),
        publicAddress: magic.token.getPublicAddress(didToken),
        claim: magic.token.decode(didToken)[1]
      };
    } catch (error) {
      res.status(401).send();

      return error instanceof MagicSDKError
        ? next(error)
        : next({ message: "Invalid DID token" });
    }
  }

  next();
};

app.use(didtCheck);

/* Apollo Server */

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: ({ req }) => {
    const user = req.user || null;
    return { user };
  }
});

server.applyMiddleware({ app });

/* Kick it off... */

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
