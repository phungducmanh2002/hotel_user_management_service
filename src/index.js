const express = require("express");
const router = express.Router();
const routerV1 = require("./api/v1/routers/index");
require("./api/v1/components/modelConnections");

router.use(routerV1);

module.exports = router;
