// thanks https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35

const GraphQLServer = require("./server.js");

GraphQLServer.listen(3000, () => {
  console.log(`GraphQL Server listening on port 3000`);
});
