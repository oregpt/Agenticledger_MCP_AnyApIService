# CCView.io (CantonView) API

**Status:** ✅ Production Ready
**API Version:** v1 (0.0.1)
**Last Updated:** 2025-01-20
**Documentation:** https://ccview.io/api/v1/api-docs/openapi.json
**Base URL:** https://ccview.io

---

## Overview

The CantonView API provides comprehensive access to Canton Network blockchain data including governance, validators, rewards, token transfers, network statistics, and ledger updates. This is a complete blockchain explorer API with 64 endpoints organized into 17 categories.

### Features:
- Network statistics and pricing data
- Governance tracking (active/completed votes)
- Validator and super-validator information
- Rewards tracking (validators, super-validators, apps)
- Token transfers and allocations
- Ledger updates and activity
- Party information and balance changes
- Mining rounds tracking
- Featured apps listing
- Universal search functionality

---

## Authentication

**Type:** API Key (X-API-Key header)
**Required:** ✅ Yes - All endpoints require authentication
**Header Format:** `X-API-Key: <your_api_token>`

### Getting Your API Token:
Contact CantonView support at: cantonview@pixelplex.io

### Authentication Note:
This API uses `X-API-Key` header for authentication (similar to NodeFortress but different header name).

---

## Rate Limits

Standard rate limits apply. Contact API maintainer for specific limits.

---

## Base URL

```
https://ccview.io
```

---

## JSON Configuration

Copy this into your `config/apis.json` or use with AnyAPICall MCP Server:

