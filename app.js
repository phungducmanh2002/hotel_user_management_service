const express = require("express");
const app = express();
require("module-alias/register");
const router = require("./src/index");

app.use(router);

module.exports = app;
