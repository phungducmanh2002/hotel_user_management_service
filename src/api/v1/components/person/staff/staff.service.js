const staffModel = require("./staff.model");
const { validateInitStaff } = require("./staff.validation");

module.exports = {
  getRole: (staffId) => {
    return staffModel.staff.findByPk(staffId);
  },
  createStaff: (staff) => {
    staff = validateInitStaff(staff);
    return staffModel.staff.create(staff);
  },
};
