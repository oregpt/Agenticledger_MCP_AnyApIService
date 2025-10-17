# Bitwave Address Service API

**Status:** ✅ Ready for Integration
**API Version:** v1
**Last Updated:** 2025-01-16
**Documentation:** https://address-svc-utyjy373hq-uc.a.run.app/api-docs/

---

## Overview

The Bitwave Address Service API provides cryptocurrency address validation, symbol lookup, and blockchain address management functionality. It's designed to help applications verify addresses, get supported symbols, and manage cryptocurrency address operations.

### Features:
- Cryptocurrency address validation
- Symbol/ticker lookup and information
- Blockchain address format validation
- Multi-chain support
- Address metadata and details

---

## Authentication

**Type:** None (Public API)
**Required:** ❌ No authentication needed
**Access:** Open access for all endpoints

---

## Rate Limits

- **Default:** No documented rate limits
- **Recommended:** Implement client-side throttling (100 req/min recommended)
- **Caching:** Cache symbol data (updates infrequently)

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
  "description": "Cryptocurrency address validation, symbol lookup, and blockchain address management API",
  "baseUrl": "https://address-svc-utyjy373hq-uc.a.run.app",
  "requiresAuth": false,
  "commonHeaders": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "endpoints": [
    {
      "name": "get_symbol",
      "path": "/symbols/{symbol}",
      "method": "GET",
      "description": "Get detailed information about a cryptocurrency symbol/ticker",
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
        "symbol": "BTC",
        "name": "Bitcoin",
        "blockchain": "Bitcoin",
        "decimals": 8,
        "address_format": "P2PKH",
        "supported": true
      }
    },
    {
      "name": "list_symbols",
      "path": "/symbols",
      "method": "GET",
      "description": "List all supported cryptocurrency symbols",
      "queryParams": [
        {
          "name": "blockchain",
          "type": "string",
          "required": false,
          "description": "Filter by blockchain (e.g., Ethereum, Bitcoin)"
        },
        {
          "name": "active",
          "type": "boolean",
          "required": false,
          "description": "Filter by active status",
          "default": true
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "blockchain": "Ethereum",
          "active": true
        }
      }
    },
    {
      "name": "validate_address",
      "path": "/validate-address",
      "method": "POST",
      "description": "Validate a cryptocurrency address format and checksum",
      "bodyParams": [
        {
          "name": "address",
          "type": "string",
          "required": true,
          "description": "The cryptocurrency address to validate"
        },
        {
          "name": "symbol",
          "type": "string",
          "required": true,
          "description": "The cryptocurrency symbol (BTC, ETH, etc.)"
        }
      ],
      "exampleRequest": {
        "body": {
          "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          "symbol": "ETH"
        }
      },
      "exampleResponse": {
        "valid": true,
        "symbol": "ETH",
        "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "blockchain": "Ethereum",
        "format": "ERC-20",
        "checksum_valid": true
      }
    },
    {
      "name": "get_address_info",
      "path": "/addresses/{address}",
      "method": "GET",
      "description": "Get information about a specific address",
      "parameters": [
        {
          "name": "address",
          "type": "string",
          "required": true,
          "description": "The cryptocurrency address"
        }
      ],
      "queryParams": [
        {
          "name": "symbol",
          "type": "string",
          "required": false,
          "description": "Symbol to validate against"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        },
        "queryParams": {
          "symbol": "BTC"
        }
      }
    },
    {
      "name": "get_supported_blockchains",
      "path": "/blockchains",
      "method": "GET",
      "description": "Get list of supported blockchains",
      "exampleResponse": {
        "blockchains": [
          {
            "name": "Bitcoin",
            "symbols": ["BTC"],
            "address_types": ["P2PKH", "P2SH", "Bech32"]
          },
          {
            "name": "Ethereum",
            "symbols": ["ETH", "USDT", "USDC"],
            "address_types": ["ERC-20"]
          }
        ]
      }
    },
    {
      "name": "batch_validate",
      "path": "/batch-validate",
      "method": "POST",
      "description": "Validate multiple addresses in a single request",
      "bodyParams": [
        {
          "name": "addresses",
          "type": "array",
          "required": true,
          "description": "Array of address validation requests"
        }
      ],
      "exampleRequest": {
        "body": {
          "addresses": [
            {"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "symbol": "BTC"},
            {"address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "symbol": "ETH"}
          ]
        }
      },
      "exampleResponse": {
        "results": [
          {"address": "1A1z...", "valid": true, "symbol": "BTC"},
          {"address": "0x742...", "valid": true, "symbol": "ETH"}
        ]
      }
    },
    {
      "name": "search_symbols",
      "path": "/symbols/search",
      "method": "GET",
      "description": "Search for symbols by name or ticker",
      "queryParams": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search query"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Maximum results to return",
          "default": 20
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "q": "bitcoin",
          "limit": 10
        }
      }
    },
    {
      "name": "get_address_format",
      "path": "/addresses/format",
      "method": "POST",
      "description": "Get the format type of a given address",
      "bodyParams": [
        {
          "name": "address",
          "type": "string",
          "required": true,
          "description": "The address to analyze"
        }
      ],
      "exampleRequest": {
        "body": {
          "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        }
      },
      "exampleResponse": {
        "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "format": "Bech32",
        "blockchain": "Bitcoin",
        "probable_symbols": ["BTC"]
      }
    },
    {
      "name": "health_check",
      "path": "/health",
      "method": "GET",
      "description": "Check API health and status",
      "exampleResponse": {
        "status": "healthy",
        "version": "1.0.0",
        "uptime": "99.9%"
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
# Test get symbol endpoint
curl https://address-svc-utyjy373hq-uc.a.run.app/symbols/BTC

# Test validate address
curl -X POST https://address-svc-utyjy373hq-uc.a.run.app/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "symbol": "BTC"}'
```

### Step 4: Handle Errors

Common error codes:
- `400` - Invalid request (malformed address, missing params)
- `404` - Symbol or address not found
- `500` - Server error

---

## Usage Examples

### Example 1: Get Symbol Information

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
    symbol: "BTC",
    name: "Bitcoin",
    blockchain: "Bitcoin",
    decimals: 8,
    ...
  }
}
```

### Example 2: Validate Bitcoin Address

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/validate-address",
  method: "POST",
  body: {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    symbol: "BTC"
  }
});

// Returns:
{
  success: true,
  data: {
    valid: true,
    symbol: "BTC",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ...
  }
}
```

### Example 3: List All Supported Symbols

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/symbols",
  method: "GET",
  queryParams: {
    active: true
  }
});
```

### Example 4: Batch Validate Multiple Addresses

```typescript
await mcpServer.executeTool('make_api_call', {
  apiId: "bitwave-address",
  endpoint: "/batch-validate",
  method: "POST",
  body: {
    addresses: [
      {address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", symbol: "BTC"},
      {address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", symbol: "ETH"}
    ]
  }
});
```

---

## Common Use Cases

### 1. Wallet Address Validation
```
User enters address → Validate format → Show checksum status
POST /validate-address
```

### 2: Multi-Currency Support Checker
```
Check which currencies supported → Display options
GET /symbols
GET /blockchains
```

### 3. Address Format Detector
```
User pastes unknown address → Detect format → Suggest currency
POST /addresses/format
```

### 4. Symbol Search/Autocomplete
```
User types "bit" → Search symbols → Show "Bitcoin, BitTorrent, ..."
GET /symbols/search?q=bit
```

---

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  }
}
```

### Error Response:
```json
{
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "The provided address format is invalid",
    "details": {
      "address": "invalid_address_here",
      "reason": "Invalid checksum"
    }
  }
}
```

---

## Supported Blockchains & Symbols

### Major Blockchains:
- **Bitcoin** (BTC) - P2PKH, P2SH, Bech32
- **Ethereum** (ETH, ERC-20 tokens) - Standard Ethereum address format
- **USD Stablecoins** (USDT, USDC, DAI) - ERC-20 format
- **And more...** (Check `/api/blockchains` for full list)

---

## Known Issues & Notes

✅ **Best Practices:**

1. **Caching:** Symbol data rarely changes. Cache `/symbols` responses for 1+ hour.

2. **Batch Validation:** For multiple addresses, use `/batch-validate` instead of individual calls.

3. **Case Sensitivity:** Cryptocurrency addresses are case-sensitive. Preserve exact format.

4. **Checksum Validation:** Always validate checksums before sending transactions.

5. **Format Detection:** Use `/format` endpoint when symbol is unknown.

⚠️ **Warnings:**

1. **No Rate Limits Documented:** Implement client-side throttling to be respectful.

2. **Address Balance:** This API only validates format, not balance or transaction history.

3. **Test Addresses:** Use testnet addresses for development/testing.

---

## Integration Patterns

### Pattern 1: Address Input Validation

```typescript
// User enters address in form
const userAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const selectedSymbol = "BTC";

