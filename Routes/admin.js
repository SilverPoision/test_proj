const express = require("express");
const router = express.Router();
const admin = require("../Controller/admin");
const verifyAuth = require("../Controller/auth-controller/admin-auth-cont");

router.get("/admin/getusers", verifyAuth, admin.readUser);

module.exports = router;
