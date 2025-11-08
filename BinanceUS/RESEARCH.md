# Binance US API Research

## Balance API Documentation

### Endpoint
```
GET /api/v3/account
```

### Base URL
```
https://api.binance.us
```

### Full URL
```
https://api.binance.us/api/v3/account
```

### Authentication
- **Method:** HMAC SHA256 signature
- **Headers:**
  - `X-MBX-APIKEY`: Your API key
- **Security:** API key and secret required

### Required Parameters
- `timestamp` (LONG): Current millisecond timestamp

### Optional Parameters
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

### Request Weight
10 request weight units

### Data Source
Database

### Response Structure
```json
{
  "makerCommission": 10,
  "takerCommission": 10,
  "buyerCommission": 0,
  "sellerCommission": 0,
  "canTrade": true,
  "canWithdraw": true,
  "canDeposit": true,
  "updateTime": 1234567890,
  "accountType": "SPOT",
  "balances": [
    {
      "asset": "BTC",
      "free": "0.00000000",
      "locked": "0.00000000"
    },
    {
      "asset": "ETH",
      "free": "1.23456789",
      "locked": "0.10000000"
    }
  ],
  "permissions": ["SPOT"]
}
```

### Response Fields
- `balances`: Array of all asset balances
  - `asset`: Asset symbol (e.g., BTC, ETH, USDT)
  - `free`: Available balance for trading/withdrawal
  - `locked`: Balance currently locked in open orders
- `canTrade`: Trading permission status
- `canWithdraw`: Withdrawal permission status
- `canDeposit`: Deposit permission status
- `accountType`: Type of account (SPOT, MARGIN, etc.)

### Key Features
- Returns both free (available) and locked (in orders) balances
- Includes commission rates for maker and taker
- Shows account permissions and status
- API keys can be IP-restricted for enhanced security

### Security Recommendations
1. Never expose API secrets in code or logs
2. Use IP whitelisting when possible
3. Bind IP address to API Key to increase account security
4. Limit API key permissions to what's needed

### Example cURL Request
```bash
curl -X GET "https://api.binance.us/api/v3/account?timestamp=1234567890&signature=YOUR_SIGNATURE" \
  -H "X-MBX-APIKEY: your_api_key"
```

### Official Documentation
- Main Docs: https://docs.binance.us/
- GitHub: https://github.com/binance-us/binance-us-api-docs

---

## Transactions API Documentation

### Overview
Binance US provides multiple endpoints to retrieve transaction history including deposits, withdrawals, and trades. All endpoints require HMAC SHA256 authentication.

---

### 1. Account Trade History

#### Endpoint
```
GET /api/v3/myTrades
```

#### Full URL
```
https://api.binance.us/api/v3/myTrades
```

#### Required Parameters
- `symbol` (STRING): Trading pair (e.g., BTCUSDT)
- `timestamp` (LONG): Current millisecond timestamp

#### Optional Parameters
- `orderId` (LONG): This can only be used in combination with symbol
- `startTime` (LONG): Start timestamp in milliseconds
- `endTime` (LONG): End timestamp in milliseconds
- `fromId` (LONG): TradeId to fetch from
- `limit` (INT): Default 500; max 1000
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

#### Response Structure
```json
[
  {
    "symbol": "BTCUSDT",
    "id": 28457,
    "orderId": 100234,
    "price": "4.00000100",
    "qty": "12.00000000",
    "quoteQty": "48.000012",
    "commission": "10.10000000",
    "commissionAsset": "BTC",
    "time": 1499865549590,
    "isBuyer": true,
    "isMaker": false,
    "isBestMatch": true
  }
]
```

#### Key Features
- Returns completed trades for a specific trading pair
- Data returned in ascending order (oldest first)
- If startTime and endTime are not specified, most recent trades returned

---

### 2. Crypto Deposit History

#### Endpoint
```
GET /sapi/v1/capital/deposit/hisrec
```

#### Full URL
```
https://api.binance.us/sapi/v1/capital/deposit/hisrec
```

#### Required Parameters
- `timestamp` (LONG): Current millisecond timestamp

#### Optional Parameters
- `coin` (STRING): Filter by specific cryptocurrency
- `status` (INT): 0(pending), 6(credited but cannot withdraw), 1(success)
- `startTime` (LONG): Start timestamp in milliseconds
- `endTime` (LONG): End timestamp in milliseconds
- `offset` (INT): Default 0
- `limit` (INT): Default 1000, max 1000
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

