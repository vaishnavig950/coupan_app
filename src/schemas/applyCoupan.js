const Joi = require('joi');

const applyCoupanSchema = Joi.object({
    coupan_code: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'Coupon code must be a string.',
            'string.empty': 'Coupon code is required.',
            'any.required': 'Coupon code is required.',
        }),
    user_id: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'User ID must be a string.',
            'string.empty': 'User ID is required.',
            'any.required': 'User ID is required.',
        }),
});

module.exports = applyCoupanSchema;
