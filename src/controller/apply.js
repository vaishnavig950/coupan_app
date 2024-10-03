const service = require('../service');

const applyCoupon = (req, res) => {
    const { coupan_code, user_id } = req.body;
    const result = service.apply(coupan_code, user_id);
    res.json(result);
};

module.exports = applyCoupon;