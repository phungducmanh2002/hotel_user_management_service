const { LOGIN_TYPE } = require("../../../constances");
const {
  compareStringAndHash,
  generateNumericString,
  hashString,
} = require("../../../helpers");
const userService = require("./user.service");
const {
  validateResendActivationCode,
  validateRequestCreateUser,
  validateParamIdUser,
} = require("./user.validation");
const authConfigs = require("../../../../../configs/jwt.config");
const jwt = require("jsonwebtoken");
const userValidation = require("./user.validation");
const ACCOUNT_STATUS = require("../../../constances/enum.account.status");

module.exports = {
  /**Tạo tài khoản
   * mặc định tạo một customer đi kèm tài khoản
   */
  createUser: [
    /**CREATE USER */
    (req, res, next) => {
      const user = req.body;
      userService
        .createUser(user)
        .then((_user) => {
          if (!_user) {
            res.status(500).json({ message: "Không thể tạo đối tượng user!" });
          }
          /**
           * NEXT
           */
          req.user = _user;
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**CREATE CUSTOMER */
    (req, res, next) => {
      const user = req.user;
      userService
        .createCustomer({})
        .then((_customer) => {
          if (!_customer) {
            res
              .status(500)
              .json({ message: "Không thể tạo đối tượng customer!" });
          }
          user.idCustomer = _customer.id;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          user.destroy();
          res.status(500).json({ message: err.message });
        });
    },
    /**SAVE USER */
    (req, res, next) => {
      const user = req.user;
      user
        .save()
        .then((_user) => {
          res.status(200).json(userValidation.convert2UserResponse(_user));
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
  ],
  /**Đăng kí làm hotelier khi đã tạo tài khoản
   *
   */
  registerHotelier: [
    /**CHECK BIND USER */
    (req, res, next) => {
      const user = req.user;
      if (!user) {
        res.status(500).json({ message: "User not bindding!" });
        return;
      }
      if (user.idHotelier) {
        res.status(400).json({ message: "Tài khoản đã là hotelier!" });
        return;
      }
      next();
    },
    /**CREATE HOTELIER */
    (req, res, next) => {
      const user = req.user;
      userService
        .createHotelier({})
        .then((_hotelier) => {
          if (!_hotelier) {
            throw { message: "Lỗi không biết!" };
          }
          user.idHotelier = _hotelier.id;
          req.hotelier = _hotelier;
          next();
          req;
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**SAVE USER */
    (req, res, next) => {
      const user = req.user;
      const hotelier = req.hotelier;
      user
        .save()
        .then((_user) => {
          if (!_user) {
            throw { message: "Lỗi không biết!" };
          }
          res.status(200).json(_user);
        })
        .catch((err) => {
          hotelier.destroy();
          res.status(500).json({ message: err.message });
          return;
        });
    },
  ],
  /**Tạo tài khoản nhân viên
   * Chỉ có admin mới được phép tạo
   * tài khoản này không có id customer mặc định
   */
  createStaffAccount: [
    /**CREATE USER */
    (req, res, next) => {
      const user = req.body;
      userService
        .createUser(user)
        .then((_user) => {
          if (!_user) {
            throw { message: "Không thể tạo đối tượng user!" };
          }
          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
          return;
        });
    },
    /**CREATE STAFF */
    (req, res, next) => {
      const user = req.user;
      userService
        .createStaff({})
        .then((_staff) => {
          if (!_staff) {
            throw { message: "Lỗi khi truy vấn dữ liệu staff!" };
          }
          user.idStaff = _staff.id;
          user.staff = _staff;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          user.destroy();
          res
            .status(500)
            .json({ message: "Lỗi khi truy vấn dữ liệu staff err!" });
          return;
        });
    },
    /**SAVE USER */
    (req, res, next) => {
      const user = req.user;
      const staff = req.staff;
      user
        .save()
        .then((_user) => {
          res.status(200).json(userValidation.convert2UserResponse(_user));
        })
        .catch((err) => {
          user.destroy();
          staff.destroy();
          res.status(500).json({ message: err.message });
        });
    },
  ],
  /**Đăng nhập cho cả 3 đối tượng customer staff và hotelier
   *
   */
  login: [
    /**KIỂM TRA THÔNG TIN */
    (req, res, next) => {
      const email = req?.body?.email;
      const password = req?.body?.password;
      const loginType = req?.params?.loginType;
      if (!email || !password || !loginType) {
        res.status(400).json({ message: "Cung cấp đủ thông tin bạn nhớ!" });
        return;
      }
      req.account = {
        email,
        password,
        loginType,
      };
      next();
    },
    /**TÌM TÀI KHOẢN TRONG CSDL */
    (req, res, next) => {
      const email = req.account.email;
      userService
        .getUserByEmail(email)
        .then((_user) => {
          if (!_user) {
            res.status(400).json({ message: "User không tồn tại bạn nhớ!" });
          }
          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
          return;
        });
    },
    /**KIỂM TRA TRẠNG THÁI TÀI KHOẢN */
    (req, res, next) => {
      const account = req.account;
      const user = req.user;
      /**Kiểm tra quyền */
      switch (account.loginType) {
        case LOGIN_TYPE.CUSTOMER: {
          if (!user.idCustomer) {
            res.status(403).json({ message: "Bạn không phải customer!" });
            return;
          }
          break;
        }
        case LOGIN_TYPE.HOTELIER: {
          if (!user.idHotelier) {
            res.status(403).json({ message: "Bạn không phải hotelier!" });
            return;
          }
          break;
        }
        case LOGIN_TYPE.STAFF: {
          if (!user.idStaff) {
            res.status(403).json({ message: "Bạn không phải staff!" });
            return;
          }
          break;
        }
        default: {
          res.status(400).json({ message: "Thông tin login không đúng!" });
          return;
        }
      }
      /**Kiểm tra mật khẩu */
      if (!compareStringAndHash(account.password, user.password)) {
        res.status(400).json({ message: "Mật khẩu không đúng!" });
        return;
      }
      next();
    },
    /**CẤP TOKEN */
    (req, res, next) => {
      const user = req.user;
      const accessToken = jwt.sign(
        { id: user.id },
        authConfigs.secret,
        authConfigs.options
      );
      if (!accessToken) {
        res.status(500).json({ message: "Lỗi khi sinh token!" });
        return;
      }
      res.status(200).json({ accessToken: accessToken });
    },
  ],
  /**Gửi mã quên mật khẩu đến gmail người dùng
   * input phải có id user
   * chức năng này không cần đăng nhập
   */
  forgotPassword: [
    /**KIỂM TRA DỮ LIỆU TẢI LÊN (ID USER) */
    (req, res, next) => {
      const idUser = parseInt(req?.params?.idUser);
      if (!idUser) {
        res.status(400).json({ message: "Cung cấp id user đi bạn!" });
        return;
      }
      req.idUser = idUser;
      next();
    },
    /**TRUY VẤN USER TRONG DATABASE */
    (req, res, next) => {
      const idUser = req.idUser;
      userService
        .getUserById(idUser)
        .then((_user) => {
          if (!_user) {
            res.status(400).json({ message: "User không tồn tại bạn nhớ!" });
          }
          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**SINH MÃ QUÊN MẬT KHẨU VÀ SAVE USER */
    (req, res, next) => {
      const user = req.user;
      user.changePassCode = generateNumericString(5);
      user
        .save()
        .then((_user) => {
          if (!_user) {
            res.status(500).json({ message: "Lưu user thất bại bạn nhớ!" });
          }
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
          return;
        });
    },
    /**GỬI MAIL */
    (req, res, next) => {
      const user = req.user;
      const email = user.email;
      const code = user.changePassCode;
      userService.sendMailChangePasswordCode({
        email: email,
        changePassCode: code,
      });
      res.status(200).json({
        message: "Đã gửi mã xác nhận đổi mật khẩu đến email của bạn rồi nhó!",
      });
      return;
    },
  ],
  /**Đổi mật khẩu và gửi nó đến email của người dùng
   * input phải có id user và mã code
   * Chức năng này không cần đăng nhập
   */
  forgotPassword2: [
    /**KIỂM TRA TỒN TẠI ID USER VÀ MÃ KÍCH HOẠT */
    (req, res, next) => {
      const idUser = parseInt(req?.params?.idUser);
      const code = req?.body?.code;
      if (!idUser || !code) {
        res
          .status(400)
          .json({ message: "Vui lòng cung cấp id user và code bạn nhó!" });
        return;
      }
      req.idUser = idUser;
      req.code = code;
      next();
    },
    /**TRUY VẤN USER VÀ ĐỐI CHIẾU MÃ */
    (req, res, next) => {
      const idUser = req.idUser;
      const code = req.code;

      userService
        .getUserById(idUser)
        .then((_user) => {
          if (!_user) {
            res.status(500).json({ message: "User không tồn tại bạn nhớ!" });
          }
          if (_user.changePassCode != code) {
            throw { code: 400, message: "Mã không đúng bạn ơi!" };
          }
          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**ĐỔI MẬT KHẨU VÀ SEND MAIL */
    (req, res, next) => {
      const user = req.user;
      const newPassword = generateNumericString(5);
      user.password = hashString(newPassword);
      user
        .save()
        .then((_user) => {
          userService.sendMailResetPassword({
            email: _user.email,
            newPassword: newPassword,
          });
          res
            .status(200)
            .json({ message: "Mật khẩu đã được gửi đến email của bạn!" });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
  ],
  /**Kích hoạt tài khoản mới tạo
   * Tài khoản mặc định khi khởi tạo ở trạng thái chưa kích hoạt
   * input id user và mã code
   */
  activeAccount: [
    /**KIỂM TRA ID USER VÀ CODE*/
    (req, res, next) => {
      const idUser = parseInt(req?.params?.idUser);
      const code = req?.body?.code;
      if (!idUser || !code) {
        res.status(400).json({ message: "Cung cấp đầy đủ thông tin bạn nhó!" });
        return;
      }
      req.idUser = idUser;
      req.code = code;
      next();
    },
    /**TRUY VẤN USER VÀ SO SÁNH CODE*/
    (req, res, next) => {
      const idUser = req.idUser;
      const code = req.code;
      userService
        .getUserById(idUser)
        .then((_user) => {
          if (!_user) {
            res.status(400).json({ message: "User Không tồn tại bạn nhé!" });
          }
          if (_user.activationCode != code) {
            res
              .status(400)
              .json({ message: "Bạn nhập sai mã kích hoạt rồi nha!" });
            return;
          }

          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**CẬP NHẬT TRẠNG THÁI VÀ SAVE USER*/
    (req, res, next) => {
      const user = req.user;
      user.accountStatus = 1;
      user.activationCode = null;
      user
        .save()
        .then((_user) => {
          if (!_user) {
            res
              .status(500)
              .json({ message: "Lỗi cập nhật trạng thái tài khoản bạn nhó!" });
          }
          res.status(200).json(userValidation.convert2UserResponse(_user));
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
  ],
  /**Gửi mã code kích hoạt tài khoản đến gmail của người dùng
   * input id user
   */
  sendActivationCode: [
    /**KIỂM TRA ID USER */
    (req, res, next) => {
      const idUser = parseInt(req.params.idUser);
      if (!idUser) {
        res.status(400).json({ message: "Id user không hợp lệ!" });
        return;
      }
      req.idUser = idUser;
      /**
       * NEXT
       */
      next();
    },
    /**TRUY VẤN USER */
    (req, res, next) => {
      const idUser = req.idUser;
      userService
        .getUserById(idUser)
        .then((_user) => {
          if (!_user) {
            res
              .status(500)
              .json({ message: "Tài khoản không tồn tại bạn nhó!" });
          }
          req.user = _user;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**KIỂM TRA TRẠNG THÁI USER VÀ GỦI MAIL  */
    (req, res, next) => {
      const user = req.user;
      if (user.accountStatus != 0) {
        res
          .status(400)
          .json({ message: "Tài khoản này đã kích hoạt rồi bạn nhó!" });
        return;
      }

      if (!user.activationCode) {
        res
          .status(500)
          .json({ message: "Tài khoản không có mã kích hoạt!!!! ố ồ" });
        return;
      }
      /**
       * NEXT
       */
      next();
    },
    /**GỬI MAIL */
    (req, res, next) => {
      const user = req.user;
      const email = user.email;
      const activationCode = user.activationCode;
      userService.sendMailActivationCode({
        email: email,
        activationCode: activationCode,
      });
      res
        .status(200)
        .json({ message: "Mã kích hoạt đã được gửi đến tài khoản bạn nhó!" });
    },
  ],
  /**Lấy thông tin user
   * Chức năng này không cần đăng nhập
   */
  userInfo: [
    /**VALIDATE */
    (req, res, next) => {
      const idUser = parseInt(req.params.idUser);
      if (!idUser) {
        res.status(400).json({ message: "Vui lòng cung cấp đủ thông tin!" });
        return;
      }
      req.idUser = idUser;
      /**
       * NEXT
       */
      next();
    },
    /**GET USER */
    (req, res, next) => {
      userService
        .getUserById(req.idUser)
        .then((_user) => {
          if (!_user) {
            res.status(400).json({ message: "User không tồn tại!" });
            return;
          }
          /**Trả về user với các thông tin cho phép hiển thị */
          res.status(200).json(userValidation.convert2UserResponse(_user));
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
          return;
        });
    },
  ],
  /**Lấy thông tin all user
   * Chức năng này không cần đăng nhập
   */
  getAllUser: [
    /**GET ALL USER */
    (req, res, next) => {
      userService
        .getAllUser()
        .then((_users) => {
          if (!_users) {
            res.status(200).json([]);
            return;
          }
          req.users = _users;
          /**
           * NEXT
           */
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**HIDE THÔNG TIN QUAN TRỌNG VÀ GỬI VỀ CLIENT */
    (req, res, next) => {
      const users = req.users;
      for (let i = 0; i < users.length; i++) {
        users[i] = userValidation.convert2UserResponse(users[i]);
      }
      res.status(200).json(users);
    },
  ],
  blockAccount: [
    /**Kiểm tra id tài khoản */
    (req, res, next) => {
      const idUser = parseInt(req?.params?.idUser);
      if (!idUser) {
        res.status(400).json({ message: "Cung cấp id user đi bạn!" });
        return;
      }
      if (idUser == req.user.id) {
        res
          .status(400)
          .json({ message: "Không thể tự block tài khoản của mình!" });
        return;
      }
      req.idUser = idUser;
      next();
    },
    /**Truy vấn tài khoản */
    (req, res, next) => {
      userService
        .getUserById(req.idUser)
        .then((_user) => {
          if (!_user) {
            res.status(400).json({ message: "Không tìm thấy user!" });
            return;
          }
          req.user = _user;
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
    /**Thay đổi trạng thái tài khoản */
    (req, res, next) => {
      userService
        .blockUser(req.user)
        .then((_user) => {
          if (!_user) {
            res
              .status(400)
              .json({ message: "khi lưu user thì user không tồn tại!" });
            return;
          }
          res.status(200).json(userValidation.convert2UserResponse(_user));
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    },
  ],
};
