const hotelierModel = require("./hotelier.model");
const { validateInitHotelier } = require("./hotelier.validation");

module.exports = {
  createHotelier: (hotelier) => {
    hotelier = validateInitHotelier(hotelier);
    return hotelierModel.hotelier.create(hotelier);
  },
};
