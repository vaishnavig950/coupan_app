# Coupon Service

## Overview

This is a simple coupon service that manages coupon codes with repeat count functionality to mitigate fraud. It allows setting limits on how many times a coupon can be used by a user and globally, as well as daily and weekly limits.

## Features

- Add coupon codes with configurable repeat limits:
  - User Total Repeat Count
  - User Daily Repeat Count
  - User Weekly Repeat Count
  - Global Total Repeat Count
- Verify coupon validity against defined limits.
- Apply coupons while enforcing the defined limits.
- Status of a particular coupan and details who used it till now. (Additonal feature)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Navigate to project directory
    ```bash
   cd coupon-service
3. Install the dependencies:
    ```bash
    npm install
4. Start the dev server
    ```bash
    npm start
### Running Tests

To run the test suite, execute the following command in your terminal:

```bash
npm run test
```

## Usage Instructions 
  - If you are using **Linux**, you can access the service at `http://localhost:8080`.
  - If you are using **Windows**, first run `wsl --install` in your command prompt to set up a virtual Linux environment, then reboot your system. After rebooting, run `ipconfig` to identify your IPv4 address (sensitive to your network connection) and access the service at `http://<Your_IPv4_Address>:8080`.


## API Endpoints

### 1. Add Coupon

**Endpoint**: `POST /api/coupons`

**Curl Command**:
```bash
curl -X POST 'http://localhost:8080/api/coupons' \
--header 'Content-Type: application/json' \
--data '{
    "coupan_code": "COUPONCODE",
    "repeat_count_config": {
        "user_total": 3,
        "user_daily": 1,
        "user_weekly": 1,
        "global_total": 10000
    }
}'
```
**Expected Response**:
```json
{
    "coupan_code": "COUPONCODE",
    "repeat_count_config": {
        "user_total": 3,
        "user_daily": 1,
        "user_weekly": 1,
        "global_total": 10000
    },
    "global_counts": 0,
    "user_counts": {}
}
```
### 2. Verify Coupon
**Endpoint**: `POST /api/coupons/verify`

**Curl Command**:

```bash
curl -X POST 'http://localhost:8080/api/coupons/verify' \
--header 'Content-Type: application/json' \
--data '{
    "coupan_code": "COUPONCODE",
    "user_id": "user1"
}'
```
**Expected Response (Valid Coupon)**:

```json
{
    "valid": true
}
```
**Expected Response (Invalid Coupon)**:

```json
{
    "valid": false,
    "message": "Coupon does not exist."
}
```
**Expected Response (Limit Reached)**:

```json
{
    "valid": false,
    "message": "User total limit reached."
}
```
### 3. Apply Coupon
**Endpoint**: `POST /api/coupons/apply`

**Curl Command**:

```bash
curl -X POST 'http://localhost:8080/api/coupons/apply' \
--header 'Content-Type: application/json' \
--data '{
    "coupan_code": "COUPONCODE",
    "user_id": "user1"
}'
```
**Expected Response (Successful Application)**:

```json
{
    "message": "Coupon applied successfully."
}
```
**Expected Response (Limit Reached)**:

```json
{
    "valid": false,
    "message": "User daily limit reached."
}
```
**Expected Response (Global Limit Reached)**:

```json
{
    "valid": false,
    "message": "Global limit reached."
}
```

### 4. Coupan Status
**Endpoint**: `POST /api/coupons/status`

**Curl Command**:

```bash
curl -X POST 'http://localhost:8080/api/coupons/status' \
--header 'Content-Type: application/json' \
--data '{
    "coupan_code": "COUPONCODE"
}'
```
**Expected Response (Status of a particular coupan and it's users)**:

```json
{
    "coupan_code": "COUPONCODE",
    "repeat_count_config": {
        "user_total": 3,
        "user_daily": 1,
        "user_weekly": 1,
        "global_total": 10000
    },
    "global_counts": 3,
    "user_counts": {
        "user3": {
            "total": 1,
            "daily": 1,
            "weekly": 1,
            "last_applied": "2024-10-02T21:22:57.239Z"
        },
        "user2": {
            "total": 1,
            "daily": 1,
            "weekly": 1,
            "last_applied": "2024-10-02T21:23:20.210Z"
        },
        "user1": {
            "total": 1,
            "daily": 1,
            "weekly": 1,
            "last_applied": "2024-10-02T21:23:28.574Z"
        }
    }
}
```

## Trade-offs and Scalability Challenges
[See Trade-offs and Scalability Challenges here](tradoffs.md)

## Additional Tests
[See additional tests suggestions here](additional_test.md)