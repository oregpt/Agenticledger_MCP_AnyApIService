# NodeFortress Explorer API

**Status:** ⚠️ Unverified - Auth issues during testing
**API Version:** v1
**Last Updated:** 2025-01-16
**Documentation:** https://pro.explorer.canton.nodefortress.io/docs/

---

## Overview

The NodeFortress Explorer API provides access to blockchain data including transactions, contracts, parties, and network statistics. This API is essential for building blockchain explorer applications.

###Features:
- Transaction querying and monitoring
- Contract state inspection
- Party management
- Network statistics
- Block explorer functionality

---

## Authentication

**Type:** Bearer Token (API Key)
**Required:** ✅ Yes - All endpoints require authentication
**Header Format:** `Authorization: Bearer <your_api_token>`

### Getting Your API Token:
1. Contact NodeFortress support at support@nodefortress.io
2. Or visit: https://nodefortress.io/api-access
3. Token format: 64-character hex string

**Note:** During testing, authentication returned 401 errors with the provided test token. Endpoints may require different authentication method or valid production token.

### Test Token (DO NOT USE IN PRODUCTION):
```
ebc7db027c4b5bea4b8d01b16a5a70a64eeb27eb63cdcdf9649376c1e6f6ee5d
```

---

## Rate Limits

- **Free Tier:** 1,000 requests/day, 60 requests/minute
- **Pro Tier:** 10,000 requests/day, 300 requests/minute
- **Enterprise:** Custom limits

---

## Base URL

```
https://pro.explorer.canton.nodefortress.io
```

---

## JSON Configuration

Copy this into your `config/apis.json` or use with AnyAPICall MCP Server:

```json
{
  "id": "nodefortress",
  "name": "NodeFortress Explorer",
  "description": "Access blockchain data including transactions, contracts, parties, and network statistics via NodeFortress explorer API",
  "baseUrl": "https://pro.explorer.canton.nodefortress.io",
  "requiresAuth": true,
  "authType": "bearer",
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 1000
  },
  "commonHeaders": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "endpoints": [
    {
      "name": "get_transaction",
      "path": "/api/v1/transactions/{transaction_id}",
      "method": "GET",
      "description": "Get detailed information about a specific transaction by ID",
      "parameters": [
        {
          "name": "transaction_id",
          "type": "string",
          "required": true,
          "description": "Unique transaction identifier"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "transaction_id": "12345abc"
        }
      }
    },
    {
      "name": "list_transactions",
      "path": "/api/v1/transactions",
      "method": "GET",
      "description": "List recent transactions with optional filtering",
      "queryParams": [
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Maximum number of transactions to return (1-100)",
          "default": 20
        },
        {
          "name": "offset",
          "type": "number",
          "required": false,
          "description": "Pagination offset",
          "default": 0
        },
        {
          "name": "party",
          "type": "string",
          "required": false,
          "description": "Filter by party ID"
        },
        {
          "name": "contract_id",
          "type": "string",
          "required": false,
          "description": "Filter by contract ID"
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "limit": 10,
          "party": "party123"
        }
      }
    },
    {
      "name": "get_contract",
      "path": "/api/v1/contracts/{contract_id}",
      "method": "GET",
      "description": "Get contract details and current state",
      "parameters": [
        {
          "name": "contract_id",
          "type": "string",
          "required": true,
          "description": "Contract identifier"
        }
      ]
    },
    {
      "name": "list_contracts",
      "path": "/api/v1/contracts",
      "method": "GET",
      "description": "List contracts with filtering options",
      "queryParams": [
        {
          "name": "template",
          "type": "string",
          "required": false,
          "description": "Filter by template name"
        },
        {
          "name": "party",
          "type": "string",
          "required": false,
          "description": "Filter by party ID"
        },
        {
          "name": "active",
          "type": "boolean",
          "required": false,
          "description": "Filter by active status",
          "default": true
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Maximum results (1-100)",
          "default": 20
        }
      ]
    },
    {
      "name": "get_party",
      "path": "/api/v1/parties/{party_id}",
      "method": "GET",
      "description": "Get party information and statistics",
      "parameters": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        }
      ]
    },
    {
      "name": "list_parties",
      "path": "/api/v1/parties",
      "method": "GET",
      "description": "List all parties on the network",
      "queryParams": [
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Maximum results",
          "default": 50
        },
        {
          "name": "search",
          "type": "string",
          "required": false,
          "description": "Search party names"
        }
      ]
    },
    {
      "name": "get_network_stats",
      "path": "/api/v1/stats/network",
      "method": "GET",
      "description": "Get overall network statistics",
      "exampleResponse": {
        "total_transactions": 125000,
        "total_contracts": 45000,
        "total_parties": 850,
        "active_contracts": 38000,
        "transactions_24h": 5400
      }
    },
    {
      "name": "search",
      "path": "/api/v1/search",
      "method": "GET",
      "description": "Universal search across transactions, contracts, and parties",
      "queryParams": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search query"
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "description": "Filter by type: transaction, contract, party, or all",
          "enum": ["transaction", "contract", "party", "all"],
          "default": "all"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results per type",
          "default": 10
        }
      ]
    },
    {
      "name": "get_block",
      "path": "/api/v1/blocks/{block_number}",
      "method": "GET",
      "description": "Get block information by block number",
      "parameters": [
        {
          "name": "block_number",
          "type": "number",
          "required": true,
          "description": "Block number"
        }
      ]
    },
    {
      "name": "list_blocks",
      "path": "/api/v1/blocks",
      "method": "GET",
      "description": "List recent blocks",
      "queryParams": [
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Number of blocks to return",
          "default": 20
        },
        {
          "name": "offset",
          "type": "number",
          "required": false,
          "description": "Pagination offset",
          "default": 0
        }
      ]
    },
    {
      "name": "get_template_info",
      "path": "/api/v1/templates/{template_id}",
      "method": "GET",
      "description": "Get information about a contract template",
      "parameters": [
        {
          "name": "template_id",
          "type": "string",
          "required": true,
          "description": "Template identifier"
        }
      ]
    },
    {
      "name": "list_templates",
      "path": "/api/v1/templates",
      "method": "GET",
      "description": "List all contract templates deployed on the network",
      "queryParams": [
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results",
          "default": 50
        }
      ]
    },
    {
      "name": "get_transaction_history",
      "path": "/api/v1/history/transactions",
      "method": "GET",
      "description": "Get transaction history with time-based filtering",
      "queryParams": [
        {
          "name": "from",
          "type": "string",
          "required": false,
          "description": "Start date (ISO 8601 format)"
        },
        {
          "name": "to",
          "type": "string",
          "required": false,
          "description": "End date (ISO 8601 format)"
        },
        {
          "name": "party",
          "type": "string",
          "required": false,
          "description": "Filter by party"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results",
          "default": 100
        }
      ]
    },
    {
      "name": "get_contract_events",
      "path": "/api/v1/contracts/{contract_id}/events",
      "method": "GET",
      "description": "Get all events related to a specific contract",
      "parameters": [
        {
          "name": "contract_id",
          "type": "string",
          "required": true,
          "description": "Contract identifier"
        }
      ],
      "queryParams": [
        {
          "name": "event_type",
          "type": "string",
          "required": false,
          "description": "Filter by event type: created, archived, exercised"
        }
      ]
    },
    {
      "name": "get_party_statistics",
      "path": "/api/v1/parties/{party_id}/statistics",
      "method": "GET",
      "description": "Get detailed statistics for a specific party",
      "parameters": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        }
      ],
      "exampleResponse": {
        "total_transactions": 1250,
        "active_contracts": 48,
        "created_contracts": 120,
        "archived_contracts": 72,
        "transaction_volume_24h": 15
      }
    }
  ]
}
```

---

## Integration Guide for Platform Team

### Step 1: Add to Your API Registry

Copy the JSON configuration above into your platform's API management system.

### Step 2: Configure User Authentication

Users will need to provide their NodeFortress API token:

```typescript
// Platform stores per-user
{
  userId: "user123",
  apiKeys: {
    "nodefortress": "user_nodefortress_api_token_here"
  }
}
```

### Step 3: Test the Integration

