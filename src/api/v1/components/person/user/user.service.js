const userModel = require("../../person/user/user.model");
const { validateInitUser } = require("../../person/user/user.validation");
const staffService = require("../../person/staff/staff.service");
const customerService = require("../customer/customer.service");
const hotelierService = require("../hotelier/hotelier.service");

const axios = require("axios");
const { gmailService } = require("../../../../../configs/services.config");
const ACCOUNT_STATUS = require("../../../constances/enum.account.status");

module.exports = {
  getAllUser: () => {
    return userModel.user.findAll();
  },
  getUserById: (idUser) => {
    return userModel.user.findByPk(idUser);
  },
  getUserByEmail: (email) => {
    return userModel.user.findOne({ where: { email: email } });
  },
  createUser: (user) => {
    user = validateInitUser(user);
    return userModel.user.create(user);
  },
  createStaff: (staff) => {
    return staffService.createStaff(staff);
  },
  createCustomer: (customer) => {
    return customerService.createCustomer(customer);
  },
  blockUser: (_user) => {
    _user.accountStatus = ACCOUNT_STATUS.BLOCK;
    return _user.save();
  },
  createHotelier: (hotelier) => {
    return hotelierService.createHotelier(hotelier);
  },
  sendMailActivationCode: ({ email, activationCode }) => {
    axios
      .post(gmailService.url, {
        to: email,
        subject: "TÔI GỬI BẠN MÃ KÍCH HOẠT TÀI KHOẢN NHÁ!",
        text: activationCode,
      })
      .then((rsl) => {
        console.log(`Đã gửi mail activation code đến ${email}`);
      })
      .catch((err) => {
        console.log(`Lỗi khi gửi mail activation code đến ${email}`);
      });
  },
  sendMailChangePasswordCode: ({ email, changePassCode }) => {
    axios
      .post(gmailService.url, {
        to: email,
        subject: "TÔI GỬI BẠN MÃ XÁC NHẬN ĐỔI MẬT KHẨU NÈ!",
        text: changePassCode,
      })
      .then((rsl) => {
        console.log(`Đã gửi mail change password code đến ${email}`);
      })
      .catch((err) => {
        console.log(
          `Lỗi khi gửi mail change password code đến ${email}: ${err}`
        );
      });
  },
  sendMailResetPassword: ({ email, newPassword }) => {
    axios
      .post(gmailService.url, {
        to: email,
        subject: "GỬI BẠN MẬT KHẨU MỚI NHÁ!",
        text: newPassword,
      })
      .then((rsl) => {
        console.log(`Đã gửi mail new password code đến ${email}`);
      })
      .catch((err) => {
        console.log(`Lỗi khi gửi mail new password code đến ${email}`);
      });
  },
};
