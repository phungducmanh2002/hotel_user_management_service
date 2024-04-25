const express = require("express");
const router = express.Router();

router.use("/", (req, res, next) => {
  res.status(200).json({ msg: "COMMON ROUTER" });
});

module.exports = router;
