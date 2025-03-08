const makeBaseHttpFunction = require("../base/index");

exports.sendEmailVerificationCode = makeBaseHttpFunction(
    "sendEmailVerificationCode",
    (request, response) => {
      response.send("Hello from Firebase!");
    },
);
