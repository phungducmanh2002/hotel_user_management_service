const express = require("express");
const router = express.Router();
const routerUserNotActive = require("./logined/notActive");
const routerUserActive = require("./logined/active");
const routerUserBlock = require("./logined/block");
const routerUserNotLogin = require("./noLogin/index");
const { bindUser2 } = require("../../middlewares");
const ACCOUNT_STATUS = require("../../constances/enum.account.status");

const SWITCH_ROUTER = (req, res, next) => {
  if (req.user) {
    switch (req.user.accountStatus) {
      case ACCOUNT_STATUS.NOT_ACTIVE: {
        return routerUserNotActive(req, res, next);
      }
      case ACCOUNT_STATUS.ACTIVE: {
        return routerUserActive(req, res, next);
      }
      case ACCOUNT_STATUS.BLOCK: {
        return routerUserBlock(req, res, next);
      }
      default:
        break;
    }
  } else {
    return routerUserNotLogin(req, res, next);
  }
};

router.use("/user", bindUser2, SWITCH_ROUTER);

module.exports = router;
