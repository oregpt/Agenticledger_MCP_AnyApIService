# Coinbase Prime API Research

## Balance API Documentation

### Endpoint
```
GET /v1/portfolios/{portfolio_id}/balances
```

### Base URL
```
https://api.prime.coinbase.com
```

### Full URL
```
https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/balances
```

### Authentication
- **Method:** Custom signature-based authentication
- **Headers Required:**
  - `X-CB-ACCESS-KEY`: Your API key
  - `X-CB-ACCESS-PASSPHRASE`: Your passphrase
  - `X-CB-ACCESS-SIGNATURE`: Request signature
  - `X-CB-ACCESS-TIMESTAMP`: Unix timestamp
  - `Content-Type: application/json`

### Path Parameters
- `portfolio_id` (string, required): The ID of the portfolio to query

### Query Parameters
- `symbols` (string, optional): Comma-separated list of asset symbols to filter by
- `balance_type` (enum, optional): Filter by balance type:
  - `TRADING_BALANCES`: Trading account balances only
  - `VAULT_BALANCES`: Vault balances only
  - `TOTAL_BALANCES`: Combined vault + trading + prime custody
  - `PRIME_CUSTODY_BALANCES`: Prime custody balances only
  - `UNIFIED_TOTAL_BALANCES`: Across all networks and wallet types

### Response Structure
```json
{
  "balances": [
    {
      "symbol": "BTC",
      "amount": "1.23456789",
      "holds": "0.1",
      "bonded_amount": "0.0",
      "unvested_amount": "0.0",
      "pending_rewards_amount": "0.0",
      "withdrawable_amount": "1.13456789",
      "fiat_amount": "45000.00"
    },
    {
      "symbol": "ETH",
      "amount": "10.5",
      "holds": "0.5",
      "withdrawable_amount": "10.0",
      "fiat_amount": "25000.00"
    }
  ],
  "type": "TOTAL_BALANCES",
  "trading_balances": {
    "total": "70000.00",
    "balances": [...]
  },
  "vault_balances": {
    "total": "0.00",
    "balances": []
  },
  "prime_custody_balances": {
    "total": "0.00",
    "balances": []
  }
}
```

### Response Fields
- `balances`: Array of balance objects
  - `symbol`: Asset symbol (BTC, ETH, etc.)
  - `amount`: Total balance with full precision
  - `holds`: Amount currently on hold
  - `bonded_amount`: Amount bonded/staked
  - `unvested_amount`: Unvested token amount
  - `pending_rewards_amount`: Pending staking rewards
  - `withdrawable_amount`: Available for withdrawal
  - `fiat_amount`: USD equivalent value
- `type`: The balance type returned
- `trading_balances`: Aggregated trading balances
- `vault_balances`: Aggregated vault balances
- `prime_custody_balances`: Aggregated custody balances

### Key Features
- Portfolio-based architecture
- Multiple balance types (trading, vault, custody)
- Includes holds and withdrawable amounts
- Fiat conversion values included
- Supports filtering by specific symbols
- Granular balance categorization

### Setup Requirements
1. Create a Coinbase Prime Account
2. Generate API Key from web UI (Settings -> APIs)
3. Set appropriate permissions (View permission for read-only)

### API Permissions
- **View**: Read permissions for all GET endpoints
- Includes access to balance queries

### Example cURL Request
```bash
curl --request GET \
  --url "https://api.prime.coinbase.com/v1/portfolios/YOUR_PORTFOLIO_ID/balances" \
  --header "X-CB-ACCESS-KEY: your_api_key" \
  --header "X-CB-ACCESS-PASSPHRASE: your_passphrase" \
  --header "X-CB-ACCESS-SIGNATURE: computed_signature" \
  --header "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  --header "Content-Type: application/json"
```

### Official Documentation
- Main Docs: https://docs.cdp.coinbase.com/prime/
- API Reference: https://docs.cdp.coinbase.com/api-reference/prime-api/
- Introduction: https://docs.cdp.coinbase.com/prime/introduction/welcome

---

## Transactions API Documentation

