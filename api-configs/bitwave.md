# Bitwave Address Service API

**Status:** ✅ Tested and Verified (Jan 2025)
**API Version:** v1
**Last Updated:** 2025-01-17
**Documentation:** https://address-svc-utyjy373hq-uc.a.run.app/api-docs/

---

## Overview

The Bitwave Address Service API provides cryptocurrency information and status checking. This is a simplified, tested configuration containing only verified working endpoints.

### Features:
- Service health/status checking
- Cryptocurrency coin information lookup
- Symbol/ticker detailed information
- Multi-chain coin support

---

## Authentication

**Type:** None (Public API)
**Required:** ❌ No authentication needed
**Access:** Open access for all endpoints

---

## Rate Limits

- **Default:** No documented rate limits
- **Recommended:** Implement client-side throttling (100 req/min recommended)
- **Caching:** Cache coin/symbol data (updates infrequently)

---

## Base URL

```
https://address-svc-utyjy373hq-uc.a.run.app
```

---

## JSON Configuration

Copy this into your `config/apis.json` or use with AnyAPICall MCP Server:

```json
{
  "id": "bitwave-address",
  "name": "Bitwave Address Service",
  "description": "Cryptocurrency coin and symbol information lookup API - tested and verified endpoints only",
  "baseUrl": "https://address-svc-utyjy373hq-uc.a.run.app",
  "requiresAuth": false,
  "commonHeaders": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "endpoints": [
    {
      "name": "health_check",
      "path": "/",
      "method": "GET",
      "description": "Check API service health and status",
      "exampleResponse": {
        "service": "address-svc",
        "status": "OK"
      }
    },
    {
      "name": "list_coins",
      "path": "/coins",
      "method": "GET",
      "description": "List all supported cryptocurrency coins with detailed information",
      "exampleResponse": {
        "items": [
          {
            "coinId": 1,
            "networkId": "btc",
            "symbol": "BTC",
            "decimals": 8,
            "meta": {
              "name": "Bitcoin",
              "logoUrl": "https://www.cryptocompare.com/media/37746251/btc.png",
              "description": "Bitcoin uses peer-to-peer technology..."
            }
          }
        ]
      }
    },
    {
      "name": "get_symbol",
      "path": "/symbols/{symbol}",
      "method": "GET",
      "description": "Get detailed information about a specific cryptocurrency symbol/ticker",
      "parameters": [
        {
          "name": "symbol",
          "type": "string",
          "required": true,
          "description": "Cryptocurrency symbol (e.g., BTC, ETH, USDT)"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "symbol": "BTC"
        }
      },
      "exampleResponse": {
        "coinId": 1,
        "networkId": "btc",
        "symbol": "BTC",
        "symbols": {
          "canonicalSymbol": "BTC",
          "coinGeckoId": "bitcoin"
        },
        "decimals": 8,
        "meta": {
          "name": "Bitcoin",
          "logoUrl": "https://www.cryptocompare.com/media/37746251/btc.png",
          "description": "Bitcoin uses peer-to-peer technology..."
        },
        "externalLinks": {
          "cryptoCompareLink": "https://www.cryptocompare.com/coins/btc/overview"
        },
        "source": "crypto-compare"
      }
    }
  ]
}
```

---

## Integration Guide for Platform Team

### Step 1: Add to Your API Registry

Copy the JSON configuration above into your platform's API management system.

### Step 2: No Authentication Needed

This is a public API - no API keys or tokens required! Just start making requests.

### Step 3: Test the Integration

```bash
# Test health check
curl https://address-svc-utyjy373hq-uc.a.run.app/

# Test list all coins
curl https://address-svc-utyjy373hq-uc.a.run.app/coins

# Test get symbol
curl https://address-svc-utyjy373hq-uc.a.run.app/symbols/BTC
curl https://address-svc-utyjy373hq-uc.a.run.app/symbols/ETH
```

### Step 4: Handle Errors

Common error codes:
- `404` - Symbol not found or invalid endpoint
- `500` - Server error

---

## Usage Examples

### Example 1: Check Service Status

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/",
  method: "GET"
});

// Returns:
{
  success: true,
  data: {
    service: "address-svc",
    status: "OK"
  }
}
```

### Example 2: List All Coins

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/coins",
  method: "GET"
});

// Returns:
{
  success: true,
  data: {
    items: [
      {
        coinId: 1,
        symbol: "BTC",
        decimals: 8,
        meta: { name: "Bitcoin", ... }
      },
      {
        coinId: 10,
        symbol: "ETH",
        decimals: 18,
        meta: { name: "Ethereum", ... }
      },
      // ... more coins
    ]
  }
}
```

### Example 3: Get Symbol Information

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/symbols/{symbol}",
  method: "GET",
  pathParams: {
    symbol: "BTC"
  }
});

