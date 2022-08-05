const express = require("express");
const { register } = require("../controllers/UserController");
const router = express.Router();

router.post("/auth/register", register);

module.exports = router;
