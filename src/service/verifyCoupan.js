const { coupons } = require('../model');
const moment = require('moment');

module.exports = (coupan_code, userId) => {
    const coupon = coupons[coupan_code];
    if (!coupon) return { valid: false, message: "Coupon does not exist." };

    const { global_counts, user_counts, repeat_count_config } = coupon;
    const { user_total, user_daily, user_weekly, global_total } = repeat_count_config;

    if (global_counts >= global_total) {
        return { valid: false, message: "Global limit reached." };
    }

    const userCount = user_counts[userId] || { total: 0, daily: 0, weekly: 0, last_applied: null };

    if (userCount.total >= user_total) {
        return { valid: false, message: "User total limit reached." };
    }

    const currentDate = moment();

    // Check daily limit
    if (userCount.last_applied) {
        const last_applied_date = moment(userCount.last_applied);
        if (currentDate.startOf('day').diff(last_applied_date.startOf('day'), 'days') === 0) {
            if (userCount.daily >= user_daily) {
                return { valid: false, message: "User daily limit reached." };
            }
        } else {
            // Reset daily count if it's a new day
            userCount.daily = 0;
        }

        // Check weekly limit
        if (currentDate.diff(last_applied_date, 'weeks') === 0) {
            if (userCount.weekly >= user_weekly) {
                return { valid: false, message: "User weekly limit reached." };
            }
        } else {
            // Reset weekly count if it's a new week
            userCount.weekly = 0;
        }
    }

    return { valid: true };
};
