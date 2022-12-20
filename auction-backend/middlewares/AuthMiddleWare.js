const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

require("dotenv").config();
const poolRegion = process.env.AWS_REGION;
const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;

let pems = new Map();

const loadJWKs = async () => {
  const url = `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const response = await axios.get(url);
  const keys = response.data.keys;
  for (let i = 0; i < keys.length; i++) {
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems.set(key_id, pem);
  }
};

const setup = async () => {
  await loadJWKs();
};

const verifyCognitoToken = (req, res, next) => {
  console.log("verifyCognitoToken");

  console.log(req.headers);
  if (!req.headers["authorization"]) {
    next({ auth: false, message: "No token provided." });
  }

  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    res.status(401).send({ auth: false, message: "No token provided." });
  }

  console.log("token: ", token);

  const decodedJwt = jwt.decode(token, { complete: true });
  console.log(decodedJwt);

  if (!decodedJwt) {
    res.status(401).send({ auth: false, message: "Not a valid JWT token" });
  }

  const kid = decodedJwt.header.kid;
  console.log("kid: ", kid);

  console.log("pems: ", pems);

  const pem = pems.get(kid);
  console.log("pem: ", pem);

  if (!pem) {
    next({ auth: false, message: "Invalid token" });
    res.status(401).send({ auth: false, message: "Invalid Token!" });
  }

  jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, payload) => {
    if (err) {
      res.status(401).send({ auth: false, message: "Invalid Token!" });
    } else {
      req.user = payload;
      req.user._id = payload.sub;
      req.user.imgUrl = payload.picture;
      console.log("req.user: ", req.user);
      next();
    }
  });
};

module.exports = { verifyCognitoToken, setup };