```json
{
  "id": "ccview",
  "name": "CantonView Explorer",
  "description": "Comprehensive Canton Network blockchain explorer API - governance, validators, rewards, transfers, and network statistics",
  "baseUrl": "https://ccview.io",
  "requiresAuth": true,
  "authType": "apiKey",
  "authHeader": "X-API-Key",
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 10000
  },
  "commonHeaders": {
    "Accept": "application/json"
  },
  "endpoints": [
    {
      "name": "get_network_stats",
      "path": "/api/v1/explore/stats",
      "method": "GET",
      "description": "Get Canton network statistics overview"
    },
    {
      "name": "get_fee_statistics",
      "path": "/api/v1/explore/fee-stat",
      "method": "GET",
      "description": "Get fee statistics for a date range with auto-aggregation",
      "queryParams": [
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date (format: YYYY-MM-DD)"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date (format: YYYY-MM-DD)"
        },
        {
          "name": "strict",
          "type": "boolean",
          "required": false,
          "description": "If true, returns raw daily data; if false, auto-aggregates based on range"
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "start": "2025-01-01",
          "end": "2025-01-20",
          "strict": false
        }
      }
    },
    {
      "name": "get_token_prices",
      "path": "/api/v1/explore/prices",
      "method": "GET",
      "description": "Get token price changes for various time periods (current, today, 1d, 1w, 1m, 1y ago)"
    },
    {
      "name": "get_token_prices_list",
      "path": "/api/v1/explore/prices-list",
      "method": "GET",
      "description": "Get list of token prices for a specific time range",
      "queryParams": [
        {
          "name": "start_datetime",
          "type": "string",
          "required": true,
          "description": "Start timestamp (ISO 8601 format)"
        },
        {
          "name": "end_datetime",
          "type": "string",
          "required": true,
          "description": "End timestamp (ISO 8601 format)"
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "start_datetime": "2025-01-01T00:00:00Z",
          "end_datetime": "2025-01-20T23:59:59Z"
        }
      }
    },
    {
      "name": "get_supply_stats",
      "path": "/api/v1/explore/supply-stats",
      "method": "GET",
      "description": "Get supply, price, and market cap statistics for a date range",
      "queryParams": [
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date (format: YYYY-MM-DD)"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date (format: YYYY-MM-DD)"
        }
      ]
    },
    {
      "name": "get_daily_transfer_stats",
      "path": "/api/v1/explore/transfer-stat-per-day",
      "method": "GET",
      "description": "Get daily transfer statistics (defaults to latest indexed day)",
      "queryParams": [
        {
          "name": "day",
          "type": "string",
          "required": false,
          "description": "Optional specific day (format: YYYY-MM-DD)"
        }
      ]
    },
    {
      "name": "list_governances",
      "path": "/api/v1/governances",
      "method": "GET",
      "description": "List governance proposals with filtering and search",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor (ISO 8601 timestamp)"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size (default: 10, max: 100)"
        },
        {
          "name": "votes_filter_type",
          "type": "string",
          "required": false,
          "description": "Filter: 'any', 'active', or 'completed'"
        },
        {
          "name": "search_arg",
          "type": "string",
          "required": false,
          "description": "Search by requester ID/name, DSO party_id, or tracking_cid"
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "cursor": "2025-01-20T00:00:00Z",
          "limit": 20,
          "votes_filter_type": "active"
        }
      }
    },
    {
      "name": "list_active_governances",
      "path": "/api/v1/governances/active",
      "method": "GET",
      "description": "List active governance proposals only",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_completed_governances",
      "path": "/api/v1/governances/completed",
      "method": "GET",
      "description": "List completed governance proposals only",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_governance_details",
      "path": "/api/v1/governances/details/{tracking_cid}",
      "method": "GET",
      "description": "Get detailed information about a specific governance proposal",
      "parameters": [
        {
          "name": "tracking_cid",
          "type": "string",
          "required": true,
          "description": "Governance tracking CID"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "tracking_cid": "example_tracking_cid"
        }
      }
    },
    {
      "name": "get_governance_statistics",
      "path": "/api/v1/governances/statistics",
      "method": "GET",
      "description": "Get overall governance statistics"
    },
    {
      "name": "list_validators",
      "path": "/api/v1/validators",
      "method": "GET",
      "description": "List all validators with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_validator_details",
      "path": "/api/v1/validators/{validator_id}",
      "method": "GET",
      "description": "Get detailed information about a specific validator",
      "parameters": [
        {
          "name": "validator_id",
          "type": "string",
          "required": true,
          "description": "Validator identifier"
        }
      ]
    },
    {
      "name": "get_validator_statistics",
      "path": "/api/v1/validators/statistics",
      "method": "GET",
      "description": "Get overall validator statistics"
    },
    {
      "name": "list_super_validators_hosted",
      "path": "/api/v1/super-validators/hosted",
      "method": "GET",
      "description": "List hosted super-validators",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_super_validators_standalone",
      "path": "/api/v1/super-validators/standalone",
      "method": "GET",
      "description": "List standalone super-validators",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_validator_rewards",
      "path": "/api/v1/rewards/validator",
      "method": "GET",
      "description": "List validator rewards with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_validator_rewards_stats",
      "path": "/api/v1/rewards/validator/stat",
      "method": "GET",
      "description": "Get validator rewards statistics"
    },
    {
      "name": "get_top_rewarded_validators",
      "path": "/api/v1/rewards/validator/top-rewarded",
      "method": "GET",
      "description": "Get top rewarded validators"
    },
    {
      "name": "get_validator_top_rounds",
      "path": "/api/v1/rewards/validator/top-rounds",
      "method": "GET",
      "description": "Get top rounds for validator rewards"
    },
    {
      "name": "list_super_validator_rewards",
      "path": "/api/v1/rewards/super-validator",
      "method": "GET",
      "description": "List super-validator rewards",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_super_validator_rewards_stats",
      "path": "/api/v1/rewards/super-validator/stat",
      "method": "GET",
      "description": "Get super-validator rewards statistics"
    },
    {
      "name": "get_super_validator_top_beneficiary",
      "path": "/api/v1/rewards/super-validator/top-beneficiary",
      "method": "GET",
      "description": "Get top beneficiary for super-validator rewards"
    },
    {
      "name": "get_super_validator_top_rounds",
      "path": "/api/v1/rewards/super-validator/top-rounds",
      "method": "GET",
      "description": "Get top rounds for super-validator rewards"
    },
    {
      "name": "get_super_validator_top_weight",
      "path": "/api/v1/rewards/super-validator/top-weight",
      "method": "GET",
      "description": "Get top weight super-validators"
    },
    {
      "name": "list_app_rewards",
      "path": "/api/v1/rewards/app",
      "method": "GET",
      "description": "List featured app rewards",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_app_rewards_stats",
      "path": "/api/v1/rewards/app/stat",
      "method": "GET",
      "description": "Get app rewards statistics"
    },
    {
      "name": "get_app_rewards_total",
      "path": "/api/v1/rewards/app/total",
      "method": "GET",
      "description": "Get total app rewards"
    },
    {
      "name": "get_app_coupons_count",
      "path": "/api/v1/rewards/app/coupons-count",
      "method": "GET",
      "description": "Get coupons count for featured apps"
    },
    {
      "name": "get_app_top_beneficiary",
      "path": "/api/v1/rewards/app/top-beneficiary",
      "method": "GET",
      "description": "Get top app beneficiary"
    },
    {
      "name": "get_app_top_providers",
      "path": "/api/v1/rewards/app/top-providers",
      "method": "GET",
      "description": "Get top app providers"
    },
    {
      "name": "get_app_top_rounds",
      "path": "/api/v1/rewards/app/top-rounds",
      "method": "GET",
      "description": "Get top rounds for app rewards"
    },
    {
      "name": "list_token_transfers",
      "path": "/api/v1/token-transfers",
      "method": "GET",
      "description": "List token transfers with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_token_transfers_by_party",
      "path": "/api/v1/token-transfers/by-party",
      "method": "GET",
      "description": "List token transfers for a specific party",
      "queryParams": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        },
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_token_transfer_details",
      "path": "/api/v1/token-transfers/{event_id}",
      "method": "GET",
      "description": "Get details of a specific token transfer",
      "parameters": [
        {
          "name": "event_id",
          "type": "string",
          "required": true,
          "description": "Transfer event ID"
        }
      ]
    },
    {
      "name": "get_token_transfer_stats",
      "path": "/api/v1/token-transfers/stat",
      "method": "GET",
      "description": "Get transfer statistics with daily, weekly, or monthly aggregation",
      "queryParams": [
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date"
        }
      ]
    },
    {
      "name": "search_transfer_allocations",
      "path": "/api/v1/token-transfer-allocations/search",
      "method": "GET",
      "description": "Search token transfer allocations",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_transfer_allocation_details",
      "path": "/api/v1/token-transfer-allocations/{event_id}",
      "method": "GET",
      "description": "Get details of a specific transfer allocation",
      "parameters": [
        {
          "name": "event_id",
          "type": "string",
          "required": true,
          "description": "Allocation event ID"
        }
      ]
    },
    {
      "name": "search_transfer_commands",
      "path": "/api/v1/token-transfer-commands/search",
      "method": "GET",
      "description": "Search token transfer commands",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_transfer_command_details",
      "path": "/api/v1/token-transfer-commands/{event_id}",
      "method": "GET",
      "description": "Get details of a specific transfer command",
      "parameters": [
        {
          "name": "event_id",
          "type": "string",
          "required": true,
          "description": "Command event ID"
        }
      ]
    },
    {
      "name": "search_transfer_instructions",
      "path": "/api/v1/token-transfer-instructions/search",
      "method": "GET",
      "description": "Search token transfer instructions",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_transfer_instruction_details",
      "path": "/api/v1/token-transfer-instructions/{event_id}",
      "method": "GET",
      "description": "Get details of a specific transfer instruction",
      "parameters": [
        {
          "name": "event_id",
          "type": "string",
          "required": true,
          "description": "Instruction event ID"
        }
      ]
    },
    {
      "name": "search_transfer_preapprovals",
      "path": "/api/v1/transfer-preapprovals/search",
      "method": "GET",
      "description": "Search transfer preapprovals",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_updates",
      "path": "/api/v1/updates",
      "method": "GET",
      "description": "List ledger updates with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_updates_by_party",
      "path": "/api/v1/updates/by-party",
      "method": "GET",
      "description": "List updates for a specific party",
      "queryParams": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        },
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_update_details",
      "path": "/api/v1/updates/{update_id}",
      "method": "GET",
      "description": "Get details of a specific update",
      "parameters": [
        {
          "name": "update_id",
          "type": "string",
          "required": true,
          "description": "Update identifier (hash)"
        }
      ]
    },
    {
      "name": "get_updates_chart",
      "path": "/api/v1/updates/chart",
      "method": "GET",
      "description": "Get per-minute update statistics for charting",
      "queryParams": [
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start timestamp"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End timestamp"
        }
      ]
    },
    {
      "name": "get_updates_stats",
      "path": "/api/v1/updates/stats",
      "method": "GET",
      "description": "Get general update statistics"
    },
    {
      "name": "get_updates_stats_per_day",
      "path": "/api/v1/updates/stats/per-day",
      "method": "GET",
      "description": "Get update statistics per day",
      "queryParams": [
        {
          "name": "day",
          "type": "string",
          "required": false,
          "description": "Specific day (defaults to latest)"
        }
      ]
    },
    {
      "name": "get_updates_stats_ranged",
      "path": "/api/v1/updates/stats/ranged",
      "method": "GET",
      "description": "Get update statistics for a date range",
      "queryParams": [
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date"
        }
      ]
    },
    {
      "name": "get_top_parties",
      "path": "/api/v1/updates/stats/top-parties",
      "method": "GET",
      "description": "Get top active parties by update count"
    },
    {
      "name": "get_party_details",
      "path": "/api/v1/parties/{party_id}",
      "method": "GET",
      "description": "Get detailed information about a specific party",
      "parameters": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier (URL encoded)"
        }
      ]
    },
    {
      "name": "get_party_balance_changes",
      "path": "/api/v1/parties/balance-changes",
      "method": "GET",
      "description": "Get party balance changes with pagination",
      "queryParams": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        },
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_party_fee_stats",
      "path": "/api/v1/parties/fee-stat-ranged",
      "method": "GET",
      "description": "Get daily and aggregated burn fee statistics for a party",
      "queryParams": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        },
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date"
        }
      ]
    },
    {
      "name": "get_party_stats_ranged",
      "path": "/api/v1/parties/stats/ranged",
      "method": "GET",
      "description": "Get active party statistics with dynamic daily or aggregated data",
      "queryParams": [
        {
          "name": "party_id",
          "type": "string",
          "required": true,
          "description": "Party identifier"
        },
        {
          "name": "start",
          "type": "string",
          "required": true,
          "description": "Start date"
        },
        {
          "name": "end",
          "type": "string",
          "required": true,
          "description": "End date"
        }
      ]
    },
    {
      "name": "list_mining_rounds",
      "path": "/api/v1/mining-rounds",
      "method": "GET",
      "description": "List mining rounds with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_active_mining_rounds",
      "path": "/api/v1/mining-rounds/active",
      "method": "GET",
      "description": "List active mining rounds only"
    },
    {
      "name": "search_mining_rounds",
      "path": "/api/v1/mining-rounds/search",
      "method": "GET",
      "description": "Search mining rounds",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "search_offers",
      "path": "/api/v1/offers/search",
      "method": "GET",
      "description": "Search offers with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_featured_apps",
      "path": "/api/v1/featured-apps",
      "method": "GET",
      "description": "List all featured apps",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": false,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "list_migrations",
      "path": "/api/v1/migrations",
      "method": "GET",
      "description": "List migrations with pagination",
      "queryParams": [
        {
          "name": "cursor",
          "type": "string",
          "required": true,
          "description": "Pagination cursor"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size"
        }
      ]
    },
    {
      "name": "get_latest_migration",
      "path": "/api/v1/migrations/lastest",
      "method": "GET",
      "description": "Get latest migration statistics"
    },
    {
      "name": "general_search",
      "path": "/api/v1/general-search",
      "method": "GET",
      "description": "Universal search for parties, updates, or other entities",
      "queryParams": [
        {
          "name": "arg",
          "type": "string",
          "required": true,
          "description": "Search query (Party ID or Update ID)"
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Page size for partial search (1-100)"
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "arg": "1220",
          "limit": 20
        }
      }
    },
    {
      "name": "health_check",
      "path": "/api/v1/health",
      "method": "GET",
      "description": "API health check endpoint"
    }
  ]
}
```

