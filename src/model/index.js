class Coupon {
    constructor(coupan_code, config) {
        this.coupan_code = coupan_code;
        this.repeat_count_config = config;
        this.global_counts = 0;
        this.user_counts = {};
    }
}

// Using in-memory object to mimic database
const coupons = {};

module.exports = { coupons, Coupon };
