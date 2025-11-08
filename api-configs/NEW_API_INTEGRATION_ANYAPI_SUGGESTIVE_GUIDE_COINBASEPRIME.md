# Coinbase Prime API - AnyAPICall Integration Guide (SUGGESTIVE)

**🚨 IMPORTANT: Platform-First Approach**

**Before using this guide:** AgenticLedger platform teams should first inspect their own platform to see what patterns have previously worked for existing APIs using AnyAPICall. This document provides suggestions and guidance, but your platform's existing patterns should take precedence.

**What this document provides:**
- ✅ Comprehensive API research and documentation
- ✅ Authentication implementation guidance
- ⚠️ Live test results PENDING (requires API passphrase)
- ✅ Suggested TypeScript & JSON configurations
- ✅ Expected response formats based on API documentation
- ✅ Complete balance and transaction endpoint coverage

**Document Type:** SUGGESTIVE GUIDE (Not Prescriptive)

**Status:** PENDING LIVE TESTING - API passphrase required for authentication

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Authentication Requirements](#authentication-requirements)
3. [Suggested Configuration](#suggested-configuration)
4. [Platform Integration Notes](#platform-integration-notes)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)
7. [Appendix: All Endpoints Reference](#appendix-all-endpoints-reference)

---

## Quick Reference

### API Overview

| Property | Value |
|----------|-------|
| **API Name** | Coinbase Prime |
| **Provider** | Coinbase (Institutional Trading Platform) |
| **Base URL** | `https://api.prime.coinbase.com` |
| **Authentication** | ✅ EC Private Key Signature (REQUIRED) |
| **Cost** | Enterprise/Institutional pricing |
| **Rate Limit** | Contact provider for limits |
| **Data Scope** | Complete institutional trading and custody data |
| **Total Endpoints** | 40+ endpoints across portfolios, wallets, and transactions |

### Suggested API ID

```
coinbaseprime
```

### ⚠️ CRITICAL REQUIREMENTS

> **EC Private Key Authentication + Passphrase - NOT OPTIONAL**
>
> Every authenticated request MUST include:
>
> ```
> X-CB-ACCESS-KEY: organizations/{org_id}/apiKeys/{key_id}
> X-CB-ACCESS-SIGNATURE: computed_signature
> X-CB-ACCESS-TIMESTAMP: unix_timestamp
> X-CB-ACCESS-PASSPHRASE: your_passphrase
> Content-Type: application/json
> ```
>
> **Why This Matters:** Without all four headers, you get immediate 401 Unauthorized. The API uses EC (Elliptic Curve) cryptography, not HMAC.
>
> **Signature Calculation:**
> ```javascript
> const message = timestamp + method + path + body;
> const sign = crypto.createSign('SHA256');
> sign.update(message);
> sign.end();
> const signature = sign.sign(privateKey, 'base64');
> ```
>
> **Getting API Key:** Log into Coinbase Prime → Settings → APIs → Create API Key
>
> **IMPORTANT:** You need THREE credentials:
> 1. API Key Name (path format: organizations/.../apiKeys/...)
> 2. EC Private Key (PEM format)
> 3. API Passphrase (created when generating key)

### Key Features

- 💰 **Portfolio Balances:** Multi-portfolio balance tracking
- 🏦 **Wallet Management:** Trading, vault, and custody wallets
- 📊 **Transaction History:** 40+ transaction types
- 💸 **Deposits & Withdrawals:** Complete transfer tracking
- 📈 **Trade Fills:** Detailed order execution history
- 🔒 **Multiple Balance Types:** Trading, Vault, Custody, Unified
- 🌐 **Multi-Network Support:** Cross-chain transaction tracking

---

## Authentication Requirements

### Step 1: Obtain API Credentials

1. Log into Coinbase Prime web interface
2. Navigate to Settings → APIs
3. Click "Create API Key"
4. Set permissions (View for read-only)
5. **Save all three credentials:**
   - API Key Name: `organizations/{org_id}/apiKeys/{key_id}`
   - Private Key: EC Private Key in PEM format
   - Passphrase: Custom passphrase you create

### Step 2: Understanding the Signature

Coinbase Prime uses **EC (Elliptic Curve) cryptography**, not HMAC:

```typescript
function createCoinbaseSignature(
  timestamp: string,
  method: string,
  path: string,
  body: string,
  privateKey: string
): string {
  const crypto = require('crypto');

  // Construct the prehash string
  const message = timestamp + method + path + body;

  // Create signature using EC private key
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();

  // Sign with private key and return base64
  return sign.sign(privateKey, 'base64');
}
```

### Step 3: Required Headers

```typescript
const headers = {
  'X-CB-ACCESS-KEY': 'organizations/{org_id}/apiKeys/{key_id}',
  'X-CB-ACCESS-SIGNATURE': computedSignature,
  'X-CB-ACCESS-TIMESTAMP': Math.floor(Date.now() / 1000).toString(),
  'X-CB-ACCESS-PASSPHRASE': 'your_passphrase',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

---

## Expected API Behavior (Based on Documentation)

### Test 1: List Portfolios (Not Yet Tested)

**Endpoint:** `GET /v1/portfolios`

**Expected Request:**
```bash
curl -X GET "https://api.prime.coinbase.com/v1/portfolios" \
  -H "X-CB-ACCESS-KEY: organizations/.../apiKeys/..." \
  -H "X-CB-ACCESS-SIGNATURE: computed_signature" \
  -H "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  -H "X-CB-ACCESS-PASSPHRASE: your_passphrase" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "portfolios": [
    {
      "id": "portfolio-id-123",
      "name": "Trading Portfolio",
      "entity_id": "entity-123",
      "organization_id": "org-123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "next_cursor": null,
    "has_next": false
  }
}
```

**Expected Fields:**
- `portfolios`: Array of portfolio objects
- `id`: Portfolio identifier (needed for balance queries)
- `name`: Human-readable portfolio name
- `entity_id`: Entity association
- `organization_id`: Organization identifier

---

### Test 2: Get Portfolio Balances (Not Yet Tested)

**Endpoint:** `GET /v1/portfolios/{portfolio_id}/balances`

**Query Parameters:**
- `symbols` (optional): Filter by asset symbols
- `balance_type` (optional): TRADING_BALANCES, VAULT_BALANCES, TOTAL_BALANCES, etc.

**Expected Request:**
```bash
curl -X GET "https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/balances?balance_type=TOTAL_BALANCES" \
  -H "X-CB-ACCESS-KEY: organizations/.../apiKeys/..." \
  -H "X-CB-ACCESS-SIGNATURE: computed_signature" \
  -H "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  -H "X-CB-ACCESS-PASSPHRASE: your_passphrase"
```

**Expected Response:**
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
  }
}
```

**Expected Fields:**
- `balances`: Array of balance objects
  - `symbol`: Asset symbol (BTC, ETH, etc.)
  - `amount`: Total balance
  - `holds`: Amount currently on hold
  - `bonded_amount`: Amount bonded/staked
  - `withdrawable_amount`: Available for withdrawal
  - `fiat_amount`: USD equivalent
- `type`: Balance type returned
- `trading_balances`: Aggregated trading balances
- `vault_balances`: Aggregated vault balances

---

### Test 3: List Wallets (Not Yet Tested)

**Endpoint:** `GET /v1/portfolios/{portfolio_id}/wallets`

**Expected Request:**
```bash
curl -X GET "https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/wallets" \
  -H "X-CB-ACCESS-KEY: organizations/.../apiKeys/..." \
  -H "X-CB-ACCESS-SIGNATURE: computed_signature" \
  -H "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  -H "X-CB-ACCESS-PASSPHRASE: your_passphrase"
```

**Expected Response:**
```json
{
  "wallets": [
    {
      "id": "wallet-123",
      "name": "BTC Trading Wallet",
      "symbol": "BTC",
      "type": "TRADING",
      "balance": "1.23456789"
    },
    {
      "id": "wallet-456",
      "name": "ETH Vault",
      "symbol": "ETH",
      "type": "VAULT",
      "balance": "10.5"
    }
  ]
}
```

---

### Test 4: List Wallet Transactions (Not Yet Tested)

**Endpoint:** `GET /v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions`

**Query Parameters:**
- `types` (array, optional): Filter by transaction types (DEPOSIT, WITHDRAWAL, STAKE, etc.)
- `start_time` (date-time, optional): Inclusive UTC timestamp filter
- `end_time` (date-time, optional): Exclusive UTC timestamp filter
- `cursor` (string, optional): Pagination cursor
- `limit` (integer, optional): Results per page
- `sort_direction` (enum, optional): DESC or ASC

**Expected Request:**
```bash
curl -X GET "https://api.prime.coinbase.com/v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions?types=DEPOSIT&types=WITHDRAWAL&limit=50" \
  -H "X-CB-ACCESS-KEY: organizations/.../apiKeys/..." \
  -H "X-CB-ACCESS-SIGNATURE: computed_signature" \
  -H "X-CB-ACCESS-TIMESTAMP: 1234567890" \
  -H "X-CB-ACCESS-PASSPHRASE: your_passphrase"
```

**Expected Response:**
```json
{
  "transactions": [
    {
      "id": "tx-123",
      "wallet_id": "wallet-123",
      "portfolio_id": "portfolio-123",
      "type": "DEPOSIT",
      "status": "TRANSACTION_DONE",
      "symbol": "BTC",
      "amount": "0.5",
      "created_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:45:00Z",
      "transfer_from": {
        "type": "BLOCKCHAIN_WALLET",
        "address": "bc1q..."
      },
      "transfer_to": {
        "type": "PRIME_TRADING_WALLET",
        "account_identifier": "wallet-123"
      },
      "network_fees": {
        "amount": "0.0001",
        "symbol": "BTC"
      },
      "blockchain_ids": ["txhash123..."]
    }
  ],
  "pagination": {
    "next_cursor": "cursor-xyz",
    "has_next": true,
    "sort_direction": "DESC"
  }
}
```

**Expected Transaction Types:**
- `DEPOSIT` / `WITHDRAWAL`: Basic transfers
- `STAKE` / `UNSTAKE`: Staking operations
- `TRADE`: Exchange trades
- `TRANSFER`: Internal transfers
- `REWARD`: Staking rewards
- `FEE`: Fee payments
- `WEB3_TRANSACTION`: Web3 interactions
- `ONCHAIN_TRANSACTION`: On-chain wallet operations
- Plus 30+ additional types

---

## Suggested Configuration

**⚠️ REMINDER:** Check your platform's existing AnyAPI configurations first!

### Option A: TypeScript Configuration (AgenticLedger Pattern)

```typescript
// In anyapicall-server.ts or equivalent

const COINBASE_PRIME_API: APIDefinition = {
  id: 'coinbaseprime',
  name: 'Coinbase Prime',
  description: 'Institutional cryptocurrency trading and custody API - portfolios, wallets, balances, and transactions',
  baseUrl: 'https://api.prime.coinbase.com',
  requiresAuth: true,
  authType: 'custom', // EC Private Key signature
  authHeader: 'X-CB-ACCESS-KEY',
  rateLimit: {
    requestsPerMinute: null, // Contact provider
    requestsPerDay: null
  },
  endpoints: [
    {
      name: 'list_portfolios',
      path: '/v1/portfolios',
      method: 'GET',
      description: 'List all portfolios accessible to the API key'
    },
    {
      name: 'get_portfolio_balances',
      path: '/v1/portfolios/{portfolio_id}/balances',
      method: 'GET',
      description: 'Get all balances for a specific portfolio',
      pathParams: [
        {
          name: 'portfolio_id',
          type: 'string',
          required: true,
          description: 'Portfolio identifier'
        }
      ],
      queryParams: [
        {
          name: 'symbols',
          type: 'string',
          required: false,
          description: 'Comma-separated asset symbols to filter by'
        },
        {
          name: 'balance_type',
          type: 'string',
          required: false,
          description: 'TRADING_BALANCES, VAULT_BALANCES, TOTAL_BALANCES, PRIME_CUSTODY_BALANCES, or UNIFIED_TOTAL_BALANCES'
        }
      ]
    },
    {
      name: 'list_wallets',
      path: '/v1/portfolios/{portfolio_id}/wallets',
      method: 'GET',
      description: 'List all wallets in a portfolio',
      pathParams: [
        {
          name: 'portfolio_id',
          type: 'string',
          required: true,
          description: 'Portfolio identifier'
        }
      ]
    },
    {
      name: 'list_wallet_transactions',
      path: '/v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions',
      method: 'GET',
      description: 'Get transaction history for a specific wallet',
      pathParams: [
        {
          name: 'portfolio_id',
          type: 'string',
          required: true,
          description: 'Portfolio identifier'
        },
        {
          name: 'wallet_id',
          type: 'string',
          required: true,
          description: 'Wallet identifier'
        }
      ],
      queryParams: [
        {
          name: 'types',
          type: 'array',
          required: false,
          description: 'Array of transaction types to filter (DEPOSIT, WITHDRAWAL, STAKE, etc.)'
        },
        {
          name: 'start_time',
          type: 'string',
          required: false,
          description: 'ISO-8601 timestamp for start of range'
        },
        {
          name: 'end_time',
          type: 'string',
          required: false,
          description: 'ISO-8601 timestamp for end of range'
        },
        {
          name: 'cursor',
          type: 'string',
          required: false,
          description: 'Pagination cursor'
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Number of results per page'
        },
        {
          name: 'sort_direction',
          type: 'string',
          required: false,
          description: 'DESC or ASC (default: DESC)'
        }
      ]
    },
    {
      name: 'list_portfolio_transactions',
      path: '/v1/portfolios/{portfolio_id}/transactions',
      method: 'GET',
      description: 'Get all transactions across all wallets in a portfolio',
      pathParams: [
        {
          name: 'portfolio_id',
          type: 'string',
          required: true,
          description: 'Portfolio identifier'
        }
      ],
      queryParams: [
        {
          name: 'types',
          type: 'array',
          required: false,
          description: 'Array of transaction types to filter'
        },
        {
          name: 'start_time',
          type: 'string',
          required: false,
          description: 'ISO-8601 timestamp'
        },
        {
          name: 'end_time',
          type: 'string',
          required: false,
          description: 'ISO-8601 timestamp'
        },
        {
          name: 'cursor',
          type: 'string',
          required: false,
          description: 'Pagination cursor'
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Results per page'
        }
      ]
    },
    {
      name: 'list_order_fills',
      path: '/v1/portfolios/{portfolio_id}/order_fills',
      method: 'GET',
      description: 'Get trade execution history (order fills)',
      pathParams: [
        {
          name: 'portfolio_id',
          type: 'string',
          required: true,
          description: 'Portfolio identifier'
        }
      ],
      queryParams: [
        {
          name: 'order_ids',
          type: 'array',
          required: false,
          description: 'Filter by specific order IDs'
        },
        {
          name: 'product_ids',
          type: 'array',
          required: false,
          description: 'Filter by trading pairs'
        },
        {
          name: 'start_date',
          type: 'string',
          required: false,
          description: 'Start date for filter'
        },
        {
          name: 'end_date',
          type: 'string',
          required: false,
          description: 'End date for filter'
        }
      ]
    }
    // ... additional endpoints (see appendix)
  ]
};

// Add to CORE_APIS array
export const CORE_APIS: APIDefinition[] = [
  // ... existing APIs
  COINBASE_PRIME_API,
];
```

### Option B: JSON Configuration (For JSON-Based Platforms)

```json
{
  "id": "coinbaseprime",
  "name": "Coinbase Prime",
  "description": "Institutional cryptocurrency trading and custody API",
  "baseUrl": "https://api.prime.coinbase.com",
  "requiresAuth": true,
  "authType": "custom",
  "authHeader": "X-CB-ACCESS-KEY",
  "endpoints": [
    {
      "name": "list_portfolios",
      "path": "/v1/portfolios",
      "method": "GET",
      "description": "List all portfolios"
    },
    {
      "name": "get_portfolio_balances",
      "path": "/v1/portfolios/{portfolio_id}/balances",
      "method": "GET",
      "description": "Get portfolio balances"
    }
  ]
}
```

### Common Helper: EC Signature Generation

```typescript
// Helper for creating Coinbase Prime signatures
function createCoinbasePrimeSignature(
  timestamp: string,
  method: string,
  path: string,
  body: string,
  privateKey: string
): string {
  const crypto = require('crypto');

  // Construct the prehash string
  const message = timestamp + method + path + body;

  // Create signature using EC private key
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();

  // Sign with private key
  return sign.sign(privateKey, 'base64');
}

// Usage
const timestamp = Math.floor(Date.now() / 1000).toString();
const method = 'GET';
const path = '/v1/portfolios';
const body = ''; // Empty for GET requests

const signature = createCoinbasePrimeSignature(
  timestamp,
  method,
  path,
  body,
  privateKey
);
```

---

## Platform Integration Notes

### STEP 1: Check Your Platform First! 🔍

Review existing AnyAPI configurations in your platform to match patterns.

### STEP 2: Configure EC Private Key Authentication

**CRITICAL:** Coinbase Prime uses EC (Elliptic Curve) cryptography, not HMAC.

```typescript
// Custom authentication handling
export function makeApiCall(args: any) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Add Coinbase Prime-specific auth
  if (args.apiId === 'coinbaseprime') {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const method = args.method || 'GET';
    const path = args.endpoint;
    const body = args.body ? JSON.stringify(args.body) : '';

    const signature = createCoinbasePrimeSignature(
      timestamp,
      method,
      path,
      body,
      args.privateKey // EC Private Key
    );

    headers['X-CB-ACCESS-KEY'] = args.accessToken; // Key Name
    headers['X-CB-ACCESS-SIGNATURE'] = signature;
    headers['X-CB-ACCESS-TIMESTAMP'] = timestamp;
    headers['X-CB-ACCESS-PASSPHRASE'] = args.passphrase; // API Passphrase
  }

  return axios.request({
    url: buildUrl(args),
    method: args.method || 'GET',
    headers,
    data: args.body
  });
}
```

### STEP 3: Implement Pagination Handling

```typescript
// Helper for paginated requests
async function getAllTransactions(
  portfolioId: string,
  walletId: string,
  options: any = {}
) {
  let allTransactions = [];
  let cursor = null;
  let hasNext = true;

  while (hasNext) {
    const params = {
      ...options,
      cursor,
      limit: options.limit || 100
    };

    const result = await makeApiCall({
      apiId: 'coinbaseprime',
      endpoint: `/v1/portfolios/${portfolioId}/wallets/${walletId}/transactions`,
      queryParams: params,
      accessToken: keyName,
      privateKey: privateKey,
      passphrase: passphrase
    });

    allTransactions.push(...result.data.transactions);

    cursor = result.data.pagination.next_cursor;
    hasNext = result.data.pagination.has_next;
  }

  return allTransactions;
}
```

### STEP 4: Add Helper Functions

```typescript
// Format timestamp for API
function getCoinbaseTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

// Parse transaction status
const TRANSACTION_STATUS = {
  'TRANSACTION_DONE': 'completed',
  'TRANSACTION_FAILED': 'failed',
  'TRANSACTION_PENDING': 'pending'
} as const;

// Parse balance types
const BALANCE_TYPES = {
  'TRADING_BALANCES': 'trading',
  'VAULT_BALANCES': 'vault',
  'TOTAL_BALANCES': 'total',
  'PRIME_CUSTODY_BALANCES': 'custody',
  'UNIFIED_TOTAL_BALANCES': 'unified'
} as const;
```

### STEP 5: Quick Integration Checklist

```markdown
## Quick Integration Checklist

For TypeScript-based platforms (like AgenticLedger):

- [ ] Add COINBASE_PRIME_API definition to CORE_APIS array
- [ ] Implement EC Private Key signature generation
- [ ] Add all four required headers (KEY, SIGNATURE, TIMESTAMP, PASSPHRASE)
- [ ] Handle portfolio_id and wallet_id path parameters
- [ ] Implement pagination for transaction endpoints
- [ ] Test with: `!coinbaseprime list_portfolios`
- [ ] Verify signature generation works
- [ ] Test balance and transaction endpoints
- [ ] Handle 40+ transaction types

For JSON-based platforms:

- [ ] Add JSON config to config/apis.json
- [ ] Configure all four authentication headers
- [ ] Implement EC signature middleware
- [ ] Restart server
- [ ] Test list portfolios endpoint
- [ ] Test balance endpoint with portfolio ID
- [ ] Enable for production
```

---

## Usage Examples

### Example 1: Get Portfolio Balances

```typescript
// First, list portfolios to get portfolio_id
const portfolios = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: '/v1/portfolios',
  method: 'GET',
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

const portfolioId = portfolios.data.portfolios[0].id;

// Get balances for portfolio
const balances = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/balances`,
  queryParams: {
    balance_type: 'TOTAL_BALANCES'
  },
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

// Display non-zero balances
balances.data.balances.forEach(b => {
  if (parseFloat(b.amount) > 0) {
    console.log(`${b.symbol}: ${b.amount} (${b.fiat_amount} USD)`);
    console.log(`  Available: ${b.withdrawable_amount}`);
    console.log(`  On Hold: ${b.holds}`);
  }
});
```

---

### Example 2: Track Recent Deposits

```typescript
// Get portfolio and wallet IDs
const portfolios = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: '/v1/portfolios',
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

const portfolioId = portfolios.data.portfolios[0].id;

const wallets = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/wallets`,
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

const walletId = wallets.data.wallets[0].id;

// Get recent deposits
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const deposits = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/wallets/${walletId}/transactions`,
  queryParams: {
    types: ['DEPOSIT'],
    start_time: thirtyDaysAgo.toISOString(),
    limit: 50,
    sort_direction: 'DESC'
  },
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

deposits.data.transactions.forEach(tx => {
  console.log(`${tx.symbol}: ${tx.amount}`);
  console.log(`  Status: ${tx.status}`);
  console.log(`  From: ${tx.transfer_from.address || tx.transfer_from.value}`);
  console.log(`  TX: ${tx.blockchain_ids[0]}`);
  console.log(`  Network Fee: ${tx.network_fees.amount} ${tx.network_fees.symbol}`);
});
```

---

### Example 3: Get Trade History

```typescript
// Get order fills (trade executions)
const trades = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/order_fills`,
  queryParams: {
    product_ids: ['BTC-USD', 'ETH-USD'],
    limit: 50
  },
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

let totalVolume = 0;
trades.data.fills.forEach(fill => {
  console.log(`${fill.side} ${fill.size} ${fill.product_id} @ $${fill.price}`);
  console.log(`  Fee: $${fill.fee}`);
  totalVolume += parseFloat(fill.size) * parseFloat(fill.price);
});

console.log(`\nTotal Trade Volume: $${totalVolume.toFixed(2)}`);
```

---

### Example 4: Monitor All Portfolio Activity

```typescript
// Get all transactions across all wallets
const allActivity = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/transactions`,
  queryParams: {
    start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
    limit: 100,
    sort_direction: 'DESC'
  },
  accessToken: keyName,
  privateKey: privateKey,
  passphrase: passphrase
});

// Group by transaction type
const byType = {};
allActivity.data.transactions.forEach(tx => {
  byType[tx.type] = (byType[tx.type] || 0) + 1;
});

console.log('Activity Summary (Last 7 Days):');
Object.entries(byType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count} transactions`);
});
```

---

## Troubleshooting

### Issue 1: 401 Unauthorized - Missing Passphrase

**Symptoms:**
```
Error: Request failed with status code 401
{"message": "x-cb-access-passphrase is missing"}
```

**Cause:** Missing X-CB-ACCESS-PASSPHRASE header

**Solution:**
```typescript
// ✅ Correct - All four headers
headers: {
  'X-CB-ACCESS-KEY': keyName,
  'X-CB-ACCESS-SIGNATURE': signature,
  'X-CB-ACCESS-TIMESTAMP': timestamp,
  'X-CB-ACCESS-PASSPHRASE': passphrase  // Don't forget this!
}

// ❌ Wrong - Missing passphrase
headers: {
  'X-CB-ACCESS-KEY': keyName,
  'X-CB-ACCESS-SIGNATURE': signature,
  'X-CB-ACCESS-TIMESTAMP': timestamp
  // Missing X-CB-ACCESS-PASSPHRASE!
}
```

### Issue 2: Invalid Signature

**Symptoms:**
```
{"message": "Invalid signature"}
```

**Cause:** Incorrect signature calculation or wrong private key format

**Solution:**
```typescript
// ✅ Correct - Use EC signature, not HMAC
const sign = crypto.createSign('SHA256');
sign.update(timestamp + method + path + body);
sign.end();
const signature = sign.sign(privateKey, 'base64');

// ❌ Wrong - Using HMAC (this is for other APIs)
const signature = crypto.createHmac('sha256', apiSecret)
  .update(message)
  .digest('base64'); // Wrong for Coinbase Prime!

// ✅ Correct private key format
const privateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEE...
-----END EC PRIVATE KEY-----`;

// ❌ Wrong - Base64 encoded (decode it first)
const privateKey = 'LS0tLS1CRUdJTi...'; // This won't work
```

### Issue 3: Timestamp Errors

**Symptoms:**
```
{"message": "Invalid timestamp"}
```

**Cause:** Timestamp not in Unix seconds format

**Solution:**
```typescript
// ✅ Correct - Unix timestamp in SECONDS
const timestamp = Math.floor(Date.now() / 1000).toString();

// ❌ Wrong - Using milliseconds
const timestamp = Date.now().toString(); // Too large!

// ❌ Wrong - Using ISO string
const timestamp = new Date().toISOString(); // Wrong format!
```

### Issue 4: Portfolio or Wallet Not Found

**Symptoms:**
```
{"message": "Portfolio not found"}
```

**Cause:** Using wrong portfolio_id or wallet_id

**Solution:**
```typescript
// ✅ Correct - Always list first to get IDs
const portfolios = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: '/v1/portfolios',
  ...auth
});

