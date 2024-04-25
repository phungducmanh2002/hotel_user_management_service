const { generateNumericString, hashString } = require("../../../helpers");

module.exports = {
  validateInitUser: (user) => {
    if (!user["email"] || !user["password"]) {
      return null;
    }
    return {
      ...user,
      gender: user.gender || 0,
      accountStatus: 0,
      idResource: null,
      idCustomer: null,
      idHotelier: null,
      idStaff: null,
      activationCode: generateNumericString(5),
      changePassCode: null,
      password: hashString(user.password),
    };
  },
  validateResendActivationCode: (user) => {
    if (!user) {
      throw { message: "User không tồn tại!" };
    }
    if (user.accountStatus != 0) {
      throw { message: "Tài khoản đã được kích hoạt trước đó!" };
    }
    if (!user.activationCode) {
      throw { message: "Tài khoản không chứa mã kích hoạt!" };
    }
  },
  validateRequestCreateUser: (req) => {
    const user = req?.body;
    if (!user) {
      throw { message: "Staff data not found!" };
    }
  },
  validateParamIdUser: (req) => {
    const idUser = parseInt(req.params.idUser);
    if (!idUser) throw { message: "vui lòng cung cấp id user!" };
    req.idUser = idUser;
  },
  convert2UserResponse: (user) => {
    user.activationCode = null;
    user.password = null;
    user.changePassCode = null;
    return user;
  },
};
