const service = require('../service');

const verifyCoupon = (req, res) => {
    const { coupan_code, user_id } = req.body;
    const result = service.verify(coupan_code, user_id);
    res.json(result);
};

module.exports = verifyCoupon;