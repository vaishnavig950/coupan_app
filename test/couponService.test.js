const couponService = require('../src/service');

describe('Coupon Service', () => {
    beforeEach(() => {
        // Clear coupons before each test
        couponService.coupons = {};
    });

    test('should add a coupon', () => {
        const coupon = couponService.add('TESTCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        expect(coupon.coupan_code).toBe('TESTCODE');
        expect(coupon.repeat_count_config.user_total).toBe(3);
    });

    test('should verify a coupon that exists', () => {
        couponService.add('TESTCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        const result = couponService.verify('TESTCODE', 'user1');
        expect(result.valid).toBe(true);
    });

    test('should not verify a non-existent coupon', () => {
        const result = couponService.verify('NONEXISTENTCODE', 'user1');
        expect(result.valid).toBe(false);
        expect(result.message).toBe("Coupon does not exist.");
    });

    test('should apply a coupon successfully', () => {
        couponService.add('TESTCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        const result = couponService.apply('TESTCODE', 'user1');
        expect(result.message).toBe('Coupon applied successfully.');
    });

    test('should not apply a coupon if user total limit is reached', () => {
        couponService.add('TESTCODE', {
            user_total: 1,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        couponService.apply('TESTCODE', 'user1'); // First apply
        const result = couponService.apply('TESTCODE', 'user1'); // Second apply
        expect(result.valid).toBe(false);
        expect(result.message).toBe("User total limit reached.");
    });

    test('should not apply a coupon if user daily limit is reached', () => {
        couponService.add('DAILYCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        couponService.apply('DAILYCODE', 'user1'); // First apply
        const result = couponService.apply('DAILYCODE', 'user1'); // Second apply on the same day
        expect(result.valid).toBe(false);
        expect(result.message).toBe("User daily limit reached.");
    });

    test('should apply a coupon again on a new day', () => {
        jest.useFakeTimers('modern');
        const mockDate = new Date(2024, 9, 4); // October 4, 2024
        jest.setSystemTime(mockDate);

        couponService.add('DAILYCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 2,
            global_total: 10000
        });

        couponService.apply('DAILYCODE', 'user1'); // First apply

        // Move to the next day
        jest.setSystemTime(new Date(2024, 9, 5)); // October 5, 2024
        const result = couponService.apply('DAILYCODE', 'user1'); // Second apply on the new day

        expect(result.message).toBe('Coupon applied successfully.');
    });

    test('should not apply a coupon if user weekly limit is reached', () => {
        couponService.add('WEEKLYCODE', {
            user_total: 3,
            user_daily: 2,
            user_weekly: 1,
            global_total: 10000
        });

        couponService.apply('WEEKLYCODE', 'user1'); // First apply

        const result = couponService.apply('WEEKLYCODE', 'user1'); // Second apply within the same week
        expect(result.valid).toBe(false);
        expect(result.message).toBe("User weekly limit reached.");
    });

    test('should apply a coupon again on a new week', () => {
        jest.useFakeTimers('modern');
        const mockDate = new Date(2024, 9, 4); // October 4, 2024
        jest.setSystemTime(mockDate);

        couponService.add('WEEKLYCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 1,
            global_total: 10000
        });

        couponService.apply('WEEKLYCODE', 'user1'); // First apply

        // Move to the next week
        jest.setSystemTime(new Date(2024, 9, 11)); // October 11, 2024
        const result = couponService.apply('WEEKLYCODE', 'user1'); // Second apply on the new week

        expect(result.message).toBe('Coupon applied successfully.');
    });
});

describe('Coupon Service - Edge Cases', () => {
    beforeEach(() => {
        // Clear coupons before each test
        couponService.coupons = {};
    });

    test('should apply coupon at the last minute of the daily limit', () => {
        jest.useFakeTimers('modern');
        const mockDate = new Date(2024, 9, 4, 23, 59); // October 4, 2024, 23:59
        jest.setSystemTime(mockDate);

        couponService.add('DAILYCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 2,
            global_total: 10000
        });

        const result1 = couponService.apply('DAILYCODE', 'user1'); // First apply (valid)
        expect(result1.message).toBe('Coupon applied successfully.');

        // Move to the next day
        jest.setSystemTime(new Date(2024, 9, 5, 0, 1)); // October 5, 2024, 00:01
        const result2 = couponService.apply('DAILYCODE', 'user1'); // Apply on a new day (valid)
        expect(result2.message).toBe('Coupon applied successfully.');
    });

    test('should enforce weekly limit after reaching it on the last day of the week', () => {
        jest.useFakeTimers('modern');
        const mockDate = new Date(2024, 9, 4); // October 4, 2024, Friday
        jest.setSystemTime(mockDate);

        couponService.add('WEEKLYCODE', {
            user_total: 3,
            user_daily: 2,
            user_weekly: 1,
            global_total: 10000
        });

        const result1 = couponService.apply('WEEKLYCODE', 'user1'); // First apply (valid)
        expect(result1.message).toBe('Coupon applied successfully.');

        // Move to the next week
        jest.setSystemTime(new Date(2024, 9, 11)); // October 11, 2024, Friday
        const result2 = couponService.apply('WEEKLYCODE', 'user1'); // Second apply (should be valid)
        expect(result2.message).toBe('Coupon applied successfully.');

        // Try to apply again within the same week
        const result3 = couponService.apply('WEEKLYCODE', 'user1'); // Third apply (should fail)
        expect(result3.valid).toBe(false);
        expect(result3.message).toBe("User weekly limit reached.");
    });

    test('should reset daily count after a new day', () => {
        jest.useFakeTimers('modern');
        const mockDate = new Date(2024, 9, 4); // October 4, 2024
        jest.setSystemTime(mockDate);

        couponService.add('DAILYRESETCODE', {
            user_total: 3,
            user_daily: 1,
            user_weekly: 2,
            global_total: 10000
        });

        couponService.apply('DAILYRESETCODE', 'user1'); // First apply

        // Move to the next day
        jest.setSystemTime(new Date(2024, 9, 5)); // October 5, 2024
        const result = couponService.apply('DAILYRESETCODE', 'user1'); // Should be valid again
        expect(result.message).toBe('Coupon applied successfully.');
    });

    test('should enforce global limit correctly', () => {
        couponService.add('GLOBALCODE', {
            user_total: 5,
            user_daily: 5,
            user_weekly: 5,
            global_total: 1 // Set global limit to 1
        });

        const result1 = couponService.apply('GLOBALCODE', 'user1'); // First apply (valid)
        expect(result1.message).toBe('Coupon applied successfully.');

        const result2 = couponService.apply('GLOBALCODE', 'user2'); // Second apply (invalid)
        expect(result2.valid).toBe(false);
        expect(result2.message).toBe("Global limit reached.");
    });

    test('should handle concurrent applications', () => {
        couponService.add('CONCURRENCYCODE', {
            user_total: 3,
            user_daily: 2,
            user_weekly: 2,
            global_total: 10
        });

        // Simulate multiple applications
        const result1 = couponService.apply('CONCURRENCYCODE', 'user1'); // First apply
        expect(result1.message).toBe('Coupon applied successfully.');

        const result2 = couponService.apply('CONCURRENCYCODE', 'user1'); // Second apply
        expect(result2.message).toBe('Coupon applied successfully.');

        const result3 = couponService.apply('CONCURRENCYCODE', 'user1'); // Third apply (should fail)
        expect(result3.valid).toBe(false);
        expect(result3.message).toBe("User daily limit reached.");
    });
});
