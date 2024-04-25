const express = require("express");
const router = express.Router();
const controllerUser = require("../../../components/person/user/user.controller");

/**PASS */
/**Tạo tài khoản khách hàng */
router.post(
  "/register",
  express.urlencoded({ extended: false }),
  express.json(),
  controllerUser.createUser
);

/**PASS */
/**Đăng nhập cho cả 3 đối tượng */
router.post(
  "/login/:loginType",
  express.urlencoded({ extended: false }),
  express.json(),
  controllerUser.login
);

/**PASS */
/**Kích hoạt tài khoản mới tạo */
router.put(
  "/active-account/:idUser", //
  express.urlencoded({ extended: false }),
  express.json(),
  controllerUser.activeAccount
);

/**PASS */
/**Request gửi mã code kích hoạt tài khoản đến email người dùng */
router.put(
  "/send-activation-code/:idUser",
  //
  controllerUser.sendActivationCode
);

/**PASS */
/**Yêu cầu gửi mã code xác nhận reset mật khẩu đến gmail */
router.put(
  "/forgot-password/:idUser",
  //
  controllerUser.forgotPassword
);

/**PASS */
/**Yêu cầu đổi mật khẩu với mã code ở trên */
router.put(
  "/forgot-password-2/:idUser",
  express.urlencoded({ extended: false }),
  express.json(),
  controllerUser.forgotPassword2
);

module.exports = router;