### Overview
Coinbase Prime provides endpoints to retrieve transaction history for wallets within portfolios. Transactions include deposits, withdrawals, trades, staking operations, and more.

---

### 1. List Wallet Transactions

#### Endpoint
```
GET /v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions
```

#### Full URL
```
https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions
```

#### Authentication
- **Method:** Custom signature-based authentication
- **Headers Required:**
  - `X-CB-ACCESS-KEY`: Your API key
  - `X-CB-ACCESS-PASSPHRASE`: Your passphrase
  - `X-CB-ACCESS-SIGNATURE`: Request signature
  - `X-CB-ACCESS-TIMESTAMP`: Unix timestamp
  - `Content-Type: application/json`

#### Path Parameters
- `portfolio_id` (string, required): Portfolio identifier
- `wallet_id` (string, required): Wallet identifier

#### Query Parameters
- `types` (array, optional): Filter by transaction types:
  - `DEPOSIT`: Incoming deposits
  - `WITHDRAWAL`: Outgoing withdrawals
  - `STAKE`: Staking operations
  - `UNSTAKE`: Unstaking operations
  - `PORTFOLIO_STAKE`: Portfolio-level staking
  - `PORTFOLIO_UNSTAKE`: Portfolio-level unstaking
  - `WEB3_TRANSACTION`: Web3/blockchain transactions
  - `ONCHAIN_TRANSACTION`: On-chain transactions with Prime Onchain Wallet
  - Plus 40+ other transaction types
- `start_time` (date-time, optional): Inclusive UTC timestamp filter (ISO-8601 format)
- `end_time` (date-time, optional): Exclusive UTC timestamp filter (ISO-8601 format)
- `cursor` (string, optional): Pagination cursor - ID to start after
- `limit` (integer, optional): Number of items to retrieve per page
- `sort_direction` (enum, optional): "DESC" (default) or "ASC"

#### Response Structure
```json
{
  "transactions": [
    {
      "id": "abc123",
      "wallet_id": "wallet-xyz",
      "portfolio_id": "portfolio-123",
      "type": "DEPOSIT",
      "status": "TRANSACTION_DONE",
      "symbol": "BTC",
      "amount": "0.5",
      "created_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:45:00Z",
      "transfer_from": {
        "type": "BLOCKCHAIN_WALLET",
        "value": "External Wallet",
        "address": "bc1q...",
        "account_identifier": ""
      },
      "transfer_to": {
        "type": "PRIME_TRADING_WALLET",
        "value": "Trading Wallet",
        "address": "",
        "account_identifier": "wallet-xyz"
      },
      "network_fees": {
        "amount": "0.0001",
        "symbol": "BTC"
      },
      "fees": {
        "amount": "0.0",
        "symbol": "BTC"
      },
      "blockchain_ids": ["txhash123..."],
      "metadata": {
        "rewards": {},
        "web3_data": {}
      },
      "onchain_details": {
        "signing_status": "SIGNED",
        "risk_assessment": "LOW",
        "chain": "ETHEREUM"
      }
    }
  ],
  "pagination": {
    "next_cursor": "next-page-id",
    "has_next": true,
    "sort_direction": "DESC"
  }
}
```

#### Response Fields
- `transactions`: Array of transaction objects
  - `id`: Unique transaction identifier
  - `wallet_id`: Wallet identifier
  - `portfolio_id`: Portfolio identifier
  - `type`: Transaction classification (40+ types supported)
  - `status`: Current state
    - `TRANSACTION_DONE`: Completed successfully
    - `TRANSACTION_FAILED`: Failed to process
    - `TRANSACTION_PENDING`: In progress
    - Additional status values
  - `symbol`: Asset symbol (BTC, ETH, etc.)
  - `amount`: Transaction amount
  - `created_at`: UTC timestamp when transaction was initiated
  - `completed_at`: UTC timestamp when transaction completed
  - `transfer_from`: Source details (type, value, address, account_identifier)
  - `transfer_to`: Destination details (type, value, address, account_identifier)
  - `network_fees`: Blockchain network fees paid
  - `fees`: Platform fees charged
  - `blockchain_ids`: Transaction hash(es) on blockchain
  - `metadata`: Optional nested details (rewards, Web3 data)
  - `onchain_details`: Signing status, risk assessment, chain info
