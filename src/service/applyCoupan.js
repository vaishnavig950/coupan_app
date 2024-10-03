const moment = require('moment');
const verify = require('./verifyCoupan');
const { coupons } = require('../model');

module.exports = (coupan_code, user_id) => {
    const validation = verify(coupan_code, user_id);
    if (!validation.valid) return validation;

    const coupon = coupons[coupan_code];
    coupon.global_counts += 1;

    if (!coupon.user_counts[user_id]) {
        coupon.user_counts[user_id] = { total: 0, daily: 0, weekly: 0, last_applied: moment() };
    }

    const userCount = coupon.user_counts[user_id];
    const currentDate = moment();

    // Reset daily if the date has changed
    if (userCount.last_applied && currentDate.startOf('day').diff(moment(userCount.last_applied).startOf('day'), 'days') !== 0) {
        userCount.daily = 0;
    }

    // Reset weekly if a new week has started
    if (userCount.last_applied && currentDate.diff(moment(userCount.last_applied), 'weeks') !== 0) {
        userCount.weekly = 0;
    }

    userCount.total += 1;
    userCount.daily += 1;
    userCount.weekly += 1;

    // Update last applied date to the current date
    userCount.last_applied = currentDate;

    return { message: "Coupon applied successfully." };
};
