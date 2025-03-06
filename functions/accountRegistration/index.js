const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello from Firebase!", {structuredData: true});
  response.send("Hello from Firebase!");
});
