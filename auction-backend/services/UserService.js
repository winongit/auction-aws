const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUpUser, verifyUser, signInUser } = require("./CognitoService");

const registerUser = async (user) => {
  console.log("registeruser");
  console.log(user);

  let userAttr = [];
  userAttr.push({
    Name: "email",
    Value: user.email,
  });
  userAttr.push({
    Name: "name",
    Value: user.name,
  });
  userAttr.push({
    Name: "picture",
    Value: user.imgUrl,
  });

  return signUpUser(user.name, user.password, user.email, userAttr);

  let newUser = new User(user);

  let foundUser = await User.findOne({
    email: user.email,
  });

  if (foundUser) throw "User already exist";

  console.log(newUser);
  newUser.password = bcrypt.hashSync(user.password, 10);
  await User.create(newUser);
  newUser.password = undefined;
  return newUser;
};

const signIn = async (user) => {
  try {
    console.log(user);
    let foundUser = await User.findOne({
      email: user.email,
    });
    console.log("before throw");
    if (!foundUser || !foundUser.comparePassword(user.password)) {
      console.log("before throw 1");
      throw "Authentication failed. Invalid user or password.";
    }

    console.log(foundUser.imgUrl);

    return {
      token: jwt.sign(
        {
          email: foundUser.email,
          name: foundUser.name,
          _id: foundUser._id,
          imgUrl: foundUser.imgUrl,
        },
        "SECRET",
        {
          expiresIn: "24h",
        }
      ),
    };
  } catch (err) {
    throw err;
  }
};

const signInWithCognito = async (user) => {
  try {
    let userDetails = signInUser(user.email, user.password);
    return userDetails;
  } catch (err) {
    throw err;
  }
};

const checkEmail = async (email) => {
  let user = await User.findOne({ email: email });
  return user;
};

const verify = async (username, code) => {
  return verifyUser(username, code);
};

module.exports = {
  registerUser,
  signIn,
  checkEmail,
  verify,
  signInWithCognito,
};
