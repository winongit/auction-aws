const express = require("express");
const router = express.Router();
require("dotenv").config();
const {
  register,
  login,
  checkEmail,
  uploadPhoto,
  verifyUser,
  logInWithCognito,
} = require("../controllers/UserController");
const multer = require("multer");
const path = require("path");
const { fileFilterFunc } = require("../common/UploadPhotosConfig");

const MulterAzureStorage =
  require("multer-azure-blob-storage").MulterAzureStorage;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../assets/pics/user"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffiix = Date.now() + "_" + file.originalname;
//     console.log(uniqueSuffiix);
//     cb(null, uniqueSuffiix);
//   },
// });

const resolveBlobName = (req, file) => {
  return new Promise((resolve, reject) => {
    const blobName = Date.now() + "_" + file.originalname;
    console.log(blobName);
    resolve(blobName);
  });
};

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_CONNECTION_STRING,
  accessKey: process.env.AZURE_ACCESS_KEY,
  accountName: process.env.AZURE_ACCOUNT_NAME,
  containerName: process.env.USER_CONTAINER_NAME,
  blobName: resolveBlobName,
  containerAccessLevel: "blob",
  urlExpirationTime: 0,
});

const upload = multer({
  storage: azureStorage,
  fileFilter: fileFilterFunc,
});

// const upload = multer({ storage: storage, fileFilter: fileFilterFunc });

router.post("/auth/signUp", register);
// router.post("/auth/signIn", login);
router.post("/auth/signIn", logInWithCognito);
router.post("/auth/signInWithCognito", logInWithCognito);
router.get("/checkEmail", checkEmail);
router.post("/upload", upload.single("picture"), uploadPhoto);
router.post("/verifyEmail", verifyUser);

module.exports = router;
