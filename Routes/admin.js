const express = require("express");
const router = express.Router();
const admin = require("../Controller/admin");
const verifyAuth = require("../Controller/auth-controller/admin-auth-cont");

router.post("/admin/create", verifyAuth, admin.createUser);
router.post("/admin/edit", verifyAuth, admin.editUser);

router.get("/admin/getusers", verifyAuth, admin.readUser);
router.delete("/admin/delete", verifyAuth, admin.deleteUser);

module.exports = router;