const portfolioId = portfolios.data.portfolios[0].id; // Use actual ID

// Then use the real ID
const balances = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/balances`,
  ...auth
});

// ❌ Wrong - Hardcoding IDs
const portfolioId = 'portfolio-123'; // May not exist
```

### Issue 5: Empty Transaction List

**Symptoms:**
```json
{
  "transactions": [],
  "pagination": { "has_next": false }
}
```

**Cause:** May be filtering too restrictively or wallet has no transactions

**Solution:**
```typescript
// Try without filters first
const allTx = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/wallets/${walletId}/transactions`,
  queryParams: {
    limit: 100  // No type filter
  },
  ...auth
});

// If still empty, verify wallet has activity
const wallets = await makeApiCall({
  apiId: 'coinbaseprime',
  endpoint: `/v1/portfolios/${portfolioId}/wallets`,
  ...auth
});

wallets.data.wallets.forEach(w => {
  console.log(`${w.name}: ${w.balance} ${w.symbol}`);
});
```

---

## Appendix: All Endpoints Reference

### Complete Endpoint Directory

This comprehensive table provides balance and transaction endpoints for integration.

#### 1. Portfolios (2 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `list_portfolios` | GET | `/v1/portfolios` | List all portfolios |
| `get_portfolio` | GET | `/v1/portfolios/{portfolio_id}` | Get specific portfolio details |

#### 2. Balances (1 endpoint)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `get_portfolio_balances` | GET | `/v1/portfolios/{portfolio_id}/balances` | Get all balances for portfolio (supports TRADING, VAULT, CUSTODY, TOTAL) |

#### 3. Wallets (2 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `list_wallets` | GET | `/v1/portfolios/{portfolio_id}/wallets` | List all wallets in portfolio |
| `get_wallet` | GET | `/v1/portfolios/{portfolio_id}/wallets/{wallet_id}` | Get specific wallet details |

#### 4. Transactions (4 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `list_wallet_transactions` | GET | `/v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions` | Get transactions for specific wallet (40+ types) |
| `get_transaction` | GET | `/v1/portfolios/{portfolio_id}/wallets/{wallet_id}/transactions/{transaction_id}` | Get specific transaction details |
| `list_portfolio_transactions` | GET | `/v1/portfolios/{portfolio_id}/transactions` | Get all transactions across all wallets |
| `list_order_fills` | GET | `/v1/portfolios/{portfolio_id}/order_fills` | Get trade execution history |

#### 5. Transaction Types Supported (40+ types)

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

**Plus 30+ additional specialized transaction types**

---

### Quick Reference: Endpoints by Category

**📋 Documented Available (9+ endpoints):**
- List portfolios, get portfolio details
- Get portfolio balances (multiple balance types)
- List wallets, get wallet details
- List wallet transactions (40+ types)
- Get specific transaction
- List portfolio-wide transactions
- Get order fills (trade history)

**⚠️ PENDING LIVE TESTING:**
All endpoints require API passphrase for testing. Documentation is complete based on official Coinbase Prime API docs.

---

## Summary

### What This Guide Provides

📋 Complete API research and endpoint documentation
🔧 TypeScript & JSON configuration options
📖 Expected request/response formats
🐛 Troubleshooting guide with EC signature solutions
💡 Integration notes (platform-first approach)
📊 Complete endpoint reference (9+ endpoints, 40+ transaction types)
⚠️ Live testing PENDING (requires API passphrase)

### What You Should Do

1. **Check your platform first** - see what patterns work
2. **Get API credentials** including passphrase from Coinbase Prime
3. **Adapt this configuration** - don't copy blindly
4. **Test list portfolios endpoint** - verify signature works
5. **Implement EC Private Key signature** - critical requirement
6. **Test with passphrase** - all four headers required
7. **Enable for users** - Institutional trading data access!

### Key Reminders

⚠️ **EC Private Key signature is REQUIRED** - not HMAC, use crypto.createSign()
⚠️ **Four headers required** - KEY, SIGNATURE, TIMESTAMP, PASSPHRASE
⚠️ **Timestamp in seconds** - use `Math.floor(Date.now() / 1000)`
⚠️ **This guide is SUGGESTIVE** - your platform patterns take precedence
⚠️ **Live testing pending** - need API passphrase to verify

### Next Steps for Live Testing

Once you obtain the API passphrase:
1. Update authentication to include passphrase header
2. Run test script with all three credentials
3. Verify portfolio listing works
4. Test balance and transaction endpoints
5. Update this guide with live test results

---

**Document Version:** 1.0
**Last Updated:** 2025-11-08
**Test Status:** ⏳ PENDING (Requires API Passphrase)
**Integration Status:** Ready for Platform Integration (Pending Testing)
**Official Docs:** https://docs.cdp.coinbase.com/prime/

---

*This is a SUGGESTIVE guide based on API documentation. Live testing is pending API passphrase. AgenticLedger platform teams should inspect their existing AnyAPI configurations and follow established patterns. The configuration provided should be adapted to match your platform's conventions, field names, and integration patterns.*
