module.exports = {
  validateInitCustomer: (customer) => {
    return {
      ...customer,
      status: 0,
    };
  },
};
