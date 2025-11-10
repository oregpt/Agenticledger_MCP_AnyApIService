# Kaiko Fair Market Value API - AnyAPICall Integration Guide (SUGGESTIVE)

**🚨 IMPORTANT: Platform-First Approach**

Before using this guide, AgenticLedger platform teams should inspect their own platform to see what patterns have previously worked for existing APIs using AnyAPICall. This document provides suggestions and guidance, but your platform's existing patterns should take precedence.

**📋 STATUS: PENDING LIVE TESTING**

This guide is based on official Kaiko API documentation. Live testing with actual API credentials is pending but all endpoint specifications are accurate according to Kaiko's documentation.

---

## Table of Contents
1. [Quick Reference](#quick-reference)
2. [API Overview](#api-overview)
3. [Suggested Configuration (TypeScript + JSON)](#suggested-configuration)
4. [Endpoint Documentation](#endpoint-documentation)
5. [Platform Integration Notes](#platform-integration-notes)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)
8. [Appendix: Complete Endpoint Directory](#appendix-complete-endpoint-directory)
9. [Summary & Action Items](#summary--action-items)

---

## Quick Reference

### API Overview

| Property | Value |
|----------|-------|
| **API Name** | Kaiko Fair Market Value API |
| **Suggested API ID** | `kaiko` |
| **Base URL (US)** | `https://us.market-api.kaiko.io` |
| **Base URL (EU)** | `https://eu.market-api.kaiko.io` |
| **Authentication** | API Key (X-Api-Key header) |
| **Rate Limits** | Varies by subscription tier |
| **Documentation** | https://docs.kaiko.com/ |
| **Primary Use Case** | Cryptocurrency pricing for financial reporting (US-GAAP, IFRS) |

### Suggested API ID
```
kaiko
```

### ⚠️ CRITICAL REQUIREMENTS

> **API Key Header - NOT OPTIONAL**
>
> All requests MUST include the `X-Api-Key` header with your Kaiko API key:
>
> ```
> X-Api-Key: <client-api-key>
> ```
>
> **Why This Matters:** Without this header, all requests will return 401 Unauthorized. This is the ONLY authentication method supported.
>
> **Where to Add This:** Add to your platform's header injection logic for the 'kaiko' API ID

> **Region Selection - IMPORTANT**
>
> Kaiko provides two regional base URLs:
> - **US:** `https://us.market-api.kaiko.io`
> - **EU:** `https://eu.market-api.kaiko.io`
>
> ```typescript
> // Recommended: Use US endpoint as default
> baseUrl: 'https://us.market-api.kaiko.io'
> ```
>
> **Why This Matters:** Choose the region closest to your servers for best performance. Both provide identical data.

### Key Requirements

- **Accept Header:** Include `Accept: application/json` (recommended)
- **Compression:** Use `--compressed` flag in curl for gzip responses
- **ISO 8601 Timestamps:** All timestamps must be in ISO 8601 format
- **Asset Codes:** Use lowercase asset codes (e.g., "btc", "eth", "usd")

---

## API Overview

### Purpose

Kaiko's Fair Market Value API provides three pricing methodologies specifically designed for cryptocurrency financial reporting under accounting standards like US-GAAP (FASB ASC 820), IFRS, and others:

1. **Direct Price** - Pricing from direct market data using Robust Weighted Median
2. **Synthetic Price** - Calculated prices through intermediary asset pairs
3. **Principal Market Price** - Compliance-focused pricing for institutional reporting

### Use Cases

- **Financial Reporting:** GAAP and IFRS compliant cryptocurrency valuations
- **Balance Sheet Pricing:** Month-end, quarter-end cryptocurrency valuations
- **Audit Support:** Auditable pricing with transparent methodologies
- **Risk Management:** Fair value pricing for treasury management
- **Tax Reporting:** Defensible pricing for tax calculations

### Covered Endpoints

This integration focuses on three established asset pricing endpoints:

1. `robust_pair_price` - Direct Price calculation
2. `spot_exchange_rate` - Synthetic Price calculation
3. `principal_market_value` - Principal Market Price for compliance

---

## Suggested Configuration

**⚠️ REMINDER:** Check your platform's existing AnyAPI configurations first!

### Option A: TypeScript Configuration (AgenticLedger Pattern)

If your platform uses TypeScript arrays like AgenticLedger:

```typescript
// In anyapicall-server.ts or equivalent

const KAIKO: APIDefinition = {
  id: 'kaiko',
  name: 'Kaiko Fair Market Value',
  description: 'Cryptocurrency pricing for financial reporting (US-GAAP, IFRS compliant)',
  baseUrl: 'https://us.market-api.kaiko.io',
  requiresAuth: true,
  authType: 'apikey',
  authHeaderName: 'X-Api-Key',
  rateLimit: {
    requestsPerMinute: null, // Varies by subscription
    requestsPerDay: null      // Check your Kaiko plan
  },
  commonHeaders: {
    'Accept': 'application/json'
  },
  endpoints: [
    {
      name: 'direct_price',
      path: '/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}',
      method: 'GET',
      description: 'Get direct market price using Robust Weighted Median methodology',
      parameters: [
        {
          name: 'base_asset',
          type: 'string',
          required: true,
          description: 'Base asset code (e.g., btc, eth) - lowercase'
        },
        {
          name: 'quote_asset',
          type: 'string',
          required: true,
          description: 'Quote asset code (e.g., usd, eur) - lowercase'
        }
      ],
      queryParams: [
        {
          name: 'interval',
          type: 'string',
          required: true,
          description: 'Time interval (e.g., 1h, 1d) - max 1 day'
        },
        {
          name: 'start_time',
          type: 'string',
          required: false,
          description: 'Start time in ISO 8601 format (inclusive)'
        },
        {
          name: 'end_time',
          type: 'string',
          required: false,
          description: 'End time in ISO 8601 format (exclusive)'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          description: 'Number of results per page'
        },
        {
          name: 'sort',
          type: 'string',
          required: false,
          description: 'Sort order: asc or desc (default: desc)'
        },
        {
          name: 'include_exchanges',
          type: 'string',
          required: false,
          description: 'Comma-separated exchange codes to include'
        },
        {
          name: 'exclude_exchanges',
          type: 'string',
          required: false,
          description: 'Comma-separated exchange codes to exclude'
        },
        {
          name: 'extrapolate_missing_values',
          type: 'boolean',
          required: false,
          description: 'Fill gaps with last available price (default: false)'
        }
      ]
    },
    {
      name: 'synthetic_price',
      path: '/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}',
      method: 'GET',
      description: 'Get synthetic price via intermediary pairs for illiquid assets',
      parameters: [
        {
          name: 'base_asset',
          type: 'string',
          required: true,
          description: 'Base asset code (e.g., dash) - lowercase'
        },
        {
          name: 'quote_asset',
          type: 'string',
          required: true,
          description: 'Quote asset code (e.g., usd, gbp) - lowercase'
        }
      ],
      queryParams: [
        {
          name: 'interval',
          type: 'string',
          required: false,
          description: 'Time interval (default: 1d)'
        },
        {
          name: 'start_time',
          type: 'string',
          required: false,
          description: 'Start time in ISO 8601 format (exclusive)'
        },
        {
          name: 'end_time',
          type: 'string',
          required: false,
          description: 'End time in ISO 8601 format (exclusive)'
        },
        {
          name: 'page_size',
          type: 'number',
          required: false,
          description: 'Results per page (max varies by interval)'
        },
        {
          name: 'sort',
          type: 'string',
          required: false,
          description: 'Sort order: asc or desc (default: desc)'
        },
        {
          name: 'include_exchanges',
          type: 'string',
          required: false,
          description: 'Comma-separated exchange codes to include'
        },
        {
          name: 'exclude_exchanges',
          type: 'string',
          required: false,
          description: 'Comma-separated exchange codes to exclude'
        },
        {
          name: 'extrapolate_missing_values',
          type: 'boolean',
          required: false,
          description: 'Fill null prices with last value (default: false)'
        },
        {
          name: 'sources',
          type: 'boolean',
          required: false,
          description: 'Include intermediary pair details (default: false)'
        }
      ]
    },
    {
      name: 'principal_market_price',
      path: '/v2/data/trades.v1/principal_market_value',
      method: 'GET',
      description: 'Get principal market value for US-GAAP and IFRS compliance',
      queryParams: [
        {
          name: 'asset',
          type: 'string',
          required: true,
          description: 'The asset code (e.g., btc, eth) - lowercase'
        },
        {
          name: 'end_time',
          type: 'string',
          required: false,
          description: 'Ending time in ISO 8601 format (current quarter only)'
        }
      ]
    }
  ]
};

// Add to CORE_APIS array
export const CORE_APIS: APIDefinition[] = [
  // ... existing APIs
  KAIKO,
];
```

### Option B: JSON Configuration (For JSON-Based Platforms)

If your platform uses JSON configuration files:

```json
{
  "id": "kaiko",
  "name": "Kaiko Fair Market Value",
  "description": "Cryptocurrency pricing for financial reporting (US-GAAP, IFRS compliant)",
  "baseUrl": "https://us.market-api.kaiko.io",
  "requiresAuth": true,
  "authType": "apikey",
  "authHeaderName": "X-Api-Key",
  "commonHeaders": {
    "Accept": "application/json"
  },
  "endpoints": [
    {
      "name": "direct_price",
      "path": "/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}",
      "method": "GET",
      "description": "Get direct market price using Robust Weighted Median methodology",
      "parameters": [
        {
          "name": "base_asset",
          "type": "string",
          "required": true,
          "description": "Base asset code (e.g., btc, eth) - lowercase"
        },
        {
          "name": "quote_asset",
          "type": "string",
          "required": true,
          "description": "Quote asset code (e.g., usd, eur) - lowercase"
        }
      ],
      "queryParams": [
        {
          "name": "interval",
          "type": "string",
          "required": true,
          "description": "Time interval (e.g., 1h, 1d) - max 1 day"
        },
        {
          "name": "start_time",
          "type": "string",
          "required": false,
          "description": "Start time in ISO 8601 format"
        },
        {
          "name": "end_time",
          "type": "string",
          "required": false,
          "description": "End time in ISO 8601 format"
        },
        {
          "name": "extrapolate_missing_values",
          "type": "boolean",
          "required": false,
          "description": "Fill gaps with last available price"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "base_asset": "btc",
          "quote_asset": "usd"
        },
        "queryParams": {
          "interval": "1h",
          "start_time": "2023-01-01T00:00:00Z",
          "end_time": "2023-01-01T23:59:59Z"
        }
      }
    },
    {
      "name": "synthetic_price",
      "path": "/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}",
      "method": "GET",
      "description": "Get synthetic price via intermediary pairs",
      "parameters": [
        {
          "name": "base_asset",
          "type": "string",
          "required": true
        },
        {
          "name": "quote_asset",
          "type": "string",
          "required": true
        }
      ],
      "queryParams": [
        {
          "name": "interval",
          "type": "string",
          "required": false,
          "description": "Time interval (default: 1d)"
        },
        {
          "name": "extrapolate_missing_values",
          "type": "boolean",
          "required": false
        }
      ]
    },
    {
      "name": "principal_market_price",
      "path": "/v2/data/trades.v1/principal_market_value",
      "method": "GET",
      "description": "Get principal market value for compliance",
      "queryParams": [
        {
          "name": "asset",
          "type": "string",
          "required": true,
          "description": "Asset code (lowercase)"
        },
        {
          "name": "end_time",
          "type": "string",
          "required": false
        }
      ]
    }
  ]
}
```

### Common Asset Codes Reference

```typescript
// Common cryptocurrency asset codes (lowercase)
const COMMON_ASSETS = {
  // Major cryptocurrencies
  bitcoin: 'btc',
  ethereum: 'eth',
  tether: 'usdt',
  binanceCoin: 'bnb',
  solana: 'sol',
  cardano: 'ada',
  dogecoin: 'doge',
  polkadot: 'dot',

  // Fiat currencies
  usDollar: 'usd',
  euro: 'eur',
  britishPound: 'gbp',
  japaneseYen: 'jpy'
};

// Common intervals
const INTERVALS = {
  oneMinute: '1m',
  fiveMinutes: '5m',
  fifteenMinutes: '15m',
  thirtyMinutes: '30m',
  oneHour: '1h',
  fourHours: '4h',
  twelveHours: '12h',
  oneDay: '1d'
};
```

### Helper Function: Format Timestamp

```typescript
// Convert JavaScript Date to ISO 8601 format for Kaiko API
function formatKaikoTimestamp(date: Date): string {
  return date.toISOString();
}

// Usage
const startTime = formatKaikoTimestamp(new Date('2023-01-01'));
// Returns: "2023-01-01T00:00:00.000Z"
```

---

## Endpoint Documentation

### 1. Direct Price (Robust Pair Price)

**Endpoint:** `GET /v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}`

**Purpose:** Calculate cryptocurrency pair prices using Robust Weighted Median (RWM) methodology by aggregating trade data.

**Use Cases:**
- Real-time pricing for liquid trading pairs
- Historical price analysis
- Pricing data for financial statements

**Path Parameters:**
- `base_asset` (required) - Asset code (e.g., "btc")
- `quote_asset` (required) - Asset code (e.g., "usd")

**Query Parameters:**
- `interval` (required) - Time unit: 1s, 1m, 1h, 1d (max 1 day)
- `start_time` (optional) - ISO 8601 timestamp (inclusive)
- `end_time` (optional) - ISO 8601 timestamp (exclusive)
- `page_size` (optional) - Results per page
- `sort` (optional) - "asc" or "desc" (default: desc)
- `include_exchanges` (optional) - Filter specific exchanges
- `exclude_exchanges` (optional) - Exclude specific exchanges
- `extrapolate_missing_values` (optional) - Fill gaps (default: false)

**Expected Response Format:**
```json
{
  "data": [
    {
      "timestamp": 1683158340000,
      "price": "15.236109727862226",
      "volume": "10.661977267122458",
      "count": 263,
      "extrapolate_missing_values": false
    }
  ],
  "result": "success",
  "continuation_token": "...",
  "next_url": "..."
}
```

**Response Fields:**
- `timestamp` - Interval start time (milliseconds since epoch)
- `price` - Robust Weighted Median price (null if insufficient trades)
- `volume` - Base asset volume traded during interval
- `count` - Total number of trades during interval
- `extrapolate_missing_values` - Whether this value was extrapolated

**Example Request (cURL):**
```bash
curl -H 'X-Api-Key: YOUR_API_KEY' \
  -H 'Accept: application/json' \
  --compressed \
  'https://us.market-api.kaiko.io/v2/data/trades.v1/robust_pair_price/btc/usd?interval=1h&start_time=2023-01-01T00:00:00Z&end_time=2023-01-01T23:59:59Z'
```

**Important Notes:**
- Returns `null` for price when insufficient trade data exists
- Use Synthetic Price endpoint as fallback for illiquid pairs
- Pagination supported via `continuation_token`

---

### 2. Synthetic Price (Spot Exchange Rate)

**Endpoint:** `GET /v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}`

**Purpose:** Calculate exchange rates between asset pairs lacking direct liquidity by routing through intermediary assets with established trading history.

**Use Cases:**
- Pricing illiquid trading pairs
- Cross-currency valuations
- IFRS-compliant fiat conversions (use USD as quote, then Oanda FX)

**Path Parameters:**
- `base_asset` (required) - Asset code (e.g., "dash")
- `quote_asset` (required) - Asset code (e.g., "usd")

**Query Parameters:**
- `start_time` (optional) - ISO 8601 timestamp (exclusive)
- `end_time` (optional) - ISO 8601 timestamp (exclusive)
- `interval` (optional) - Time bucket (default: 1d)
- `page_size` (optional) - Max results (varies by interval)
- `sort` (optional) - "asc" or "desc" (default: desc)
- `include_exchanges` (optional) - Exchange filter
- `exclude_exchanges` (optional) - Exchange exclusion
- `extrapolate_missing_values` (optional) - Fill nulls (default: false)
- `sources` (optional) - Include intermediary details (default: false)

**Expected Response Format:**
```json
{
  "data": [
    {
      "timestamp": 1683158340000,
      "price": "49.263380298334226",
      "extrapolated": false
    }
  ],
  "continuation_token": "...",
  "next_url": "..."
}
```

**Response Fields:**
- `price` - Aggregated Robust Weighted Median using liquidity path engine
- `extrapolated` - Boolean indicating if value was filled from previous data

**Example Request (cURL):**
```bash
curl -H 'X-Api-Key: YOUR_API_KEY' \
  -H 'Accept: application/json' \
  --compressed \
  'https://us.market-api.kaiko.io/v2/data/trades.v2/spot_exchange_rate/dash/usd?interval=1m&start_time=2023-05-03T00:01:00.000Z&end_time=2023-05-04T00:00:00.000Z'
```

**Important Notes:**
- Liquidity paths recalculate every 4 hours
- For IFRS compliance, use USD as quote asset then apply Oanda FX conversion
- Returns `null` for periods without trades (unless extrapolation enabled)

---

### 3. Principal Market Price

**Endpoint:** `GET /v2/data/trades.v1/principal_market_value`

**Purpose:** Provide principal market value prices for crypto assets for financial reporting under US-GAAP (FASB ASC 820), IFRS, and other accounting frameworks.

**Use Cases:**
- Quarter-end financial statement valuations
- Audit-compliant cryptocurrency pricing
- Balance sheet fair value measurements
- Tax reporting with defensible pricing

**Query Parameters:**
- `asset` (required) - The desired base asset code (e.g., "btc")
- `end_time` (optional) - Ending time in ISO 8601 format (current quarter only)

**Expected Response Format:**
```json
{
  "query": {
    "asset": "btc",
    "end_time": "2025-09-09T15:00:00.000Z"
  },
  "data": [
    {
      "timestamp": 1694270400000,
      "price": "26543.12",
      "last_trade_timestamp": 1694270350000,
      "principal_market_name": "Binance",
      "principal_market_code": "bnce",
      "adtv_2w": "2543.5",
      "total_adtv_2w": "5432.8"
    }
  ],
  "next_url": null
}
```

**Response Fields:**
- `timestamp` - Time when the value was calculated
- `price` - Principal Market Value in USD
- `last_trade_timestamp` - Timestamp of the corresponding trade
- `principal_market_name` - Exchange name where trade executed
- `principal_market_code` - Exchange code where trade executed
- `adtv_2w` - Two-week average daily trading volume (base asset)
- `total_adtv_2w` - Two-week ADTV across eligible exchanges

**Example Request (cURL):**
```bash
curl -H 'X-Api-Key: YOUR_API_KEY' \
  -H 'Accept: application/json' \
  --compressed \
  'https://us.market-api.kaiko.io/v2/data/trades.v1/principal_market_value?asset=btc&end_time=2025-09-09T15:00:00.000Z'
```

**Important Notes:**
- Specifically designed for compliance with accounting standards
- Data available for current quarter only
- Provides transparent principal market identification

---

## Platform Integration Notes

### STEP 1: Check Your Platform First! 🔍

1. Review existing APIs in your platform
2. Identify common patterns for API key authentication
3. Check how other APIs handle path parameters
4. Match your platform's naming conventions

### STEP 2: Adapt the Configuration

**Key Adaptations:**
- If your platform uses different auth header patterns, adjust `authHeaderName`
- Ensure asset codes are lowercased in your platform's request builder
- Consider adding region selection (US vs EU) as a configuration option

### STEP 3: Handle Special Requirements

**API Key Header Handling:**

```typescript
// Example: Custom header handling for Kaiko
export function makeApiCall(args: any) {
  const headers: Record<string, string> = {
    'Accept': 'application/json'
  };

  // Add Kaiko API key header
  if (args.apiId === 'kaiko') {
    if (!args.accessToken) {
      throw new Error('Kaiko API requires an API key in accessToken parameter');
    }
    headers['X-Api-Key'] = args.accessToken;
  }

  return axios.request({
    url: buildUrl(args),
    method: args.method || 'GET',
    headers,
    // Enable gzip compression
    decompress: true
  });
}
```

**Path Parameter Formatting:**

```typescript
// Helper to ensure lowercase asset codes
function formatAssetCode(code: string): string {
  return code.toLowerCase().trim();
}

// Usage in URL building
const baseAsset = formatAssetCode(args.pathParams.base_asset);
const quoteAsset = formatAssetCode(args.pathParams.quote_asset);
const path = `/v2/data/trades.v1/robust_pair_price/${baseAsset}/${quoteAsset}`;
```

### STEP 4: Add Helper Functions

```typescript
// ISO 8601 timestamp formatter
export function formatKaikoTimestamp(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

// Interval validator
const VALID_INTERVALS = ['1s', '1m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d'];

export function validateInterval(interval: string): boolean {
  return VALID_INTERVALS.includes(interval);
}

// Build query params with validation
export function buildKaikoQueryParams(params: any): string {
  const queryParams = new URLSearchParams();

  if (params.interval) {
    if (!validateInterval(params.interval)) {
      throw new Error(`Invalid interval: ${params.interval}. Must be one of: ${VALID_INTERVALS.join(', ')}`);
    }
    queryParams.append('interval', params.interval);
  }

  if (params.start_time) {
    queryParams.append('start_time', formatKaikoTimestamp(params.start_time));
  }

  if (params.end_time) {
    queryParams.append('end_time', formatKaikoTimestamp(params.end_time));
  }

  if (params.extrapolate_missing_values !== undefined) {
    queryParams.append('extrapolate_missing_values', String(params.extrapolate_missing_values));
  }

  return queryParams.toString();
}
```

### STEP 5: Quick Integration Checklist

For TypeScript-based platforms (like AgenticLedger):

- [ ] Add Kaiko definition to CORE_APIS array
- [ ] Add X-Api-Key header handling for 'kaiko' apiId
- [ ] Implement asset code lowercase formatting
- [ ] Add timestamp formatting helper
- [ ] Add interval validation
- [ ] Test with Direct Price endpoint first
- [ ] Verify path parameter substitution
- [ ] Test authentication with valid API key
- [ ] Check error handling for null prices
- [ ] Enable for test organization

For JSON-based platforms:

- [ ] Add JSON config to config/apis.json
- [ ] Restart server (no rebuild needed)
- [ ] Configure X-Api-Key header in platform settings
- [ ] Test Direct Price endpoint
- [ ] Verify timestamp formatting
- [ ] Test Synthetic Price endpoint
- [ ] Test Principal Market Price endpoint
- [ ] Enable for production

---

## Usage Examples

### Example 1: Get Bitcoin Price in USD (Direct Price)

```typescript
// Get hourly BTC/USD prices for January 1, 2023
const response = await makeApiCall({
  apiId: 'kaiko',
  accessToken: process.env.KAIKO_API_KEY,
  endpoint: '/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}',
  pathParams: {
    base_asset: 'btc',
    quote_asset: 'usd'
  },
  queryParams: {
    interval: '1h',
    start_time: '2023-01-01T00:00:00Z',
    end_time: '2023-01-02T00:00:00Z'
  }
});

console.log(response.data);
// Returns hourly price data for 24 hours
```

### Example 2: Get Illiquid Pair Price (Synthetic Price)

```typescript
// Get DASH/USD synthetic price (routes through BTC or ETH)
const response = await makeApiCall({
  apiId: 'kaiko',
  accessToken: process.env.KAIKO_API_KEY,
  endpoint: '/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}',
  pathParams: {
    base_asset: 'dash',
    quote_asset: 'usd'
  },
  queryParams: {
    interval: '1d',
    start_time: '2023-05-01T00:00:00Z',
    end_time: '2023-05-31T23:59:59Z',
    extrapolate_missing_values: true,
    sources: true  // Show which intermediary pairs were used
  }
});

console.log(response.data);
// Returns daily prices with routing information
```

### Example 3: Get Quarter-End Principal Market Price

```typescript
// Get Q3 2025 principal market value for Bitcoin (for financial reporting)
const response = await makeApiCall({
  apiId: 'kaiko',
  accessToken: process.env.KAIKO_API_KEY,
  endpoint: '/v2/data/trades.v1/principal_market_value',
  queryParams: {
    asset: 'btc',
    end_time: '2025-09-30T23:59:59Z'  // Q3 end
  }
});

console.log(response.data);
// Returns principal market price with exchange details for compliance
```

### Example 4: Handle Null Prices (Fallback to Synthetic)

```typescript
// Try direct price first, fallback to synthetic if null
async function getBestPrice(baseAsset: string, quoteAsset: string, timestamp: string) {
  // Try direct price
  const directResponse = await makeApiCall({
    apiId: 'kaiko',
    accessToken: process.env.KAIKO_API_KEY,
    endpoint: '/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}',
    pathParams: { base_asset: baseAsset, quote_asset: quoteAsset },
    queryParams: {
      interval: '1h',
      start_time: timestamp,
      end_time: new Date(new Date(timestamp).getTime() + 3600000).toISOString()
    }
  });

  // Check if price is null (insufficient liquidity)
  if (directResponse.data.data[0]?.price === null) {
    console.log('Direct price unavailable, trying synthetic...');

    // Fallback to synthetic price
    const syntheticResponse = await makeApiCall({
      apiId: 'kaiko',
      accessToken: process.env.KAIKO_API_KEY,
      endpoint: '/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}',
      pathParams: { base_asset: baseAsset, quote_asset: quoteAsset },
      queryParams: {
        interval: '1h',
        start_time: timestamp
      }
    });

    return syntheticResponse.data.data[0];
  }

  return directResponse.data.data[0];
}

// Usage
const price = await getBestPrice('dash', 'usd', '2023-05-03T12:00:00Z');
console.log(`Price: $${price.price}`);
```

---

## Troubleshooting

### Issue 1: 401 Unauthorized

**Symptoms:** All requests return 401 status with "Unauthorized" message

**Cause:** Missing or invalid API key in X-Api-Key header

**Solution:**
1. Verify you have a valid Kaiko API key
2. Ensure header is named exactly `X-Api-Key` (case-sensitive)
3. Check that API key is passed in `accessToken` parameter
4. Verify no extra spaces in API key

```typescript
// Correct header format
headers['X-Api-Key'] = apiKey.trim();  // Remove any whitespace
```

### Issue 2: Asset Code Not Found

**Symptoms:** 404 error or empty results for valid asset

**Cause:** Asset codes must be lowercase

**Solution:**
```typescript
// Always lowercase asset codes
const baseAsset = userInput.toLowerCase();  // "BTC" → "btc"
const quoteAsset = userQuote.toLowerCase(); // "USD" → "usd"
```

### Issue 3: Invalid Timestamp Format

**Symptoms:** 400 Bad Request with timestamp validation error

**Cause:** Timestamp not in ISO 8601 format

**Solution:**
```typescript
// Use ISO 8601 format
const timestamp = new Date('2023-01-01').toISOString();
// Correct: "2023-01-01T00:00:00.000Z"

// NOT: "2023-01-01" (missing time)
// NOT: "01/01/2023" (wrong format)
```

### Issue 4: Null Price Returned

**Symptoms:** Response succeeds but `price` field is `null`

**Cause:** Insufficient trade data for the specified interval and pair

**Solution:**
1. Try a longer time interval (e.g., 1d instead of 1h)
2. Use Synthetic Price endpoint instead
3. Enable extrapolation: `extrapolate_missing_values=true`
4. Check if trading pair has liquidity on included exchanges

```typescript
// Enable extrapolation for sparse data
queryParams.extrapolate_missing_values = true;
```

### Issue 5: Interval Too Large

**Symptoms:** 400 error mentioning interval limit

**Cause:** Maximum interval is 1 day (1d)

**Solution:**
```typescript
// Valid intervals (max 1d)
const validIntervals = ['1s', '1m', '1h', '1d'];

// Invalid intervals
const invalidIntervals = ['2d', '1w', '1M'];  // Too large

// For longer periods, make multiple requests
async function getMonthlyData(baseAsset, quoteAsset, month) {
  const results = [];
  const daysInMonth = new Date(month.year, month.month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const start = new Date(month.year, month.month - 1, day);
    const end = new Date(month.year, month.month - 1, day + 1);

    const response = await makeApiCall({
      // ... use 1d interval for each day
      queryParams: {
        interval: '1d',
        start_time: start.toISOString(),
        end_time: end.toISOString()
      }
    });

    results.push(...response.data.data);
  }

  return results;
}
```

### Issue 6: Rate Limit Exceeded

**Symptoms:** 429 Too Many Requests

**Cause:** Exceeded your subscription's rate limit

**Solution:**
1. Check your Kaiko subscription tier limits
2. Implement rate limiting in your platform
3. Use pagination instead of large single requests
4. Consider caching results for frequently requested data

```typescript
// Simple rate limiter
class KaikoRateLimiter {
  private lastRequest: number = 0;
  private minInterval: number = 1000; // 1 second between requests

  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    this.lastRequest = Date.now();
  }
}

// Usage
const rateLimiter = new KaikoRateLimiter();
await rateLimiter.throttle();
const response = await makeApiCall({...});
```

---

## Appendix: Complete Endpoint Directory

**🚨 CRITICAL: This section is REQUIRED for AgenticLedger integration**

### Why This Matters

AgenticLedger's capability selection UI needs a complete list of all endpoints with descriptions to show users what actions they can perform with this API.

### Complete Endpoint Directory (Name → Description)

#### Established Assets - Fair Market Value (3 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `direct_price` | GET | `/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}` | Get direct market price using Robust Weighted Median methodology for liquid trading pairs |
| `synthetic_price` | GET | `/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}` | Calculate synthetic exchange rates through intermediary pairs for illiquid assets |
| `principal_market_price` | GET | `/v2/data/trades.v1/principal_market_value` | Get principal market value pricing for financial reporting compliance (US-GAAP, IFRS) |

### Quick Reference: Endpoints by Test Status

**✅ Live Tested & Verified (0 endpoints):**
- None - Awaiting Kaiko API credentials for live testing

**📋 Documented Based on Official API Docs (3 endpoints):**
- `direct_price` - Verified against Kaiko documentation
- `synthetic_price` - Verified against Kaiko documentation
- `principal_market_price` - Verified against Kaiko documentation

**🔄 Ready for Testing (3 endpoints):**
- All endpoints ready for immediate testing once API credentials are available

---

## Summary

### What This Guide Provides

- ✅ Complete integration specifications for 3 Kaiko pricing endpoints
- ✅ TypeScript and JSON configuration examples
- ✅ Authentication setup (X-Api-Key header)
- ✅ Helper functions for timestamps and asset codes
- ✅ Usage examples for all three pricing methodologies
- ✅ Comprehensive troubleshooting guide
- ✅ Endpoint directory for platform integration

### What You Should Do

**Immediate Actions:**
1. Review your platform's existing API integration patterns
2. Obtain Kaiko API credentials from Kaiko.com
3. Add Kaiko configuration to your platform using provided examples
4. Test Direct Price endpoint first (most common use case)
5. Implement helper functions for timestamp formatting

**Testing Priority:**
1. Direct Price (`robust_pair_price`) - Test with BTC/USD
2. Synthetic Price (`spot_exchange_rate`) - Test with DASH/USD
3. Principal Market Price (`principal_market_value`) - Test with BTC

**Integration Timeline:**
- Configuration: 15-30 minutes
- Helper functions: 15 minutes
- Testing: 30-60 minutes (once credentials available)
- **Total: ~2 hours**

### Key Reminders

1. **Authentication:** Always include `X-Api-Key` header
2. **Asset Codes:** Must be lowercase (btc, eth, usd)
3. **Timestamps:** Use ISO 8601 format (`2023-01-01T00:00:00Z`)
4. **Intervals:** Maximum 1 day (1d), cannot exceed
5. **Null Prices:** Use Synthetic Price as fallback for illiquid pairs
6. **Compliance:** Principal Market Price designed specifically for GAAP/IFRS
7. **Region:** Choose US or EU endpoint based on server location

### Next Steps

1. **Get API Credentials:** Contact Kaiko for API key
2. **Test Live:** Run test calls with provided examples
3. **Document Results:** Update this guide with live test data
4. **Update Status:** Change from "PENDING LIVE TESTING" to "PRODUCTION READY"
5. **Enable for Users:** Make available in production environment

---

**Document Version:** 1.0
**Last Updated:** 2025-01-09
**Test Status:** 📋 Pending Live Testing (Awaiting API Credentials)
**Integration Status:** Ready for Platform Integration
**Based On:** Official Kaiko API Documentation (https://docs.kaiko.com/)

---

**Special Notes:**

This guide was created based on comprehensive review of Kaiko's official API documentation. All endpoint specifications, parameters, and response formats are accurate according to Kaiko's published docs. Live testing will be performed once API credentials are obtained, and this document will be updated with real test results.

**Recommended Test Sequence (When Credentials Available):**
1. Test `/robust_pair_price/btc/usd?interval=1h` (most liquid pair)
2. Test `/spot_exchange_rate/dash/usd?interval=1d` (synthetic pricing)
3. Test `/principal_market_value?asset=btc` (compliance pricing)

All three endpoints are production-ready for integration based on official documentation.
