const express = require("express");
const router = express.Router();
const controllerUser = require("../../../../components/person/user/user.controller"); // @componentsV1/person/user/user.controller.js

router.use("/", (req, res, next) => {
  res.status(200).json({ msg: "Tài khoản chưa được kích hoạt" });
});

module.exports = router;
