const service = require('../service');

const addCoupon = (req, res) => {
    const { coupan_code, repeat_count_config } = req.body;
    const coupon = service.add(coupan_code, repeat_count_config);
    res.status(201).json(coupon);
};

module.exports = addCoupon;