---

## Integration Guide for Platform Team

### Step 1: Add to Your API Registry

Copy the JSON configuration above into your platform's API management system.

### Step 2: Configure User Authentication

Users will need to provide their CantonView API key:

```typescript
// Platform stores per-user
{
  userId: "user123",
  apiKeys: {
    "ccview": "user_ccview_api_key_here"
  }
}
```

### Step 3: Test the Integration

```bash
# Test network stats endpoint
curl -X GET "https://ccview.io/api/v1/explore/stats" \
  -H "accept: application/json" \
  -H "X-API-Key: YOUR_API_KEY"

# Test health check
curl -X GET "https://ccview.io/api/v1/health" \
  -H "accept: application/json" \
  -H "X-API-Key: YOUR_API_KEY"
```

### Step 4: Handle Errors

Common error codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid or missing API key)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
- `501` - Not Implemented

---

## Usage Examples

### Example 1: Get Network Statistics

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/explore/stats",
  method: "GET"
});
```

### Example 2: Get Fee Statistics for Date Range

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/explore/fee-stat",
  queryParams: {
    start: "2025-01-01",
    end: "2025-01-20",
    strict: false
  }
});
```

### Example 3: List Active Governance Proposals

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/governances",
  queryParams: {
    cursor: "2025-01-20T00:00:00Z",
    limit: 20,
    votes_filter_type: "active"
  }
});
```

### Example 4: Get Validator Details

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/validators/{validator_id}",
  pathParams: {
    validator_id: "validator_123"
  }
});
```

