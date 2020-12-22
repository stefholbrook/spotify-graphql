const express = require("express")
const app = express()
const typeDefs = require("./app/typedefs")
const resolvers = require("./app/resolvers")

const { ApolloServer } = require("apollo-server-express")

// const { router } = require("./api")
//
// app.use("/", router)

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.applyMiddleware({ app })
app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
