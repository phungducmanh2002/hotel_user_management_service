module.exports = {
  validateInitStaff: (staff) => {
    return {
      ...staff,
      idRole: null,
      status: 0,
    };
  },
};
