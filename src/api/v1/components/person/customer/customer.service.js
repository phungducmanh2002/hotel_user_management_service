const customerModel = require("./customer.model");
const { validateInitCustomer } = require("./customer.validation");

module.exports = {
  createCustomer: (customer) => {
    customer = validateInitCustomer(customer);
    return customerModel.customer.create(customer);
  },
};