### Example 5: Search for Parties or Updates

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/general-search",
  queryParams: {
    arg: "1220",
    limit: 20
  }
});
```

### Example 6: Get Token Transfer Details

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/token-transfers/{event_id}",
  pathParams: {
    event_id: "event_abc123"
  }
});
```

### Example 7: Get Party Balance Changes

```typescript
await mcpServer.executeTool('make_api_call', {
  accessToken: "user_api_key",
  apiId: "ccview",
  endpoint: "/api/v1/parties/balance-changes",
  queryParams: {
    party_id: "party_xyz",
    cursor: "2025-01-20T00:00:00Z",
    limit: 50
  }
});
```

---

## API Categories Summary

### 1. Explore (6 endpoints)
Network statistics, pricing data, fee statistics, supply metrics, and transfer statistics.

### 2. Governance (5 endpoints)
List and filter governance proposals, get details, view active/completed votes.

### 3. Validators (3 endpoints)
List validators, get details, view statistics.

### 4. Super Validators (2 endpoints)
List hosted and standalone super-validators.

### 5. Rewards (16 endpoints)
Track rewards for validators, super-validators, and featured apps with various statistics.

### 6. Token Transfers (4 endpoints)
List transfers, search by party, get details, view statistics.

### 7. Transfer Allocations/Commands/Instructions (6 endpoints)
Search and view details for transfer allocations, commands, and instructions.