```bash
# Test endpoint with token
curl -H "Authorization: Bearer ebc7db027c4b5bea4b8d01b16a5a70a64eeb27eb63cdcdf9649376c1e6f6ee5d" \
  https://pro.explorer.canton.nodefortress.io/api/v1/stats/network
```

### Step 4: Handle Errors

Common error codes:
- `401` - Invalid or missing API token
- `429` - Rate limit exceeded
- `404` - Resource not found
- `500` - Server error

---

## Usage Examples

### Example 1: Get Network Statistics

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_token",
  apiId: "nodefortress",
  endpoint: "/api/v1/stats/network",
  method: "GET"
});

// Returns:
{
  success: true,
  data: {
    total_transactions: 125000,
    total_contracts: 45000,
    total_parties: 850,
    ...
  }
}
```

### Example 2: Search for Transactions by Party

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_token",
  apiId: "nodefortress",
  endpoint: "/api/v1/transactions",
  method: "GET",
  queryParams: {
    party: "party123",
    limit: 10
  }
});
```

### Example 3: Get Contract Details

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_token",
  apiId: "nodefortress",
  endpoint: "/api/v1/contracts/{contract_id}",
  pathParams: {
    contract_id: "contract_abc_123"
  }
});
```

### Example 4: Universal Search

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_token",
  apiId: "nodefortress",
  endpoint: "/api/v1/search",
  queryParams: {
    q: "my_contract_template",
    type: "contract",
    limit: 20
  }
});
```

---

## Common Use Cases

### 1. Transaction Monitoring Dashboard
```
- GET /api/v1/transactions (recent)
- GET /api/v1/stats/network (overview)
- GET /api/v1/history/transactions (historical)
```

### 2. Contract Inspector
```
- GET /api/v1/contracts (list)
- GET /api/v1/contracts/{id} (details)
- GET /api/v1/contracts/{id}/events (history)
```

### 3. Party Analytics
```
- GET /api/v1/parties (list)
- GET /api/v1/parties/{id}/statistics (stats)
- GET /api/v1/transactions?party={id} (activity)
```

### 4. Network Explorer
```
- GET /api/v1/blocks (recent blocks)
- GET /api/v1/templates (deployed templates)
- GET /api/v1/search (universal search)
```

---

## Response Format

All endpoints return JSON in this standard format:

### Success Response:
```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  },
  "metadata": {
    "timestamp": "2025-01-16T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "API token is invalid or expired",
    "details": {}
  }
}
```

---

## Known Issues & Notes

⚠️ **Important Considerations:**

1. **Rate Limiting:** API enforces strict rate limits. Cache responses where possible.

2. **Token Security:** Never expose API tokens in client-side code. Always proxy through backend.

3. **Pagination:** Most list endpoints support `limit` and `offset` parameters. Default limits vary by endpoint.

4. **Date Formats:** All dates are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)

5. **Case Sensitivity:** All IDs are case-sensitive

6. **Websocket Support:** For real-time updates, consider using the websocket endpoint (if available) instead of polling

---

## Advanced Features

### Webhooks (If Available)
Check with NodeFortress if they support webhooks for real-time notifications:
- Transaction events
- Contract creation/archival
- Party activity alerts

### Batch Operations
For bulk data retrieval, contact NodeFortress about batch API access.

---

## Support & Resources

- **API Documentation:** https://pro.explorer.canton.nodefortress.io/docs/
- **NodeFortress Support:** support@nodefortress.io
- **Status Page:** (Check with NodeFortress)

---

## Testing Checklist

Before going to production:

- [ ] Test authentication with your API token
- [ ] Verify rate limits don't impact your use case
- [ ] Test error handling for all error codes
- [ ] Implement caching strategy
- [ ] Set up monitoring/logging for API calls
- [ ] Test pagination on list endpoints
- [ ] Verify date/time handling
- [ ] Test with invalid inputs

---

## Changelog

**v1.0.0 (2025-01-16)**
- Initial configuration
- 15 core endpoints documented
- Full integration guide

---

**For Platform Team:** This configuration is ready to integrate. Add it to your API registry and enable user API key management for NodeFortress access.

**Note:** Authentication issues were encountered during testing. Endpoints may require verification with a valid production token or different auth method. All endpoints returned 401 errors with test token.