// Returns:
{
  success: true,
  data: {
    coinId: 1,
    symbol: "BTC",
    decimals: 8,
    meta: {
      name: "Bitcoin",
      logoUrl: "https://www.cryptocompare.com/media/37746251/btc.png",
      description: "Bitcoin uses peer-to-peer technology..."
    },
    externalLinks: {
      cryptoCompareLink: "https://www.cryptocompare.com/coins/btc/overview"
    }
  }
}
```

---

## Common Use Cases

### 1. Cryptocurrency Info Display
```
Display supported coins → Show logos and names → Link to more info
GET /coins
```

### 2: Symbol Lookup for Trading UI
```
User searches for coin → Get symbol details → Display decimals and info
GET /symbols/{symbol}
```

### 3. Service Monitoring
```
Health check integration → Monitor API availability
GET /
```

---

## Response Format

### Success Response:
```json
{
  "coinId": 1,
  "symbol": "BTC",
  "decimals": 8,
  "meta": {
    "name": "Bitcoin",
    "logoUrl": "...",
    "description": "..."
  }
}
```

### Error Response (Symbol Not Found):
```
Status: 404 Not Found
```

### Error Response (Server Error):
```
Status: 500 Internal Server Error
```

---

## Supported Cryptocurrencies

The `/coins` endpoint returns all supported cryptocurrencies. Common examples include:

- **Bitcoin (BTC)** - 8 decimals
- **Ethereum (ETH)** - 18 decimals
- **EOS** - Various decimals
- **USDT, USDC** - Stablecoins
- **And many more...**

Check the `/coins` endpoint for the complete current list.

---

## Known Issues & Notes

✅ **Verified Information:**

1. **Tested Endpoints:** All 3 endpoints in this config have been tested and verified working (Jan 2025)

2. **Public API:** No authentication required for any endpoint

3. **Caching Recommended:** Coin/symbol data changes infrequently. Cache responses for 1+ hour.

⚠️ **Important Notes:**

1. **Limited API:** This API has only 3 working endpoints. Many endpoints shown in the Swagger docs (like address validation, batch operations, etc.) return 404 errors.

2. **No Rate Limits Documented:** Implement client-side throttling to be respectful of the service.

3. **Symbol Parameter:** Symbol lookup is case-sensitive. Use uppercase (BTC, ETH, not btc, eth).

---

## Integration Patterns

### Pattern 1: Coin Directory

```typescript
// Load all coins for a directory/selector
const coins = await listCoins();

// Display to user
coins.items.forEach(coin => {
  console.log(`${coin.meta.name} (${coin.symbol})`);
  console.log(`Logo: ${coin.meta.logoUrl}`);
  console.log(`Decimals: ${coin.decimals}`);
});
```

### Pattern 2: Symbol Detail Page

```typescript
// User clicks on a specific coin
const symbol = "BTC";

// Get full details
const details = await getSymbol(symbol);

// Display comprehensive info
displayCoinInfo({
  name: details.meta.name,
  symbol: details.symbol,
  logo: details.meta.logoUrl,
  description: details.meta.description,
  decimals: details.decimals,
  learnMore: details.externalLinks.cryptoCompareLink
});
```

### Pattern 3: Monitoring Integration

```typescript
// Health check monitoring
setInterval(async () => {
  const health = await checkHealth();
  if (health.status !== "OK") {
    alert("Bitwave API is down!");
  }
}, 60000); // Check every minute
```

---

## Testing Checklist

Before going to production:

- [x] Test health check endpoint (/)
- [x] Test list coins endpoint (/coins)
- [x] Test get symbol endpoint (/symbols/BTC)
- [x] Test get symbol with different coins (ETH, USDT, etc.)
- [ ] Implement error handling for 404 (symbol not found)
- [ ] Implement error handling for network failures
- [ ] Add client-side rate limiting/throttling
- [ ] Cache coin/symbol data appropriately
- [ ] Test edge cases (invalid symbols, special characters)

---

## Example Test Cases

### Valid Symbol Lookup:
```
GET /symbols/BTC
Expected: 200 OK with full coin data
```

### Valid Symbol Lookup (Ethereum):
```
GET /symbols/ETH
Expected: 200 OK with full coin data
```

### Invalid Symbol:
```
GET /symbols/NOTAREALCOIN
Expected: 404 Not Found
```

### List All Coins:
```
GET /coins
Expected: 200 OK with array of all supported coins
```

---

## Support & Resources

- **API Documentation:** https://address-svc-utyjy373hq-uc.a.run.app/api-docs/
- **Bitwave Website:** https://www.bitwave.io/
- **Support:** Contact Bitwave support team
- **Health Status:** GET /

---

## Performance Tips

1. **Implement Caching:**
   - Cache `/coins` response for 1+ hour (rarely changes)
   - Cache `/symbols/{symbol}` response for 1+ hour
   - Don't cache health check (real-time)

2. **Reduce API Calls:**
   - Load all coins once, cache locally
   - Only fetch individual symbols when needed
   - Use cached data for dropdowns/selectors

3. **Error Handling:**
   - Gracefully handle 404 for unknown symbols
   - Show user-friendly messages
   - Implement retry logic for network errors

---

## Changelog

**v2.0.0 (2025-01-17)**
- **BREAKING:** Removed all non-working endpoints (validation, batch operations, search, etc.)
- Kept only 3 verified working endpoints
- All endpoints tested and confirmed working
- Updated documentation to reflect actual API behavior
- Added real response examples from actual API calls

**v1.0.0 (2025-01-16)**
- Initial configuration (contained many non-working endpoints)

---

## Migration from v1.0.0

If you were using the previous config (v1.0.0), note these breaking changes:

**Removed Endpoints (404 errors):**
- `/symbols` (list without path param)
- `/validate-address`
- `/addresses/{address}`
- `/blockchains`
- `/batch-validate`
- `/symbols/search`
- `/addresses/format`
- `/health`

**Working Alternatives:**
- Use `/coins` instead of `/symbols` for listing
- Use `/` instead of `/health` for health checks
- No replacement for validation endpoints (not available in this API)

---

**For Platform Team:** This configuration contains ONLY tested and verified working endpoints. All 3 endpoints return 200 OK status. Ready for production integration!
