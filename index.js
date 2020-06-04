import { ApolloServer } from "apollo-server-express";
import express from "express";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

/* Express */

const port = process.env.PORT;
const app = express();

/* Apollo Server */

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

/* Kick it off... */

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