### 8. Transfer Preapprovals (1 endpoint)
Search transfer preapprovals.

### 9. Ledger Updates (8 endpoints)
List updates, search by party, get details, view charts and statistics.

### 10. Parties (4 endpoints)
Get party details, balance changes, fee statistics, and activity stats.

### 11. Mining Rounds (3 endpoints)
List and search mining rounds, view active rounds.

### 12. Offers (1 endpoint)
Search offers on the network.

### 13. Featured Apps (1 endpoint)
List featured applications.

### 14. Migrations (2 endpoints)
List migrations and get latest migration statistics.

### 15. General Search (1 endpoint)
Universal search functionality.

### 16. Health (1 endpoint)
API health check.

---

## Common Use Cases

### 1. Network Monitoring Dashboard
```
GET /api/v1/explore/stats → Network overview
GET /api/v1/validators/statistics → Validator health
GET /api/v1/governances/active → Active votes
GET /api/v1/updates/stats → Ledger activity
```

### 2. Governance Tracking
```
GET /api/v1/governances → All proposals
GET /api/v1/governances/active → Pending votes
GET /api/v1/governances/completed → Past decisions
GET /api/v1/governances/details/{tracking_cid} → Vote details
```

### 3. Validator Performance Analysis
```
GET /api/v1/validators → All validators
GET /api/v1/validators/{validator_id} → Specific validator
GET /api/v1/rewards/validator/top-rewarded → Top performers
GET /api/v1/rewards/validator/stat → Reward statistics
```

