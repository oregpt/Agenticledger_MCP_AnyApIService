# Coinbase App API (Sign In with Coinbase / Wallet API v2) - Research

## Overview
This document covers the **Coinbase App API** (also known as "Sign In with Coinbase" or "Wallet API v2"), which is different from:
- Coinbase Prime API (institutional/enterprise)
- Coinbase Advanced Trade API (trading platform, formerly Coinbase Pro)

## Authentication

### Cloud API Keys (JWT with ES256) - RECOMMENDED FOR SERVER-TO-SERVER
The Coinbase App API uses **JWT (JSON Web Token)** authentication with **ES256 (ECDSA)** signatures for Cloud API Keys.

**NO PASSPHRASE REQUIRED** - Authentication uses EC Private Key signing only.

**Credentials Provided When Creating API Keys:**
- **API Key Name** - Identifier in format: `organizations/{org_id}/apiKeys/{key_id}`
- **Private Key** - EC private key in PEM format (used for signing JWTs)
- **Public Key** - For reference only

**Authentication Header:**
- `Authorization: Bearer {JWT}`

**JWT Requirements:**
- Must be generated for **each unique API request**
- Expires after **2 minutes**
- Uses **ES256 algorithm** (ECDSA with P-256 curve)
- Ed25519 (EdDSA) keys are NOT supported

**JWT Structure:**
```javascript
// Header
{
  "alg": "ES256",
  "kid": "{API_KEY_NAME}",  // Your key name
  "nonce": "{RANDOM_HEX}"   // Random hex string
}

// Payload
{
  "sub": "{API_KEY_NAME}",
  "iss": "cdp",
  "nbf": {CURRENT_TIMESTAMP},
  "exp": {CURRENT_TIMESTAMP + 120},  // 2 minutes
  "uri": "{REQUEST_METHOD} {HOST}{PATH}"  // e.g., "GET api.coinbase.com/v2/accounts"
}
```

**Signature:** Sign with your EC Private Key using ES256 algorithm

### Alternative: OAuth 2.0 (User Authorization Flow)
For user-facing applications, you can use OAuth 2.0:
- Obtain access token through user authorization
- Use: `Authorization: Bearer {access_token}`
- Requires scopes like `wallet:accounts:read`, `wallet:transactions:read`

**Base URL:** `https://api.coinbase.com`

---

## Balance API Endpoints

### 1. List All Accounts
Retrieves all accounts with balance information for the authenticated user.

**Endpoint:** `GET /v2/accounts`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:accounts:read`

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts \
  -H 'Authorization: Bearer {access_token}'
```

**Response Format:**
```json
{
  "pagination": {
    "ending_before": null,
    "starting_after": null,
    "limit": 25,
    "order": "desc",
    "previous_uri": null,
    "next_uri": null
  },
  "data": [
    {
      "id": "71452118-efc7-4cc4-8780-a5e22d4baa53",
      "name": "BTC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "BTC",
        "name": "Bitcoin",
        "color": "#F7931A",
        "sort_index": 100,
        "exponent": 8,
        "type": "crypto"
      },
      "balance": {
        "amount": "39.59000000",
        "currency": "BTC"
      },
      "created_at": "2015-01-31T20:49:02Z",
      "updated_at": "2015-01-31T20:49:02Z",
      "resource": "account",
      "resource_path": "/v2/accounts/71452118-efc7-4cc4-8780-a5e22d4baa53"
    }
  ]
}
```

**Key Fields:**
- `balance.amount` - Current balance (as string for precision)
- `balance.currency` - Asset code (BTC, ETH, etc.)
- `type` - Account type: wallet, fiat, vault
- `primary` - Whether this is the primary account for that currency

---

### 2. Show Single Account
Retrieves a specific account by ID or currency code.

**Endpoint:** `GET /v2/accounts/:account_id`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:accounts:read`

**Path Parameters:**
- `account_id` - Account UUID or currency code (e.g., "BTC" for primary Bitcoin account)

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/BTC \
  -H 'Authorization: Bearer {access_token}'
```

**Response Format:**
```json
{
  "data": {
    "id": "71452118-efc7-4cc4-8780-a5e22d4baa53",
    "name": "BTC Wallet",
    "primary": true,
    "type": "wallet",
    "currency": {
      "code": "BTC",
      "name": "Bitcoin"
    },
    "balance": {
      "amount": "39.59000000",
      "currency": "BTC"
    },
    "created_at": "2015-01-31T20:49:02Z",
    "updated_at": "2015-01-31T20:49:02Z"
  }
}
```

---

## Transaction API Endpoints

### 3. List Transactions
Retrieves transaction history for a specific account.