// Validate immediately
const validation = await validateAddress(userAddress, selectedSymbol);

if (validation.valid) {
  // Proceed with transaction
} else {
  // Show error to user
}
```

### Pattern 2: Smart Address Detection

```typescript
// User pastes address without specifying currency
const unknownAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

// Detect format
const format = await detectAddressFormat(unknownAddress);

// Suggest: "This looks like a Bitcoin (Bech32) address"
```

### Pattern 3: Multi-Currency Wallet

```typescript
// Load supported currencies
const symbols = await listSymbols({ active: true });

// Display to user
symbols.forEach(symbol => {
  console.log(`${symbol.name} (${symbol.symbol})`);
});

// When user selects one, validate their address
```

---

## Testing Checklist

Before going to production:

- [ ] Test with valid addresses for each supported blockchain
- [ ] Test with invalid/malformed addresses
- [ ] Test checksum validation (case-sensitive addresses)
- [ ] Verify all supported symbols load correctly
- [ ] Test batch validation with mixed valid/invalid addresses
- [ ] Implement error handling for network failures
- [ ] Add client-side rate limiting/throttling
- [ ] Cache symbol data appropriately
- [ ] Test edge cases (empty addresses, special characters)

---

## Example Test Cases

### Valid Bitcoin Address (P2PKH):
```
Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Expected: valid = true
```

### Valid Ethereum Address:
```
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Expected: valid = true
```

### Invalid Address (bad checksum):
```
Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb (changed last char)
Expected: valid = false, error about checksum
```

### Invalid Address (wrong format):
```
Address: not_an_address_123
Expected: valid = false, error about format
```

---

## Support & Resources

- **API Documentation:** https://address-svc-utyjy373hq-uc.a.run.app/api-docs/
- **Bitwave Website:** https://www.bitwave.io/
- **Support:** Contact Bitwave support team
- **Health Status:** GET /health

---

## Performance Tips

1. **Implement Caching:**
   - Cache symbol list for 1+ hour
   - Cache blockchain list for 24 hours
   - Don't cache validation results (always validate fresh)

2. **Use Batch Endpoints:**
   - For 10+ addresses, use `/batch-validate`
   - More efficient than individual requests

3. **Client-Side Pre-Validation:**
   - Check basic format before API call
   - Validate length, character set
   - Reduce unnecessary API calls

---

## Changelog

**v1.0.0 (2025-01-16)**
- Initial configuration
- 9 core endpoints documented
- Full integration guide
- No authentication required (public API)

---

**For Platform Team:** This configuration is ready to integrate. No API keys needed - add to your API registry and start using immediately!