#### Response Structure
```json
[
  {
    "amount": "0.00999800",
    "coin": "PAXG",
    "network": "ETH",
    "status": 1,
    "address": "0x788cabe9236ce061e5a892e1a59395a81fc8d62c",
    "addressTag": "",
    "txId": "0xaad4654a3234aa6118af9b4b335f5ae81c360b2394721c019b5d1e75328b09f3",
    "insertTime": 1599621997000,
    "transferType": 0,
    "confirmTimes": "12/12"
  }
]
```

---

### 3. Crypto Withdrawal History

#### Endpoint
```
GET /sapi/v1/capital/withdraw/history
```

#### Full URL
```
https://api.binance.us/sapi/v1/capital/withdraw/history
```

#### Required Parameters
- `timestamp` (LONG): Current millisecond timestamp

#### Optional Parameters
- `coin` (STRING): Filter by specific cryptocurrency
- `withdrawOrderId` (STRING): Filter by withdrawal order ID
- `status` (INT): 0(Email Sent), 1(Cancelled), 2(Awaiting Approval), 3(Rejected), 4(Processing), 5(Failure), 6(Completed)
- `startTime` (LONG): Start timestamp in milliseconds
- `endTime` (LONG): End timestamp in milliseconds
- `offset` (INT): Default 0
- `limit` (INT): Default 1000, max 1000
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

#### Response Structure
```json
[
  {
    "id": "b6ae22b3aa844210a7041aee7589627c",
    "amount": "8.91000000",
    "transactionFee": "0.004",
    "coin": "USDT",
    "status": 6,
    "address": "0x94df8b352de7f46f64b01d3666bf6e936e44ce60",
    "addressTag": "",
    "txId": "0xb5ef8c13b968a406cc62a93a8bd80f9e9a906ef1b3fcf20a2e48573c17659268",
    "applyTime": "2019-10-12 11:12:02",
    "network": "ETH",
    "transferType": 0
  }
]
```

---

### 4. Fiat Deposit/Withdrawal History

#### Endpoint
```
GET /sapi/v1/fiat/orders
```

#### Full URL
```
https://api.binance.us/sapi/v1/fiat/orders
```

#### Required Parameters
- `transactionType` (STRING): "0" for deposit, "1" for withdrawal
- `timestamp` (LONG): Current millisecond timestamp

#### Optional Parameters
- `beginTime` (LONG): Start timestamp in milliseconds
- `endTime` (LONG): End timestamp in milliseconds
- `page` (INT): Default 1
- `rows` (INT): Default 100, max 500
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

---

### 5. Sub-account Deposit History

#### Endpoint
```
GET /sapi/v1/capital/deposit/subAddress
```

#### Full URL
```
https://api.binance.us/sapi/v1/capital/deposit/subAddress
```

#### Required Parameters
- `email` (STRING): Sub-account email
- `timestamp` (LONG): Current millisecond timestamp

#### Optional Parameters
- `coin` (STRING): Filter by specific cryptocurrency
- `status` (INT): 0(pending), 6(credited but cannot withdraw), 1(success)
- `startTime` (LONG): Start timestamp in milliseconds
- `endTime` (LONG): End timestamp in milliseconds
- `offset` (INT): Default 0
- `limit` (INT): Default 1000, max 1000
- `recvWindow` (LONG): Cannot exceed 60,000 milliseconds

---

### Authentication Details

All transaction endpoints require:
- **Header:** `X-MBX-APIKEY` with your API key
- **Signature:** HMAC SHA256 signature of query parameters
- **Timestamp:** Current millisecond timestamp

### API Permissions Required

To access transaction history, enable **"Enable Read"** permission on your API key. This is the default and allows trusted entities to access transaction history without the ability to trade or withdraw.

### Rate Limits

All endpoints have rate limits. Exceeding limits will result in a 429 (Too Many Requests) error. Plan your request patterns accordingly.

### Example cURL Request
```bash
curl -X GET "https://api.binance.us/api/v3/myTrades?symbol=BTCUSDT&timestamp=1234567890&signature=YOUR_SIGNATURE" \
  -H "X-MBX-APIKEY: your_api_key"
```

### Official Documentation
- Main Docs: https://docs.binance.us/
- GitHub: https://github.com/binance-us/binance-us-api-docs