**Endpoint:** `GET /v2/accounts/:account_id/transactions`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:transactions:read`

**Path Parameters:**
- `account_id` - Account UUID

**Query Parameters (Optional):**
- `limit` - Number of results per page (default: 25, max: 100)
- `starting_after` - Cursor for pagination
- `ending_before` - Cursor for pagination
- `order` - Sort order: asc or desc (default: desc)

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/{account_id}/transactions \
  -H 'Authorization: Bearer {access_token}'
```

**Response Format:**
```json
{
  "pagination": {
    "ending_before": null,
    "starting_after": null,
    "limit": 25,
    "order": "desc",
    "previous_uri": null,
    "next_uri": "/v2/accounts/{id}/transactions?starting_after=..."
  },
  "data": [
    {
      "id": "57ffb4ae-0c59-5430-bcd3-3f98f797a66c",
      "type": "send",
      "status": "completed",
      "amount": {
        "amount": "-0.00100000",
        "currency": "BTC"
      },
      "native_amount": {
        "amount": "-42.73",
        "currency": "USD"
      },
      "description": null,
      "created_at": "2015-03-11T13:13:35-07:00",
      "updated_at": "2015-03-26T15:55:43-07:00",
      "resource": "transaction",
      "resource_path": "/v2/accounts/{account_id}/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c",
      "network": {
        "status": "confirmed",
        "hash": "9ec6ebc1c0c0e9179fe43c57f91e9de60959e9f8e679f38cfa9f2da65c3ebd83"
      }
    }
  ]
}
```

**Transaction Types:**
- `send` - Sent crypto to external address
- `request` - Requested crypto from someone
- `transfer` - Internal transfer between accounts
- `buy` - Purchase of crypto
- `sell` - Sale of crypto
- `fiat_deposit` - Fiat deposit
- `fiat_withdrawal` - Fiat withdrawal
- `exchange_deposit` - Crypto deposit from exchange
- `exchange_withdrawal` - Crypto withdrawal to exchange
- `vault_withdrawal` - Withdrawal from vault

**Transaction Status:**
- `pending` - Transaction is pending
- `completed` - Transaction completed successfully
- `failed` - Transaction failed
- `expired` - Transaction expired
- `canceled` - Transaction was canceled

---

### 4. Show Transaction Details
Retrieves details for a specific transaction.

**Endpoint:** `GET /v2/accounts/:account_id/transactions/:transaction_id`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:transactions:read`

**Path Parameters:**
- `account_id` - Account UUID
- `transaction_id` - Transaction UUID

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/{account_id}/transactions/{transaction_id} \
  -H 'Authorization: Bearer {access_token}'
```

**Response:** Same structure as individual transaction object in list transactions response.

---

### 5. List Deposits
Retrieves deposit history for a specific account.

**Endpoint:** `GET /v2/accounts/:account_id/deposits`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:deposits:read`

**Path Parameters:**
- `account_id` - Account UUID

**Query Parameters (Optional):**
- `limit` - Number of results per page
- `starting_after` - Cursor for pagination
- `ending_before` - Cursor for pagination

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/{account_id}/deposits \
  -H 'Authorization: Bearer {access_token}'
```

**Response Format:**
```json
{
  "pagination": {},
  "data": [
    {
      "id": "67e0eaec-07d7-54c4-a72c-2e92826897df",
      "status": "completed",
      "payment_method": {
        "id": "83562370-3e5c-51db-87da-752af5ab9559",
        "resource": "payment_method",
        "resource_path": "/v2/payment-methods/83562370-3e5c-51db-87da-752af5ab9559"
      },
      "transaction": {
        "id": "441b9494-b3f0-5b98-b9b0-4d82c21c252a",
        "resource": "transaction",
        "resource_path": "/v2/accounts/{account_id}/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a"
      },
      "amount": {
        "amount": "10.00",
        "currency": "USD"
      },
      "subtotal": {
        "amount": "10.00",
        "currency": "USD"
      },
      "created_at": "2015-01-31T20:49:02Z",
      "updated_at": "2015-02-11T16:54:02-08:00",
      "resource": "deposit",
      "resource_path": "/v2/accounts/{account_id}/deposits/67e0eaec-07d7-54c4-a72c-2e92826897df"
    }
  ]
}
```

**Note:** Due to banking regulations, Coinbase doesn't offer programmatic access to **initiate** fiat deposits, but you can **list** recent deposits.

---

### 6. List Withdrawals
Retrieves withdrawal history for a specific account.

**Endpoint:** `GET /v2/accounts/:account_id/withdrawals`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:withdrawals:read`

**Path Parameters:**
- `account_id` - Account UUID

**Query Parameters (Optional):**
- `limit` - Number of results per page
- `starting_after` - Cursor for pagination
- `ending_before` - Cursor for pagination

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/{account_id}/withdrawals \
  -H 'Authorization: Bearer {access_token}'
```

