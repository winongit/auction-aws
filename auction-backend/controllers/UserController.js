var userService = require("../services/UserService");

exports.register = async (req, res) => {
  try {
    console.log("registeruser");

    let user = await userService.registerUser(req.body);
    return res.json(user);
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await userService.signIn(req.body);
    console.log("after get user");
    res.json(user);
  } catch (error) {
    console.log("i am error");
    console.log(error);
    res.status(400).send({
      message: error,
    });
  }
};

exports.logInWithCognito = async (req, res) => {
  console.log("I am in login with cognito");
  try {
    const user = await userService.signInWithCognito(req.body);
    console.log("IdToken ", user.AuthenticationResult.IdToken);
    console.log("after get user");

    res.json({ token: user.AuthenticationResult.IdToken });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error,
    });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    let { email } = req.params;
    let user = await userService.checkEmail(email);
    return res.json(user);
  } catch (err) {
    return {
      message: err,
    };
  }
};

module.exports.uploadPhoto = (req, res) => {
  try {
    console.log(req.file);
    let fileurl = req.file.url.split("?")[0];
    console.log(fileurl);
    res.status(200).json({ filename: fileurl });
  } catch (err) {
    console.log(err);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    let { username, code } = req.body;
    console.log(username);
    console.log(code);
    let user = await userService.verify(username, code);
    console.log(user);
    return res.json(user);
  } catch (err) {
    return {
      message: err,
    };
  }
};
