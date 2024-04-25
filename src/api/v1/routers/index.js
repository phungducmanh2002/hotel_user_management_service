const express = require("express");
const router = express.Router();
const routerUser = require("./person/index");

router.use(routerUser);

module.exports = router;
