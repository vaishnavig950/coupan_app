const Joi = require('joi');

const repeatCountConfigSchema = Joi.object({
    user_total: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'User total must be a number.',
            'number.integer': 'User total must be an integer.',
            'number.min': 'User total must be at least 0.',
            'any.required': 'User total is required.',
        }),
    user_daily: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'User daily must be a number.',
            'number.integer': 'User daily must be an integer.',
            'number.min': 'User daily must be at least 0.',
            'any.required': 'User daily is required.',
        }),
    user_weekly: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'User weekly must be a number.',
            'number.integer': 'User weekly must be an integer.',
            'number.min': 'User weekly must be at least 0.',
            'any.required': 'User weekly is required.',
        }),
    global_total: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Global total must be a number.',
            'number.integer': 'Global total must be an integer.',
            'number.min': 'Global total must be at least 0.',
            'any.required': 'Global total is required.',
        }),
});

const addCouponSchema = Joi.object({
    coupan_code: Joi.string()
        .min(1)
        .required()
        .messages({
            'string.base': 'Coupon code must be a string.',
            'string.empty': 'Coupon code is required.',
            'any.required': 'Coupon code is required.',
        }),
    repeat_count_config: repeatCountConfigSchema,
});

module.exports = addCouponSchema;