- `pagination`: Pagination control object
  - `next_cursor`: Cursor for next page
  - `has_next`: Boolean indicating more results available
  - `sort_direction`: Applied sorting direction

#### Key Features
- Only transactions that affect balances are accessible
- Supports filtering by multiple transaction types
- Time-based filtering with ISO-8601 timestamps
- Pagination support for large result sets
- Detailed transfer source and destination information
- Includes network fees and platform fees
- Blockchain transaction hash(es) included
- Metadata for specialized transaction types (staking, Web3)

---

### 2. List Portfolio Transactions

#### Endpoint
```
GET /v1/portfolios/{portfolio_id}/transactions
```

#### Full URL
```
https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/transactions
```

This endpoint aggregates transactions across all wallets in a portfolio. It accepts similar query parameters as the wallet transactions endpoint.

---

### 3. List Order Fills (Trade History)

#### Endpoint
```
GET /v1/portfolios/{portfolio_id}/order_fills
```

#### Full URL
```
https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/order_fills
```

This endpoint retrieves trade execution details (fills) for orders placed on the exchange.

#### Query Parameters
- `order_ids` (array, optional): Filter by specific order IDs
- `product_ids` (array, optional): Filter by trading pairs
- `start_date` (date, optional): Start date filter
- `end_date` (date, optional): End date filter
- `cursor` (string, optional): Pagination cursor
- `limit` (integer, optional): Results per page
- `sort_direction` (enum, optional): "DESC" or "ASC"

---

### Transaction Types Reference

Coinbase Prime supports 40+ transaction types including:

**Common Types:**
- `DEPOSIT` / `WITHDRAWAL`: Basic transfers
- `STAKE` / `UNSTAKE`: Staking operations
- `TRADE`: Exchange trades
- `TRANSFER`: Internal transfers
- `REWARD`: Staking rewards
- `FEE`: Fee payments

**Advanced Types:**
- `WEB3_TRANSACTION`: Web3 interactions
- `ONCHAIN_TRANSACTION`: On-chain wallet operations
- `PORTFOLIO_STAKE` / `PORTFOLIO_UNSTAKE`: Portfolio-level staking
- `CONVERSION`: Currency conversions
- `REBATE`: Fee rebates

---

### Authentication Details

All transaction endpoints require the same authentication as balance endpoints:
1. Generate a signature using your API secret
2. Include all required headers in each request
3. Ensure timestamp is within acceptable time window

### API Permissions Required

To access transaction history, your API key needs **"View"** permission, which grants read access to all GET endpoints including transactions.

### Rate Limits

Coinbase Prime has rate limits on API requests. Monitor response headers for limit information and implement appropriate throttling.

### Pagination Best Practices

1. Use `cursor` parameter to navigate through pages
2. Check `has_next` in pagination response
3. Set appropriate `limit` (balance between request count and data size)
4. Use `start_time` and `end_time` to narrow results

### Example cURL Request
```bash
curl --request GET \
  --url "https://api.prime.coinbase.com/v1/portfolios/YOUR_PORTFOLIO_ID/wallets/YOUR_WALLET_ID/transactions?types=DEPOSIT&types=WITHDRAWAL&limit=50&sort_direction=DESC" \
  --header "X-CB-ACCESS-KEY: your_api_key" \
  --header "X-CB-ACCESS-PASSPHRASE: your_passphrase" \
  --header "X-CB-ACCESS-SIGNATURE: computed_signature" \
  --header "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  --header "Content-Type: application/json"
```

### Official Documentation
- Main Docs: https://docs.cdp.coinbase.com/prime/
- Transactions Reference: https://docs.cdp.coinbase.com/api-reference/prime-api/rest-api/transactions/
- API Introduction: https://docs.cdp.coinbase.com/prime/introduction/welcome
