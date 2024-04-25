const express = require("express");
const router = express.Router();
const controllerUser = require("../../../../components/person/user/user.controller"); // @componentsV1/person/user/user.controller.js
const {
  isRole,
  bindUser,
  getUserFromToken,
  isStatus,
  bindUser3,
} = require("../../../../middlewares");
const { USER_ROLE: ROLE } = require("../../../../constances");

router.get("/", bindUser, isStatus(2), (req, res, next) => {
  res.json("pass");
});

/**PASS */
/**Đăng kí làm hotelier */
router.put(
  "/register/hotelier", //
  bindUser3,
  controllerUser.registerHotelier
);

/**PASS */
/**Tạo tài khoản staff */
router.post(
  "/create/staff",
  /**isRole cũng bindUser trong đó */
  isRole(ROLE.ADMIN),
  express.urlencoded({ extended: false }),
  express.json(),
  controllerUser.createStaffAccount
);

/**PASS */
/**Lấy thông tin user by id */
router.get("/user-info/:idUser", controllerUser.userInfo);

/**PASS */
/**Lấy thông tin all user */
router.get("/user-info", controllerUser.getAllUser);

/**PASS */
/**Block tài khoản */
router.put(
  "/block-user/:idUser",
  isRole(ROLE.ADMIN),
  controllerUser.blockAccount
);

module.exports = router;
