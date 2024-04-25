const roleModel = require("./role.model");

module.exports = {
  getRoleById: (idRole) => {
    return roleModel.role.findByPk(idRole);
  },
};
