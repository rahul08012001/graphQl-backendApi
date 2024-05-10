const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/userSchema");
const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const resolvers = require("./controller/createUser");
const websocket=require("websocket");
const http = require('http');
const cors = require('cors')
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  app.use(cors())
  const httpServer = createServer(app);

  server.applyMiddleware({ app });

  mongoose
    .connect("mongodb://localhost:27017/graph")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`
    );

    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema: server.schema,

        onConnect: (connectionParams,websocket, context) => {
          console.log(`WebSocket connected!: ${websocket}`);
        },
        onDisconnect: (websocket) => {
          console.log(`WebSocket disconnected! :${websocket}`);
        },
      },
      {
        server: httpServer,
        path: server.graphqlPath,
      }
    );
    console.log(
      `WebSocket server ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
 
  });
}

startServer().catch((error) => console.error(error));


