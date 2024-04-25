module.exports = {
  validateInitHotelier: (hotelier) => {
    return {
      ...hotelier,
      status: 0,
    };
  },
};
