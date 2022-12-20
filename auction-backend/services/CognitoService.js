const AWS = require("aws-sdk");
const crypto = require("crypto");

require("dotenv").config();
const secretHash = process.env.AWS_COGNITO_CLIENT_SECRET;

const config = {
  region: process.env.AWS_REGION,
};

const cognitoIdentiy = new AWS.CognitoIdentityServiceProvider(config);

async function signUpUser(username, password, email, userAttributes) {
  const params = {
    SecretHash: getSecretHash(username),
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,

    Username: username,
    Password: password,
    UserAttributes: userAttributes,
  };
  console.log(params);

  try {
    const data = await cognitoIdentiy.signUp(params).promise();
    console.log(data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function verifyUser(username, code) {
  const params = {
    SecretHash: getSecretHash(username),
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    const data = await cognitoIdentiy.confirmSignUp(params).promise();
    console.log(data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function signInUser(username, password) {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: getSecretHash(username),
    },
  };

  try {
    const data = await cognitoIdentiy.initiateAuth(params).promise();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getSecretHash(username) {
  return crypto
    .createHmac("SHA256", secretHash)
    .update(username + process.env.AWS_COGNITO_CLIENT_ID)
    .digest("base64");
}

module.exports = {
  signUpUser,
  verifyUser,
  signInUser,
};
