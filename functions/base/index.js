const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * Creates a base HTTP function
 * @param {string} name - The name of the function
 * @param {handler} handler - The request handler function
 * @return {function} HTTP function wrapper
 */
function makeBaseHttpFunction(name, handler) {
  const wrappedHandler = (request, response) => {
    logger.info(`Function ${name} is called`);
    return handler(request, response);
  };
  return onRequest(wrappedHandler);
}

module.exports = makeBaseHttpFunction;
