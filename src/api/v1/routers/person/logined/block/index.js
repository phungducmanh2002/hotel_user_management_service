const express = require("express");
const router = express.Router();

router.use("/", (req, res, next) => {
  res.status(400).json({ message: "Tài khoản của bạn đã bị block!" });
});

module.exports = router;
