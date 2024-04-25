const authConfig = require("../../../configs/jwt.config");
const jwt = require("jsonwebtoken");
const userService = require("../components/person/user/user.service");
const staffService = require("../components/person/staff/staff.service");
const roleService = require("../components/role/role.service");
const { USER_ROLE: ROLE } = require("../../v1/constances");

/**Gán user nếu có nếu không có thì thôi */
const bindUser2 = (req, res, next) => {
  getUserFromToken2(req, res, next);
};

/**Hàm này kiểm tra xem đã bind chưa nếu chưa thì bindUser */
const bindUser3 = (req, res, next) => {
  if (!req.user) {
    getUserFromToken(req, res, next);
    return;
  }
  next();
};

const getUserFromToken2 = (req, res, next) => {
  const accessToken = req.headers["x-access-token"];
  if (accessToken) {
    jwt.verify(
      accessToken,
      authConfig.secret,
      authConfig.options,
      (error, decoded) => {
        if (error) {
          next();
          return;
        }
        const idUser = decoded.id;
        userService
          .getUserById(idUser)
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            next();
          });
      }
    );
  } else {
    next();
  }
};

const isStatus = (status) => {
  return [
    (req, res, next) => {
      if (status != 0 && !status) {
        res.status(500).json({ message: "Vui lòng cung cấp status!" });
        return;
      }
      if (!req.user) {
        req.isBindUser = false;
      } else {
        req.isBindUser = true;
      }
      next();
    },
    (req, res, next) => {
      if (!req.isBindUser) {
        console.log("bind user in another middleware method");
        return bindUser(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      if (!req.user) {
        res.status(500).json({ message: "Không thể tìm thấy user!" });
        return;
      }
      if (status == req.user.accountStatus) {
        next();
        return;
      }
      res.status(400).json({
        message: "Trạng thái tài khoản của bạn không phù hợp với yêu cầu!",
      });
      return;
    },
  ];
};
/**
 * decode lấy id user từ accces token
 */
const getUserFromToken = (req, res, next) => {
  const accessToken = req.headers["x-access-token"];
  if (!accessToken) {
    res.status(400).json({ message: "Vui lòng cung cấp token!" });
    return;
  }
  // decode access token
  jwt.verify(
    accessToken,
    authConfig.secret,
    authConfig.options,
    (error, decoded) => {
      if (error) {
        res.status(401).json({ message: "Lỗi khi decode token!" });
        return;
      }
      const idUser = decoded.id;
      userService
        .getUserById(idUser)
        .then((user) => {
          if (!user) {
            res.status(400).json({ message: "Không tìm thấy user!" });
            return;
          }
          req.user = user;
          next();
        })
        .catch((err) => {
          res.status(500).json({ message: "Lỗi khi truy vấn dữ liệu!" });
          return;
        });
    }
  );
};

/**
 * có idUser trong params để có thể truy vấn user trong csdl
 * Gắn user vào req.user
 */
const bindUser = (req, res, next) => {
  getUserFromToken(req, res, next);
};

/**
 * bind user
 * check idCustomer/ idStaff/ idHotelier
 */
const isRole = (role) => {
  return [
    (req, res, next) => {
      if (!role) {
        res.status(500).json({ message: "Vui lòng cung cấp role!" });
        return;
      }
      if (!req.user) {
        req.isBindUser = false;
      } else {
        req.isBindUser = true;
      }
      next();
    },
    (req, res, next) => {
      if (!req.isBindUser) {
        console.log("bind user in another middleware method");
        return bindUser(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      let notRole = false;
      switch (role) {
        case ROLE.ADMIN: {
          if (!req.user.idStaff) {
            notRole = true;
            break;
          }
          staffService
            .getRole(req.user.idStaff)
            .then((staff) => {
              if (!staff) {
                res.status(500).json({ message: "Lỗi khi truy vấn dữ liệu!" });
                return;
              }
              roleService
                .getRoleById(staff.idRole)
                .then((role) => {
                  if (!role) {
                    res.status(500).json({
                      message:
                        "Lỗi khi truy vấn dữ liệu role (Role không tồn tại!)",
                    });
                    return;
                  }
                  if (role.roleName == "ADMIN") {
                    next();
                  }
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ message: "Lỗi khi truy vấn dữ liệu role!" });
                });
            })
            .catch((err) => {
              res.status(500).json({ message: "Lỗi khi truy vấn dữ liệu!" });
            });
          break;
        }
        case ROLE.STAFF: {
          if (!req.user.idStaff) {
            notRole = true;
            break;
          }
          next();
          break;
        }
        case ROLE.CUSTOMER: {
          if (!req.user.idCustomer) {
            notRole = true;
            break;
          }
          next();
          break;
        }
        case ROLE.HOTELIER: {
          if (!req.user.idHotelier) {
            notRole = true;
            break;
          }
          next();
          break;
        }
        default:
          notRole = true;
          break;
      }
      if (notRole) {
        res.status(403).json({ message: "Bạn không có quyền truy cập!" });
        return;
      }
    },
  ];
};

module.exports = {
  bindUser: bindUser,
  bindUser2: bindUser2,
  bindUser3: bindUser3,
  isRole: isRole,
  isStatus: isStatus,
};
