const { role } = require("@componentsV1/role/role.model.js");

const { customer } = require("@componentsV1/person/customer/customer.model.js");
const { hotelier } = require("@componentsV1/person/hotelier/hotelier.model.js");
const { staff } = require("@componentsV1/person/staff/staff.model.js");
const { user } = require("../person/user/user.model");
const { resource } = require("../resource/resource.model");

const { instance } = require("@configs/objectMapping.config.js");
const { hashString } = require("../../helpers");
const { GetEnvValueByKey } = require("../../../../projectUtils");

if (GetEnvValueByKey("GENERATE_DB_STRUCT") == "YES") {
  user.sync({ force: true });
  staff.sync({ force: true });
  customer.sync({ force: true });
  hotelier.sync({ force: true });
  role.sync({ force: true });
  resource.sync({ force: true });

  role.hasMany(staff, { foreignKey: "idRole" });
  resource.hasMany(user, { foreignKey: "idResource" });

  staff.hasOne(user, { foreignKey: "idStaff" });
  customer.hasOne(user, { foreignKey: "idCustomer" });
  hotelier.hasOne(user, { foreignKey: "idHotelier" });

  instance.sync({ force: true });
}

if (GetEnvValueByKey("GENERATE_DB_DATA") == "YES") {
  role
    .create({
      roleName: "ADMIN",
    })
    .then((_role) => {
      staff
        .create({
          idRole: _role.id,
          status: 0,
        })
        .then((_staff) => {
          user.create({
            firstName: "Phùng",
            lastName: "Đức Mạnh",
            gender: 0,
            email: "ducmanhphungduc@gmail.com",
            password: hashString("1"),
            accountStatus: 1,
            idStaff: _staff.id,
          });
        });
    });
}
