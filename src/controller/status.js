const service = require('../service');

const status = (req, res) => {
    const { coupan_code } = req.body;
    const result = service.status(coupan_code);
    res.json(result);
};

module.exports = status;