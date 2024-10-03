const { coupons } = require('../model');

module.exports = (coupan_code) => {
    const coupon = coupons[coupan_code];
    if (!coupon) return { valid: false, message: "Coupon does not exist." };
    return coupon;
};
