const express = require("express");
const router = express.Router();
const auth = require("../Controller/auth");
const verifyAuth = require("../Controller/auth-controler");

router.post("/user/signup", auth.signup);
router.post("/user/login", auth.login);
router.post("/user/forgot", auth.forgotSend);
router.post("/user/forgot/:id", auth.forgetValidate);

router.get("/user/logout", verifyAuth, auth.logout);
router.get("/user", verifyAuth, auth.user);

module.exports = router;
