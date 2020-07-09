const express = require("express");
const router = express.Router();
const auth = require("../Controller/auth");
const verifyAuth = require("../Controller/auth-controller/auth-controler");

router.post("/user/signup", auth.signup);
router.post("/user/login", auth.login);
router.post("/user/forgot", auth.forgotSend);
router.post("/user/forgot/:id", auth.forgetValidate);
router.post("/user/location", verifyAuth, auth.setLat);

router.get("/user/logout", verifyAuth, auth.logout);
router.get("/user", verifyAuth, auth.user);
router.get("/user/distance", verifyAuth, auth.caclDist);

module.exports = router;