**Response Format:**
```json
{
  "pagination": {},
  "data": [
    {
      "id": "67e0eaec-07d7-54c4-a72c-2e92826897df",
      "status": "completed",
      "payment_method": {
        "id": "83562370-3e5c-51db-87da-752af5ab9559",
        "resource": "payment_method",
        "resource_path": "/v2/payment-methods/83562370-3e5c-51db-87da-752af5ab9559"
      },
      "transaction": {
        "id": "441b9494-b3f0-5b98-b9b0-4d82c21c252a",
        "resource": "transaction",
        "resource_path": "/v2/accounts/{account_id}/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a"
      },
      "amount": {
        "amount": "10.00",
        "currency": "USD"
      },
      "subtotal": {
        "amount": "10.00",
        "currency": "USD"
      },
      "created_at": "2015-01-31T20:49:02Z",
      "updated_at": "2015-02-11T16:54:02-08:00",
      "resource": "withdrawal",
      "resource_path": "/v2/accounts/{account_id}/withdrawals/67e0eaec-07d7-54c4-a72c-2e92826897df"
    }
  ]
}
```

**Note:** Similar to deposits, you can **list** crypto withdrawals programmatically, but initiating fiat withdrawals is restricted.

---

### 7. Send Crypto (Create Transaction)
Sends cryptocurrency to an external address or email.

**Endpoint:** `POST /v2/accounts/:account_id/transactions`

**Authentication:** Required (Bearer token or API key)

**Required Scope (OAuth):** `wallet:transactions:send`

**Path Parameters:**
- `account_id` - Account UUID to send from

**Request Body:**
```json
{
  "type": "send",
  "to": "user@example.com or crypto_address",
  "amount": "0.1",
  "currency": "BTC",
  "description": "Optional description"
}
```

**Request Example:**
```bash
curl https://api.coinbase.com/v2/accounts/{account_id}/transactions \
  -X POST \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "send",
    "to": "1AUJ8z9Z7kFQh2KDJRZqcsm6vH6vCDhKfN",
    "amount": "0.1",
    "currency": "BTC"
  }'
```

**Response:** Returns created transaction object.

---

## Additional Endpoints

### 8. Get Addresses (for receiving crypto)
**Endpoint:** `GET /v2/accounts/:account_id/addresses`

Retrieves wallet addresses for receiving cryptocurrency.

---

## Rate Limits
- Standard rate limits apply (not publicly documented in detail)
- Use pagination for large result sets
- Monitor response headers for rate limit information

---

## Important Notes

1. **Deprecated Parameters (as of March 31, 2024):**
   - Some parameters for v2 List Transactions and Show Transaction APIs were deprecated on Feb 7, 2024 and removed on March 31, 2024

2. **Fiat Deposit/Withdrawal Restrictions:**
   - Due to banking regulations, programmatic **initiation** of fiat deposits/withdrawals is not supported
   - You can only **list/view** historical fiat deposits and withdrawals

3. **Crypto Send/Receive:**
   - You CAN send crypto programmatically using the POST transaction endpoint
   - You CAN track when users receive crypto by monitoring transactions

4. **Pagination:**
   - All list endpoints support cursor-based pagination
   - Use `starting_after` and `ending_before` cursors from response
   - Maximum limit is typically 100 items per page

5. **OAuth Scopes Required:**
   - `wallet:accounts:read` - Read account balances
   - `wallet:transactions:read` - Read transaction history
   - `wallet:transactions:send` - Send cryptocurrency
   - `wallet:deposits:read` - Read deposit history
   - `wallet:withdrawals:read` - Read withdrawal history

---

## Resources

- **Base URL:** `https://api.coinbase.com`
- **Documentation:** Coinbase Developer Platform (docs.cdp.coinbase.com)
- **API Type:** REST API
- **Data Format:** JSON
- **Authentication:** OAuth 2.0 or API Key (HMAC SHA256)

---

## Summary for AnyAPICall Integration

**Balance Endpoints:**
- `GET /v2/accounts` - List all accounts with balances
- `GET /v2/accounts/:account_id` - Get specific account balance

**Transaction Endpoints:**
- `GET /v2/accounts/:account_id/transactions` - List all transactions
- `GET /v2/accounts/:account_id/transactions/:transaction_id` - Get transaction details
- `GET /v2/accounts/:account_id/deposits` - List deposits
- `GET /v2/accounts/:account_id/withdrawals` - List withdrawals
- `POST /v2/accounts/:account_id/transactions` - Send crypto (optional for read-only integration)

**Authentication Method:** Cloud API Keys (JWT with ES256 signature) OR OAuth 2.0 Bearer Token