### 4. Token Transfer Tracking
```
GET /api/v1/token-transfers → Recent transfers
GET /api/v1/token-transfers/by-party → Party-specific transfers
GET /api/v1/token-transfers/stat → Transfer statistics
GET /api/v1/token-transfers/{event_id} → Transfer details
```

### 5. Party Activity Explorer
```
GET /api/v1/parties/{party_id} → Party info
GET /api/v1/parties/balance-changes → Balance history
GET /api/v1/updates/by-party → Party updates
GET /api/v1/parties/stats/ranged → Activity stats
```

---

## Important Notes

### Pagination Pattern

Most list endpoints use cursor-based pagination:
- `cursor`: ISO 8601 timestamp (required)
- `limit`: Page size (optional, default: 10, max: 100)

Example:
```json
{
  "cursor": "2025-01-20T00:00:00Z",
  "limit": 20
}
```

### Date Format

Dates use two formats depending on the endpoint:
- **Date only**: `YYYY-MM-DD` (e.g., "2025-01-20")
- **DateTime**: ISO 8601 format (e.g., "2025-01-20T00:00:00Z")

### URL Encoding

Party IDs may contain special characters and should be URL encoded when used in paths.

### Auto-Aggregation

Some endpoints (fee stats, supply stats) automatically aggregate data based on date range:
- ≤ 31 days: Daily data
- 32-365 days: Weekly aggregation
- ≥ 366 days: Monthly aggregation

Use `strict: true` to get raw daily data.

---

## Performance Tips

1. **Use Pagination:**
   - Always specify reasonable `limit` values
   - Use cursor-based pagination for large datasets

2. **Implement Caching:**
   - Cache statistics that change infrequently
   - Cache completed governance proposals
   - Don't cache real-time transfer data

3. **Filter Early:**
   - Use `votes_filter_type` for governance queries
   - Use party-specific endpoints instead of filtering all results

4. **Error Handling:**
   - Implement retry logic for 500 errors
   - Validate parameters before API calls to avoid 400 errors
   - Handle 404s gracefully for user searches

---

## Support & Resources

- **API Documentation:** https://ccview.io/api/v1/api-docs/openapi.json
- **CantonView Support:** cantonview@pixelplex.io
- **Contact:** API Maintainer <cantonview@pixelplex.io>

---

## Comparison with NodeFortress API

| Feature | CCView | NodeFortress |
|---------|--------|--------------|
| Base URL | https://ccview.io | https://pro.explorer.canton.nodefortress.io |
| Auth Header | `X-API-Key` | `x-api-key` |
| Endpoints | 64 | 11 |
| Governance | ✅ Advanced (5 endpoints) | ✅ Basic (2 endpoints) |
| Validators | ✅ (3 endpoints) | ✅ (2 endpoints) |
| Rewards Tracking | ✅ Comprehensive (16 endpoints) | ❌ |
| Token Transfers | ✅ (4 + 6 specialized) | ❌ |
| Party Analytics | ✅ Advanced (4 endpoints) | ✅ Basic (2 endpoints) |
| Network Stats | ✅ Extensive (6 endpoints) | ✅ Basic (1 endpoint) |
| Mining Rounds | ✅ (3 endpoints) | ❌ |
| Featured Apps | ✅ (1 endpoint) | ❌ |

**Recommendation:** Use CCView for comprehensive Canton Network data analysis and NodeFortress for quick governance/validator lookups.

---

**For Platform Team:** This configuration covers all 64 endpoints from the CantonView API. Ready for production integration with comprehensive blockchain explorer capabilities!
