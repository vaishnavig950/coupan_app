const Joi = require('joi');

const coupanStatusSchema = Joi.object({
    coupan_code: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'Coupon code must be a string.',
            'string.empty': 'Coupon code is required.',
            'any.required': 'Coupon code is required.',
        })
});

module.exports = coupanStatusSchema;