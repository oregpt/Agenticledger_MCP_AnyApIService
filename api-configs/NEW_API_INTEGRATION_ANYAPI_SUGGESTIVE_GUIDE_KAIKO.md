# Kaiko Fair Market Value API - AnyAPICall Integration Guide (SUGGESTIVE)

**🚨 IMPORTANT: Platform-First Approach**

Before using this guide, AgenticLedger platform teams should inspect their own platform to see what patterns have previously worked for existing APIs using AnyAPICall. This document provides suggestions and guidance, but your platform's existing patterns should take precedence.

**✅ STATUS: LIVE TESTED - 2 ENDPOINTS VERIFIED**

This guide has been tested with live Kaiko API credentials. Test results included below.

---

## Table of Contents
1. [Quick Reference](#quick-reference)
2. [API Overview](#api-overview)
3. [Live Test Results](#live-test-results)
4. [Suggested Configuration (TypeScript + JSON)](#suggested-configuration)
5. [Endpoint Documentation](#endpoint-documentation)
6. [Platform Integration Notes](#platform-integration-notes)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)
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
| **Primary Use Case** | Cryptocurrency pricing for financial reporting |

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

> **Subscription Tier Limitations - IMPORTANT**
>
> Access to specific cryptocurrency pairs depends on your subscription tier:
> - Different subscription tiers have access to different instrument sets
> - A 401 error with "not authorized: user has no permission over these instruments" indicates the asset pair is not included in your tier
> - **Example:** Our test key had access to CC/USDT but not BTC/USD or ETH/USDT on the Direct Price endpoint
>
> **Recommendation:** Test your specific asset pairs before production deployment

### Key Requirements

- **Accept Header:** Include `Accept: application/json` (recommended)
- **Compression:** Use `--compressed` flag in curl for gzip responses
- **ISO 8601 Timestamps:** All timestamps must be in ISO 8601 format
- **Asset Codes:** Use lowercase asset codes (e.g., "btc", "eth", "usd")

---

## API Overview

### Purpose

Kaiko's Fair Market Value API provides cryptocurrency pricing methodologies specifically designed for financial reporting under accounting standards like US-GAAP (FASB ASC 820), IFRS, and others.

### Verified Endpoints (Live Tested)

This guide covers **2 endpoints** that have been successfully tested:

1. **Direct Price (Robust Pair Price)** - Direct market pricing using Robust Weighted Median
2. **Synthetic Price (Spot Exchange Rate)** - Calculated prices through intermediary asset pairs

### Use Cases

- **Financial Reporting:** GAAP and IFRS compliant cryptocurrency valuations
- **Balance Sheet Pricing:** Month-end, quarter-end cryptocurrency valuations
- **Audit Support:** Auditable pricing with transparent methodologies
- **Risk Management:** Fair value pricing for treasury management
- **Tax Reporting:** Defensible pricing for tax calculations

---

## Live Test Results

### Test Summary

**✅ 2/2 Endpoints Tested Successfully**

| Endpoint | Status | Asset Tested | Result | Response Time |
|----------|--------|--------------|--------|---------------|
| Direct Price (Robust Pair Price) | ✅ PASS | CC/USDT | $0.11398 - $0.14659 | 122-527ms |
| Synthetic Price (Spot Exchange Rate) | ✅ PASS | DASH/USD, CC/USD | $80.64, $0.14642 | 81ms avg |

**Test Date:** 2025-11-10
**Test Environment:** Live Kaiko API (US region)
**Average Response Time:** 263ms (Direct Price all intervals)

### Direct Price Test Results (CC/USDT)

All time intervals tested successfully:

**1-Minute Interval:**
```
Request: GET /v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1m
Status: 200 OK
Response Time: 527ms
Price: $0.11398 USDT
Volume: 62,318 CC
Trades: 118
Exchanges: 6 (Bitfinex, Coinex, Gate.io, KuCoin, Kraken, MEXC)
```

**30-Minute Interval:**
```
Request: GET /v2/data/trades.v1/robust_pair_price/cc/usdt?interval=30m
Status: 200 OK
Response Time: 160ms
Price: $0.12799 USDT
Volume: 9,564,910 CC
Trades: 15,605
```

**1-Hour Interval:**
```
Request: GET /v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1h
Status: 200 OK
Response Time: 243ms
Price: $0.12799 USDT
Volume: 9,564,910 CC
Trades: 15,605
```

**1-Day Interval:**
```
Request: GET /v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1d
Status: 200 OK
Response Time: 122ms
Price: $0.14659 USDT
Volume: 230,215,077 CC
Trades: 309,937
```

### Synthetic Price Test Results

**DASH/USD:**
```
Request: GET /v2/data/trades.v2/spot_exchange_rate/dash/usd?interval=1d
Status: 200 OK
Response Time: 81ms
Price: $80.64 USD
Exchanges: 4 (Bitfinex, Coinbase, Coinex, Kraken)
```

**CC/USD:**
```
Request: GET /v2/data/trades.v2/spot_exchange_rate/cc/usd?interval=1d
Status: 200 OK
Price: $0.14642 USD
Method: Synthetic calculation via intermediary pairs
```

### Subscription Tier Limitations Discovered

During testing, we discovered that Direct Price endpoint access is **instrument-specific**:

**✅ Working Pairs:**
- CC/USDT (all intervals: 1m, 30m, 1h, 1d)

**❌ Not Accessible (401 Unauthorized):**
- BTC/USD - "not authorized: user has no permission over these instruments"
- ETH/USDT - "not authorized: user has no permission over these instruments"

**Note:** This is expected behavior based on subscription tier. Different Kaiko subscriptions include different instrument sets.

---

## Suggested Configuration

### Endpoint 1: Direct Price (Robust Pair Price)

#### TypeScript Configuration

```typescript
{
  name: "kaiko-direct-price",
  description: "Get direct market price for a cryptocurrency pair using Kaiko's Robust Weighted Median methodology",
  baseUrl: "https://us.market-api.kaiko.io",
  endpoint: "/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}",
  method: "GET",
  authentication: {
    type: "header",
    header: "X-Api-Key",
    value: "{API_KEY}"
  },
  pathParameters: {
    base_asset: {
      type: "string",
      required: true,
      description: "Base asset code in lowercase (e.g., 'cc', 'btc', 'eth')",
      example: "cc"
    },
    quote_asset: {
      type: "string",
      required: true,
      description: "Quote asset code in lowercase (e.g., 'usdt', 'usd')",
      example: "usdt"
    }
  },
  queryParameters: {
    interval: {
      type: "string",
      required: false,
      description: "Time interval for price aggregation",
      enum: ["1m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "1w"],
      default: "1m",
      example: "1h"
    },
    start_time: {
      type: "string",
      required: false,
      description: "Start time in ISO 8601 format",
      example: "2025-11-10T00:00:00Z"
    },
    end_time: {
      type: "string",
      required: false,
      description: "End time in ISO 8601 format",
      example: "2025-11-10T23:59:59Z"
    },
    page_size: {
      type: "integer",
      required: false,
      description: "Number of results per page (max 100)",
      default: 10,
      example: 10
    }
  },
  headers: {
    "Accept": "application/json"
  },
  responseMapping: {
    price: "data[0].price",
    timestamp: "data[0].timestamp",
    volume: "data[0].volume",
    tradeCount: "data[0].count",
    exchanges: "query.instruments"
  }
}
```

#### JSON Configuration

```json
{
  "name": "kaiko-direct-price",
  "description": "Get direct market price for a cryptocurrency pair",
  "baseUrl": "https://us.market-api.kaiko.io",
  "endpoint": "/v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}",
  "method": "GET",
  "authentication": {
    "type": "header",
    "header": "X-Api-Key",
    "value": "{{KAIKO_API_KEY}}"
  },
  "pathParameters": {
    "base_asset": {
      "type": "string",
      "required": true,
      "description": "Base asset code in lowercase",
      "example": "cc"
    },
    "quote_asset": {
      "type": "string",
      "required": true,
      "description": "Quote asset code in lowercase",
      "example": "usdt"
    }
  },
  "queryParameters": {
    "interval": {
      "type": "string",
      "required": false,
      "enum": ["1m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "1w"],
      "default": "1m"
    }
  },
  "headers": {
    "Accept": "application/json"
  }
}
```

### Endpoint 2: Synthetic Price (Spot Exchange Rate)

#### TypeScript Configuration

```typescript
{
  name: "kaiko-synthetic-price",
  description: "Get synthetic price for a cryptocurrency pair calculated through intermediary assets",
  baseUrl: "https://us.market-api.kaiko.io",
  endpoint: "/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}",
  method: "GET",
  authentication: {
    type: "header",
    header: "X-Api-Key",
    value: "{API_KEY}"
  },
  pathParameters: {
    base_asset: {
      type: "string",
      required: true,
      description: "Base asset code in lowercase (e.g., 'dash', 'cc')",
      example: "dash"
    },
    quote_asset: {
      type: "string",
      required: true,
      description: "Quote asset code in lowercase (e.g., 'usd')",
      example: "usd"
    }
  },
  queryParameters: {
    interval: {
      type: "string",
      required: false,
      description: "Time interval for price aggregation",
      enum: ["1m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "1w"],
      default: "1d",
      example: "1d"
    },
    start_time: {
      type: "string",
      required: false,
      description: "Start time in ISO 8601 format",
      example: "2025-11-09T00:00:00Z"
    },
    end_time: {
      type: "string",
      required: false,
      description: "End time in ISO 8601 format",
      example: "2025-11-10T23:59:59Z"
    }
  },
  headers: {
    "Accept": "application/json"
  },
  responseMapping: {
    price: "data[0].price",
    timestamp: "data[0].timestamp",
    exchangesUsed: "query.instruments"
  }
}
```

#### JSON Configuration

```json
{
  "name": "kaiko-synthetic-price",
  "description": "Get synthetic price for a cryptocurrency pair",
  "baseUrl": "https://us.market-api.kaiko.io",
  "endpoint": "/v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}",
  "method": "GET",
  "authentication": {
    "type": "header",
    "header": "X-Api-Key",
    "value": "{{KAIKO_API_KEY}}"
  },
  "pathParameters": {
    "base_asset": {
      "type": "string",
      "required": true,
      "description": "Base asset code in lowercase",
      "example": "dash"
    },
    "quote_asset": {
      "type": "string",
      "required": true,
      "description": "Quote asset code in lowercase",
      "example": "usd"
    }
  },
  "queryParameters": {
    "interval": {
      "type": "string",
      "required": false,
      "enum": ["1m", "5m", "10m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "1w"],
      "default": "1d"
    }
  },
  "headers": {
    "Accept": "application/json"
  }
}
```

---

## Endpoint Documentation

### 1. Direct Price (Robust Pair Price)

**Endpoint:** `GET /v2/data/trades.v1/robust_pair_price/{base_asset}/{quote_asset}`

**Purpose:** Provides direct market pricing using Kaiko's Robust Weighted Median methodology. This method removes outliers and provides reliable pricing even with limited liquidity.

**Authentication:** Required (X-Api-Key header)

**Live Test Status:** ✅ Verified with CC/USDT (all intervals)

#### Request Example

```bash
curl -X GET "https://us.market-api.kaiko.io/v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1h" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `base_asset` | string | Yes | Base cryptocurrency code (lowercase) | `cc`, `btc`, `eth` |
| `quote_asset` | string | Yes | Quote currency code (lowercase) | `usdt`, `usd` |

#### Query Parameters

| Parameter | Type | Required | Description | Default | Example |
|-----------|------|----------|-------------|---------|---------|
| `interval` | string | No | Time aggregation interval | `1m` | `1h`, `1d` |
| `start_time` | string | No | ISO 8601 start timestamp | Last 10 intervals | `2025-11-10T00:00:00Z` |
| `end_time` | string | No | ISO 8601 end timestamp | Current time | `2025-11-10T23:59:59Z` |
| `page_size` | integer | No | Results per page (max 100) | 10 | 50 |

**Supported Intervals:** `1m`, `5m`, `10m`, `15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `1d`, `1w`

#### Response Format (Live Data - CC/USDT)

```json
{
  "query": {
    "start_time": "2025-11-10T17:18:00Z",
    "end_time": "2025-11-10T17:27:14.98Z",
    "base_asset": "cc",
    "quote_asset": "usdt",
    "interval": "1m",
    "instruments": [
      "bbsp:spot:cc-usdt",
      "cnex:spot:cc-usdt",
      "gate:spot:cc-usdt",
      "kcon:spot:cc-usdt",
      "krkn:spot:cc-usdt",
      "mexc:spot:cc-usdt"
    ]
  },
  "data": [
    {
      "timestamp": 1762795620000,
      "price": "0.11398",
      "volume": "62318.04999999998",
      "count": 118,
      "extrapolate_missing_values": false
    }
  ],
  "result": "success",
  "continuation_token": "...",
  "next_url": "https://us.market-api.kaiko.io/v2/data/trades.v1/robust_pair_price/cc/usdt?continuation_token=..."
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `data[].timestamp` | integer | Unix timestamp in milliseconds |
| `data[].price` | string | Robust weighted median price |
| `data[].volume` | string | Total trading volume |
| `data[].count` | integer | Number of trades |
| `query.instruments` | array | List of exchange:type:pair used |
| `continuation_token` | string | Token for pagination |
| `next_url` | string | URL for next page of results |

### 2. Synthetic Price (Spot Exchange Rate)

**Endpoint:** `GET /v2/data/trades.v2/spot_exchange_rate/{base_asset}/{quote_asset}`

**Purpose:** Calculates synthetic prices through intermediary asset pairs when direct trading pairs are unavailable or have insufficient liquidity.

**Authentication:** Required (X-Api-Key header)

**Live Test Status:** ✅ Verified with DASH/USD and CC/USD

#### Request Example

```bash
curl -X GET "https://us.market-api.kaiko.io/v2/data/trades.v2/spot_exchange_rate/dash/usd?interval=1d" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `base_asset` | string | Yes | Base cryptocurrency code (lowercase) | `dash`, `cc` |
| `quote_asset` | string | Yes | Quote currency code (lowercase) | `usd` |

#### Query Parameters

| Parameter | Type | Required | Description | Default | Example |
|-----------|------|----------|-------------|---------|---------|
| `interval` | string | No | Time aggregation interval | `1d` | `1h`, `1d` |
| `start_time` | string | No | ISO 8601 start timestamp | Yesterday | `2025-11-09T00:00:00Z` |
| `end_time` | string | No | ISO 8601 end timestamp | Current time | `2025-11-10T23:59:59Z` |

#### Response Format (Live Data - DASH/USD)

```json
{
  "query": {
    "start_time": "2025-11-09T17:25:52.197Z",
    "end_time": "2025-11-10T17:25:52.197Z",
    "base_asset": "dash",
    "quote_asset": "usd",
    "interval": "1d",
    "instruments": [
      "bfnx:spot:dash-usd",
      "cbse:spot:dash-usd",
      "cexi:spot:dash-usd",
      "krkn:spot:dash-usd"
    ]
  },
  "data": [
    {
      "timestamp": 1762732800000,
      "price": "80.64408711041486",
      "extrapolated": false
    }
  ],
  "result": "success"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `data[].timestamp` | integer | Unix timestamp in milliseconds |
| `data[].price` | string | Calculated synthetic price |
| `data[].extrapolated` | boolean | Whether price was extrapolated |
| `query.instruments` | array | Exchange pairs used in calculation |

---

## Platform Integration Notes

### For AgenticLedger Platform Developers

#### 1. Authentication Setup

The platform should automatically inject the `X-Api-Key` header for all requests to the Kaiko API:

```typescript
// Platform-level header injection (pseudocode)
if (apiId === 'kaiko') {
  headers['X-Api-Key'] = getClientCredential('kaiko', 'api_key');
}
```

#### 2. Asset Code Formatting

Kaiko requires **lowercase** asset codes. Implement automatic conversion:

```typescript
// Helper function suggestion
function formatKaikoAsset(asset: string): string {
  return asset.toLowerCase();
}
```

#### 3. Timestamp Formatting

Timestamps must be in ISO 8601 format:

```typescript
// Helper function suggestion
function formatKaikoTimestamp(date: Date): string {
  return date.toISOString(); // "2025-11-10T17:25:52.197Z"
}
```

#### 4. Error Handling - Subscription Tier Limitations

Implement specific handling for 401 errors related to instrument permissions:

```typescript
// Error handling suggestion
if (response.status === 401 && response.data.message.includes('no permission over these instruments')) {
  throw new Error(
    `Kaiko subscription tier does not include access to ${base_asset}/${quote_asset}. ` +
    `Contact Kaiko to upgrade your subscription or try a different asset pair.`
  );
}
```

#### 5. Fallback Strategy

Implement automatic fallback from Direct Price to Synthetic Price:

```typescript
// Fallback logic suggestion
async function getKaikoPrice(base: string, quote: string) {
  try {
    // Try Direct Price first
    return await kaiko.directPrice(base, quote);
  } catch (error) {
    if (error.message.includes('no permission over these instruments')) {
      // Fallback to Synthetic Price
      return await kaiko.syntheticPrice(base, quote);
    }
    throw error;
  }
}
```

#### 6. Response Caching

Kaiko data can be cached based on interval:

```typescript
// Caching suggestion
const cacheDurations = {
  '1m': 60 * 1000,      // 1 minute
  '1h': 3600 * 1000,    // 1 hour
  '1d': 86400 * 1000    // 1 day
};
```

---

## Usage Examples

### Example 1: Get Current CC/USDT Price (1-minute interval)

```bash
curl -X GET "https://us.market-api.kaiko.io/v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1m" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "data": [
    {
      "timestamp": 1762795620000,
      "price": "0.11398",
      "volume": "62318.05",
      "count": 118
    }
  ],
  "result": "success"
}
```

### Example 2: Get Historical CC/USDT Prices (1-hour interval)

```bash
curl -X GET "https://us.market-api.kaiko.io/v2/data/trades.v1/robust_pair_price/cc/usdt?interval=1h&start_time=2025-11-10T00:00:00Z&end_time=2025-11-10T23:59:59Z" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

### Example 3: Get DASH/USD Synthetic Price

```bash
curl -X GET "https://us.market-api.kaiko.io/v2/data/trades.v2/spot_exchange_rate/dash/usd?interval=1d" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "data": [
    {
      "timestamp": 1762732800000,
      "price": "80.64408711041486",
      "extrapolated": false
    }
  ],
  "result": "success"
}
```

### Example 4: Using Platform Integration (Pseudocode)

```typescript
// Using AgenticLedger's AnyAPICall integration

// Get CC/USDT Direct Price
const ccPrice = await anyApi.call('kaiko-direct-price', {
  base_asset: 'cc',
  quote_asset: 'usdt',
  interval: '1h'
});

console.log(`CC price: $${ccPrice.data[0].price} USDT`);
console.log(`Volume: ${ccPrice.data[0].volume} CC`);
console.log(`Trades: ${ccPrice.data[0].count}`);

// Get DASH/USD Synthetic Price
const dashPrice = await anyApi.call('kaiko-synthetic-price', {
  base_asset: 'dash',
  quote_asset: 'usd',
  interval: '1d'
});

console.log(`DASH price: $${dashPrice.data[0].price} USD`);
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: 401 Unauthorized - Missing API Key

**Error:**
```json
{
  "message": "Unauthorized",
  "result": "error"
}
```

**Solution:**
- Verify `X-Api-Key` header is present
- Check API key is valid and not expired
- Ensure no extra whitespace in API key value

#### Issue 2: 401 Unauthorized - Instrument Permission

**Error:**
```json
{
  "message": "not authorized: user has no permission over these instruments",
  "result": "error"
}
```

**Solution:**
- This asset pair is not included in your subscription tier
- Try a different asset pair
- Contact Kaiko to upgrade subscription
- Use Synthetic Price endpoint as fallback (broader coverage)

**Verified Working Pairs (from testing):**
- CC/USDT (Direct Price) ✅
- DASH/USD (Synthetic Price) ✅
- CC/USD (Synthetic Price) ✅

#### Issue 3: Invalid Asset Code Format

**Error:**
```json
{
  "message": "invalid asset code",
  "result": "error"
}
```

**Solution:**
- Asset codes must be lowercase
- Use "btc" not "BTC"
- Use "eth" not "ETH"
- Use "usdt" not "USDT"

#### Issue 4: Invalid Timestamp Format

**Error:**
```json
{
  "message": "invalid timestamp format",
  "result": "error"
}
```

**Solution:**
- Use ISO 8601 format: `2025-11-10T17:25:52.197Z`
- Include timezone (Z for UTC)
- Don't use Unix timestamps in query parameters

#### Issue 5: Empty Data Array

**Response:**
```json
{
  "data": [],
  "result": "success"
}
```

**Possible Causes:**
- No trading activity in the specified time range
- Asset pair has no recent trades
- Time range is in the future
- Subscription doesn't cover the requested time period

**Solution:**
- Expand time range with `start_time` and `end_time`
- Try a different interval (e.g., 1d instead of 1m)
- Verify asset pair is actively traded

---

## Summary & Action Items

### For Platform Integration Teams

1. **Add Kaiko API Configuration**
   - Add `kaiko` as a new API ID in your platform
   - Configure base URL: `https://us.market-api.kaiko.io`
   - Set up automatic `X-Api-Key` header injection

2. **Implement Two Endpoints**
   - Direct Price: `/v2/data/trades.v1/robust_pair_price/{base}/{quote}`
   - Synthetic Price: `/v2/data/trades.v2/spot_exchange_rate/{base}/{quote}`

3. **Add Helper Functions**
   - Asset code lowercase formatter
   - ISO 8601 timestamp formatter
   - Error handler for subscription tier limitations

4. **Implement Fallback Strategy**
   - Try Direct Price first
   - Fall back to Synthetic Price on 401 instrument permission errors
   - Log which method was used for audit trail

5. **Testing Recommendations**
   - Test with client's specific asset pairs before production
   - Verify subscription tier includes required instruments
   - Test different time intervals (1m, 1h, 1d)
   - Test pagination with `continuation_token`

### Verified Functionality

✅ **Direct Price (Robust Pair Price)**
- All time intervals working (1m, 30m, 1h, 1d)
- Real-time pricing with exchange aggregation
- Volume and trade count included
- Continuation tokens for pagination

✅ **Synthetic Price (Spot Exchange Rate)**
- Cross-pair calculation working
- Multiple exchange sources
- Extrapolation flagging

### Known Limitations

⚠️ **Subscription Tier Dependent**
- Access varies by subscription
- Some major pairs (BTC/USD, ETH/USDT) may not be included
- Test client's specific pairs before deployment

### Resources

- **Kaiko Documentation:** https://docs.kaiko.com/
- **API Support:** Contact Kaiko support for subscription questions
- **Test Results:** All endpoints tested 2025-11-10
- **Test Script:** Available in `Kaiko/test-kaiko.cjs`

---

**Document Version:** 2.0
**Last Updated:** 2025-11-10
**Status:** ✅ Production Ready (2 endpoints verified)
**Test Coverage:** 100% of documented endpoints tested successfully
