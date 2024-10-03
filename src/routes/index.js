const controller = require('../controller');
const middleware = require('../middleware');
const schemas = require('../schemas');

module.exports = (app) => {
    app.get('/', (req, res) => res.json('Hello World'));
    app.post('/api/coupons', middleware.validate(schemas.addCoupan), controller.add);
    app.post('/api/coupons/verify', middleware.validate(schemas.verifyCoupan), controller.verify);
    app.post('/api/coupons/apply', middleware.validate(schemas.applyCoupan), controller.apply);
    app.post('/api/coupons/status', middleware.validate(schemas.coupanStatus), controller.status);
}