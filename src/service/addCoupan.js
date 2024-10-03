const { coupons, Coupon } = require('../model');

module.exports = (coupan_code, config) => {
    const coupon = new Coupon(coupan_code, config);
    coupons[coupan_code] = coupon;
    return coupon;
};
