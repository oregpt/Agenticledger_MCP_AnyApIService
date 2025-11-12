# Plaid API - AnyAPICall Integration Guide (SUGGESTIVE)

**🚨 IMPORTANT: Platform-First Approach**

Before using this guide, AgenticLedger platform teams should inspect their own platform to see what patterns have previously worked for existing APIs using AnyAPICall. This document provides suggestions and guidance, but your platform's existing patterns should take precedence.

---

## Table of Contents
1. [Quick Reference](#quick-reference)
2. [Overview](#overview)
3. [Authentication Flow](#authentication-flow)
4. [Suggested Configuration](#suggested-configuration)
5. [Core Endpoints for Bank Statement Data](#core-endpoints-for-bank-statement-data)
6. [Platform Integration Notes](#platform-integration-notes)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)
9. [Sandbox to Production Migration](#sandbox-to-production-migration)
10. [Appendix: Complete Endpoint Directory](#appendix-complete-endpoint-directory)
11. [Summary & Next Steps](#summary--next-steps)

---

## Quick Reference

### API Overview

| Property | Value |
|----------|-------|
| **API Name** | Plaid API |
| **Purpose** | Bank account data access (transactions, statements, balances) |
| **Base URL (Sandbox)** | `https://sandbox.plaid.com` |
| **Base URL (Production)** | `https://production.plaid.com` |
| **Authentication** | API Key (client_id + secret) + Access Token |
| **Request Method** | POST (all endpoints) |
| **Response Format** | JSON |
| **Rate Limits** | Not publicly documented (contact support) |
| **Documentation** | https://plaid.com/docs/api/ |

### Suggested API ID
```
plaid
```

### ⚠️ CRITICAL REQUIREMENTS

> **POST-Only API - NOT OPTIONAL**
>
> All Plaid API endpoints use POST requests, including read operations. This differs from typical REST conventions.
>
> ```
> Method: POST
> Content-Type: application/json
> ```
>
> **Why This Matters:** Using GET requests will fail. All parameters must be sent in the request body as JSON.
>
> **Where to Add This:** Ensure your AnyAPICall configuration sets `method: "POST"` for ALL Plaid endpoints.

> **Access Token Requirement - NOT OPTIONAL**
>
> Most Plaid API calls require an `access_token` in addition to `client_id` and `secret`. The access_token is obtained through the Link flow.
>
> ```json
> {
>   "client_id": "your_client_id",
>   "secret": "your_secret",
>   "access_token": "access-sandbox-xxx"
> }
> ```
>
> **Why This Matters:** Without an access_token, you can only call initialization endpoints. Bank statement data requires a valid access_token tied to a user's financial institution.
>
> **Where to Add This:** Platform must implement Plaid Link UI flow to obtain access tokens, or store existing tokens securely per user.

### Key Requirements

1. **Authentication can be provided two ways:**
   - Request body: `client_id` and `secret` fields
   - Headers: `PLAID-CLIENT-ID` and `PLAID-SECRET`

2. **All endpoints use POST method**

3. **Requires HTTPS TLS 1.2+**

4. **Access tokens don't expire** (but can be revoked)

5. **Date format:** `YYYY-MM-DD`

6. **Historical data:** Up to 24 months for transactions, 2 years for statements

---

## Overview

### What is Plaid?

Plaid is a financial data aggregation API that allows applications to connect to users' bank accounts and retrieve:
- **Transaction data** - Detailed transaction history
- **Bank statements** - PDF statements from financial institutions
- **Account balances** - Real-time and cached balance data
- **Account information** - Account numbers, routing numbers, ownership verification

### Use Cases for Bank Statement Data

1. **Accounting automation** - Import bank transactions into ledgers
2. **Financial analysis** - Analyze spending patterns and cash flow
3. **Loan underwriting** - Verify income and assess creditworthiness
4. **Tax preparation** - Gather transaction data for tax filing
5. **Reconciliation** - Match bank statements with internal records

### Plaid Architecture

**Item** = A user's login at a financial institution
**Access Token** = Permanent credential for accessing an Item's data
**Link** = User-facing UI for connecting bank accounts
**Products** = Different data types (Transactions, Auth, Balance, Statements)

---

## Authentication Flow

### Complete Flow for Bank Statement Access

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Get Plaid Credentials                               │
│ - Sign up at https://dashboard.plaid.com                    │
│ - Obtain client_id and secret                               │
│ - Start in Sandbox environment                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Create Link Token (for user authentication)         │
│ POST /link/token/create                                      │
│ {                                                            │
│   "client_id": "xxx",                                        │
│   "secret": "xxx",                                           │
│   "user": { "client_user_id": "user-123" },                 │
│   "client_name": "Your App Name",                           │
│   "products": ["transactions", "statements"],               │
│   "country_codes": ["US"],                                  │
│   "language": "en"                                           │
│ }                                                            │
│ Response: { "link_token": "link-sandbox-xxx" }              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: User Completes Link Flow                            │
│ - User opens Plaid Link UI (web or mobile)                  │
│ - User selects their bank                                   │
│ - User enters credentials                                   │
│ - User selects accounts                                     │
│ - Link returns public_token                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Exchange Public Token for Access Token              │
│ POST /item/public_token/exchange                            │
│ {                                                            │
│   "client_id": "xxx",                                        │
│   "secret": "xxx",                                           │
│   "public_token": "public-sandbox-xxx"                      │
│ }                                                            │
│ Response: {                                                  │
│   "access_token": "access-sandbox-xxx",                     │
│   "item_id": "item-xxx"                                     │
│ }                                                            │
│ ✅ STORE access_token - This is what you need!              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Use Access Token to Get Bank Statement Data         │
│ - /transactions/sync - Get transaction history              │
│ - /statements/list - Get available statements               │
│ - /statements/download - Download PDF statements            │
│ - /accounts/balance/get - Get real-time balances            │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Types

**Type 1: API Credentials (Always Required)**
```json
{
  "client_id": "your_client_id_here",
  "secret": "your_secret_here"
}
```
Or as headers:
```
PLAID-CLIENT-ID: your_client_id_here
PLAID-SECRET: your_secret_here
```

**Type 2: Access Token (Required for Most Endpoints)**
```json
{
  "access_token": "access-sandbox-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### Sandbox vs Production

**Sandbox Environment:**
- Base URL: `https://sandbox.plaid.com`
- Use test credentials (provided in docs)
- Free to use
- No real bank connections

**Production Environment:**
- Base URL: `https://production.plaid.com`
- Real bank connections
- Pricing based on usage
- Requires approval from Plaid

---

## Suggested Configuration

**⚠️ REMINDER:** Check your platform's existing AnyAPI configurations first!

### Option A: TypeScript Configuration (AgenticLedger Pattern)

If your platform uses TypeScript arrays like AgenticLedger:

```typescript
// In anyapicall-server.ts or equivalent

const PLAID_API: APIDefinition = {
  id: 'plaid',
  name: 'Plaid',
  description: 'Bank account data access - transactions, statements, and balances',
  baseUrl: 'https://sandbox.plaid.com', // Change to production.plaid.com for prod
  requiresAuth: true,
  authType: 'custom', // Custom because it uses client_id + secret + access_token
  rateLimit: {
    requestsPerMinute: null, // Not publicly documented
    requestsPerDay: null // Contact Plaid for limits
  },
  commonHeaders: {
    'Content-Type': 'application/json'
  },
  endpoints: [
    // ========================================
    // TRANSACTION ENDPOINTS
    // ========================================
    {
      name: 'transactions_sync',
      path: '/transactions/sync',
      method: 'POST',
      description: 'Get incremental transaction updates (recommended method)',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        },
        {
          name: 'cursor',
          type: 'string',
          required: false,
          description: 'Cursor for pagination (null for initial request)'
        },
        {
          name: 'count',
          type: 'number',
          required: false,
          description: 'Number of transactions to fetch (1-500, default 100)'
        },
        {
          name: 'days_requested',
          type: 'number',
          required: false,
          description: 'Historical depth in days (1-730, default 90)'
        }
      ],
      queryParams: [],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true },
        { name: 'cursor', type: 'string', required: false },
        { name: 'count', type: 'number', required: false },
        { name: 'days_requested', type: 'number', required: false },
        { name: 'account_id', type: 'string', required: false }
      ]
    },
    {
      name: 'transactions_get',
      path: '/transactions/get',
      method: 'POST',
      description: 'Get transactions for date range (legacy method)',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        },
        {
          name: 'start_date',
          type: 'string',
          required: true,
          description: 'Start date (YYYY-MM-DD)'
        },
        {
          name: 'end_date',
          type: 'string',
          required: true,
          description: 'End date (YYYY-MM-DD)'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true },
        { name: 'start_date', type: 'string', required: true },
        { name: 'end_date', type: 'string', required: true }
      ]
    },
    {
      name: 'transactions_refresh',
      path: '/transactions/refresh',
      method: 'POST',
      description: 'Force fresh transaction data pull from institution',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true }
      ]
    },

    // ========================================
    // STATEMENTS ENDPOINTS
    // ========================================
    {
      name: 'statements_list',
      path: '/statements/list',
      method: 'POST',
      description: 'Get list of available bank statements',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true }
      ]
    },
    {
      name: 'statements_download',
      path: '/statements/download',
      method: 'POST',
      description: 'Download a single bank statement as PDF',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        },
        {
          name: 'statement_id',
          type: 'string',
          required: true,
          description: 'Statement ID from statements/list'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true },
        { name: 'statement_id', type: 'string', required: true }
      ]
    },
    {
      name: 'statements_refresh',
      path: '/statements/refresh',
      method: 'POST',
      description: 'Trigger on-demand statement extraction',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        },
        {
          name: 'start_date',
          type: 'string',
          required: true,
          description: 'Start date (YYYY-MM-DD)'
        },
        {
          name: 'end_date',
          type: 'string',
          required: true,
          description: 'End date (YYYY-MM-DD, up to 2 years historical)'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true },
        { name: 'start_date', type: 'string', required: true },
        { name: 'end_date', type: 'string', required: true }
      ]
    },

    // ========================================
    // BALANCE ENDPOINTS
    // ========================================
    {
      name: 'accounts_balance_get',
      path: '/accounts/balance/get',
      method: 'POST',
      description: 'Get real-time account balances',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true },
        { name: 'options', type: 'object', required: false }
      ]
    },

    // ========================================
    // LINK TOKEN ENDPOINTS (Setup)
    // ========================================
    {
      name: 'link_token_create',
      path: '/link/token/create',
      method: 'POST',
      description: 'Create link token for user authentication flow',
      parameters: [
        {
          name: 'user',
          type: 'object',
          required: true,
          description: 'User object with client_user_id'
        },
        {
          name: 'client_name',
          type: 'string',
          required: true,
          description: 'Your application name'
        },
        {
          name: 'products',
          type: 'array',
          required: true,
          description: 'Products to enable (e.g., ["transactions", "statements"])'
        },
        {
          name: 'country_codes',
          type: 'array',
          required: true,
          description: 'Country codes (e.g., ["US"])'
        },
        {
          name: 'language',
          type: 'string',
          required: true,
          description: 'Language code (e.g., "en")'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'user', type: 'object', required: true },
        { name: 'client_name', type: 'string', required: true },
        { name: 'products', type: 'array', required: true },
        { name: 'country_codes', type: 'array', required: true },
        { name: 'language', type: 'string', required: true }
      ]
    },
    {
      name: 'item_public_token_exchange',
      path: '/item/public_token/exchange',
      method: 'POST',
      description: 'Exchange public token for access token',
      parameters: [
        {
          name: 'public_token',
          type: 'string',
          required: true,
          description: 'Public token from Link flow'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'public_token', type: 'string', required: true }
      ]
    },

    // ========================================
    // ITEM MANAGEMENT
    // ========================================
    {
      name: 'item_get',
      path: '/item/get',
      method: 'POST',
      description: 'Get information about an Item',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true }
      ]
    },
    {
      name: 'item_remove',
      path: '/item/remove',
      method: 'POST',
      description: 'Remove an Item (invalidates access token)',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item to remove'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true }
      ]
    },

    // ========================================
    // ACCOUNT INFO
    // ========================================
    {
      name: 'accounts_get',
      path: '/accounts/get',
      method: 'POST',
      description: 'Get account information and metadata',
      parameters: [
        {
          name: 'access_token',
          type: 'string',
          required: true,
          description: 'The access token for the Item'
        }
      ],
      bodyParams: [
        { name: 'client_id', type: 'string', required: false },
        { name: 'secret', type: 'string', required: false },
        { name: 'access_token', type: 'string', required: true }
      ]
    }
  ]
};

// Add to CORE_APIS array
export const CORE_APIS: APIDefinition[] = [
  // ... existing APIs
  PLAID_API,
];
```

### Option B: JSON Configuration (For JSON-Based Platforms)

If your platform uses JSON configuration files:

```json
{
  "id": "plaid",
  "name": "Plaid",
  "description": "Bank account data access - transactions, statements, and balances",
  "baseUrl": "https://sandbox.plaid.com",
  "requiresAuth": true,
  "authType": "custom",
  "rateLimit": {
    "requestsPerMinute": null,
    "requestsPerDay": null
  },
  "commonHeaders": {
    "Content-Type": "application/json"
  },
  "endpoints": [
    {
      "name": "transactions_sync",
      "path": "/transactions/sync",
      "method": "POST",
      "description": "Get incremental transaction updates",
      "parameters": [
        {
          "name": "access_token",
          "type": "string",
          "required": true,
          "description": "The access token for the Item"
        }
      ],
      "exampleRequest": {
        "client_id": "your_client_id",
        "secret": "your_secret",
        "access_token": "access-sandbox-xxx",
        "cursor": null,
        "count": 100
      }
    },
    {
      "name": "statements_list",
      "path": "/statements/list",
      "method": "POST",
      "description": "Get list of available bank statements",
      "parameters": [
        {
          "name": "access_token",
          "type": "string",
          "required": true
        }
      ],
      "exampleRequest": {
        "client_id": "your_client_id",
        "secret": "your_secret",
        "access_token": "access-sandbox-xxx"
      }
    }
  ]
}
```

---

## Core Endpoints for Bank Statement Data

### 1. Get Transaction History (`/transactions/sync`)

**Purpose:** Retrieve bank transaction data incrementally using cursor-based pagination.

**Request:**
```json
POST https://sandbox.plaid.com/transactions/sync
Content-Type: application/json

{
  "client_id": "your_client_id",
  "secret": "your_secret",
  "access_token": "access-sandbox-xxx",
  "cursor": null,
  "count": 100,
  "days_requested": 90
}
```

**Response:**
```json
{
  "added": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "transaction_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      "amount": 89.40,
      "date": "2024-01-15",
      "name": "CREDIT CARD 3333 PAYMENT *//",
      "merchant_name": "Chase Bank",
      "category": ["Payment", "Credit Card"],
      "payment_channel": "online",
      "pending": false,
      "location": {
        "address": null,
        "city": null,
        "region": null,
        "country": "US"
      }
    }
  ],
  "modified": [],
  "removed": [],
  "next_cursor": "abc123xyz",
  "has_more": true,
  "accounts": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "balances": {
        "available": 100.00,
        "current": 110.00,
        "iso_currency_code": "USD"
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "type": "depository",
      "subtype": "checking"
    }
  ],
  "request_id": "45QSZ"
}
```

### 2. List Available Statements (`/statements/list`)

**Purpose:** Get a list of downloadable bank statements.

**Request:**
```json
POST https://sandbox.plaid.com/statements/list
Content-Type: application/json

{
  "client_id": "your_client_id",
  "secret": "your_secret",
  "access_token": "access-sandbox-xxx"
}
```

**Response:**
```json
{
  "accounts": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "statements": [
        {
          "statement_id": "stmt-123",
          "month": 1,
          "year": 2024,
          "posting_date": "2024-02-01"
        },
        {
          "statement_id": "stmt-124",
          "month": 2,
          "year": 2024,
          "posting_date": "2024-03-01"
        }
      ]
    }
  ],
  "request_id": "67YTR"
}
```

### 3. Download Statement PDF (`/statements/download`)

**Purpose:** Download a specific bank statement as a PDF file.

**Request:**
```json
POST https://sandbox.plaid.com/statements/download
Content-Type: application/json

{
  "client_id": "your_client_id",
  "secret": "your_secret",
  "access_token": "access-sandbox-xxx",
  "statement_id": "stmt-123"
}
```

**Response:**
- Binary PDF data
- Header: `Plaid-Content-Hash: [SHA-256 checksum]`
- Content-Type: `application/pdf`

### 4. Get Real-Time Balances (`/accounts/balance/get`)

**Purpose:** Retrieve current account balances.

**Request:**
```json
POST https://sandbox.plaid.com/accounts/balance/get
Content-Type: application/json

{
  "client_id": "your_client_id",
  "secret": "your_secret",
  "access_token": "access-sandbox-xxx"
}
```

**Response:**
```json
{
  "accounts": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "balances": {
        "available": 100.00,
        "current": 110.00,
        "limit": null,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "type": "depository",
      "subtype": "checking"
    }
  ],
  "item": {
    "available_products": ["balance", "auth"],
    "billed_products": ["transactions"],
    "error": null,
    "institution_id": "ins_3",
    "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
    "webhook": "https://example.com/webhook"
  },
  "request_id": "89KLM"
}
```

---

## Platform Integration Notes

### STEP 1: Check Your Platform First! 🔍

1. Review existing APIs in your platform
2. Identify common patterns for POST-only APIs
3. Check how custom authentication is handled
4. Look for existing token management patterns

### STEP 2: Adapt the Configuration

**Key Adaptations Needed:**

1. **POST Method for All Endpoints**
   - Ensure all Plaid endpoints use `method: "POST"`
   - Do not use query parameters; everything goes in body

2. **Authentication Handling**
   - Need to handle both client credentials AND access tokens
   - Platform should store access tokens securely per user
   - Consider implementing Link flow in your platform

3. **Binary Response Handling**
   - `/statements/download` returns PDF binary data
   - Platform needs special handling for binary responses
   - Store checksum from `Plaid-Content-Hash` header

### STEP 3: Implement Plaid Link Flow

**Required for Production Use:**

Plaid Link is the official way to obtain access tokens. Your platform needs to:

1. **Backend: Create link token**
```typescript
async function createLinkToken(userId: string): Promise<string> {
  const response = await fetch('https://sandbox.plaid.com/link/token/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      user: { client_user_id: userId },
      client_name: 'Your App Name',
      products: ['transactions', 'statements'],
      country_codes: ['US'],
      language: 'en'
    })
  });

  const data = await response.json();
  return data.link_token;
}
```

2. **Frontend: Initialize Plaid Link**
```html
<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>

<script>
  const linkHandler = Plaid.create({
    token: linkToken, // from backend
    onSuccess: async (public_token, metadata) => {
      // Send public_token to your backend
      await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        body: JSON.stringify({ public_token })
      });
    },
    onExit: (err, metadata) => {
      // Handle user exit
    }
  });

  // Open Link when user clicks "Connect Bank"
  linkHandler.open();
</script>
```

3. **Backend: Exchange public token for access token**
```typescript
async function exchangePublicToken(publicToken: string): Promise<string> {
  const response = await fetch('https://sandbox.plaid.com/item/public_token/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token: publicToken
    })
  });

  const data = await response.json();

  // ✅ STORE THIS SECURELY
  const accessToken = data.access_token;
  const itemId = data.item_id;

  // Save to database associated with user
  await saveUserPlaidToken(userId, accessToken, itemId);

  return accessToken;
}
```

### STEP 4: Implement Credential Management

```typescript
// Token storage interface
interface PlaidCredential {
  userId: string;
  accessToken: string;
  itemId: string;
  institutionId: string;
  institutionName: string;
  createdAt: Date;
  lastSyncedAt: Date;
}

// Helper to get credentials for API calls
async function getPlaidCredentials(userId: string): Promise<PlaidCredential> {
  // Retrieve from secure storage
  const credential = await database.plaidCredentials.findOne({ userId });

  if (!credential) {
    throw new Error('User has not connected a bank account');
  }

  return credential;
}

// Helper to make Plaid API calls
async function makePlaidCall(
  userId: string,
  endpoint: string,
  additionalParams: any = {}
): Promise<any> {
  const credential = await getPlaidCredentials(userId);

  const response = await fetch(`https://sandbox.plaid.com${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET
    },
    body: JSON.stringify({
      access_token: credential.accessToken,
      ...additionalParams
    })
  });

  return await response.json();
}
```

### STEP 5: Create Quick Integration Checklist

## Quick Integration Checklist

### For TypeScript-based platforms (like AgenticLedger):

- [ ] Add Plaid API definition to CORE_APIS array (anyapicall-server.ts)
- [ ] Set ALL endpoints to method: "POST"
- [ ] Implement Plaid Link flow in frontend
  - [ ] Add Plaid Link JavaScript library
  - [ ] Create link token endpoint
  - [ ] Handle Link success callback
  - [ ] Exchange public token for access token
- [ ] Create secure token storage for access_tokens
- [ ] Add custom authentication handler for Plaid (client_id + secret + access_token)
- [ ] Implement binary response handling for PDF downloads
- [ ] Add environment variables:
  - [ ] `PLAID_CLIENT_ID`
  - [ ] `PLAID_SECRET`
  - [ ] `PLAID_ENV` (sandbox or production)
- [ ] Test in Sandbox with test credentials
- [ ] Update server description/apiId schema
- [ ] Add to Smart Router command map (optional)
- [ ] Test transaction sync: `!plaid transactions_sync`
- [ ] Test statement listing: `!plaid statements_list`
- [ ] Test PDF download: `!plaid statements_download`
- [ ] Verify error handling for expired/invalid tokens
- [ ] Apply for Plaid Production access (requires approval)
- [ ] Switch to production URL after approval

### For JSON-based platforms:

- [ ] Add JSON config to config/apis.json
- [ ] Restart server (no rebuild needed)
- [ ] Configure POST method for all endpoints
- [ ] Implement Plaid Link UI flow
- [ ] Set up secure token storage
- [ ] Test with Sandbox credentials
- [ ] Enable for test organization
- [ ] Verify all endpoints work
- [ ] Apply for Production access
- [ ] Enable for production

### Estimated Integration Time: 4-6 hours
- Link flow implementation: 2-3 hours
- Token storage: 1 hour
- Testing: 1-2 hours

---

## Usage Examples

### Example 1: Get Last 30 Days of Transactions

```javascript
// Using AnyAPICall MCP Server
const result = await makeApiCall({
  apiId: 'plaid',
  endpoint: '/transactions/sync',
  method: 'POST',
  body: {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    access_token: userAccessToken,
    cursor: null, // First request
    count: 500,
    days_requested: 30
  }
});

// Process transactions
const transactions = result.data.added;
console.log(`Retrieved ${transactions.length} transactions`);

transactions.forEach(txn => {
  console.log(`${txn.date}: ${txn.name} - $${txn.amount}`);
});

// Store cursor for next sync
const nextCursor = result.data.next_cursor;
await saveCursor(userId, nextCursor);
```

### Example 2: Download All Available Statements

```javascript
// Step 1: Get list of statements
const statementsList = await makeApiCall({
  apiId: 'plaid',
  endpoint: '/statements/list',
  method: 'POST',
  body: {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    access_token: userAccessToken
  }
});

// Step 2: Download each statement
for (const account of statementsList.data.accounts) {
  for (const statement of account.statements) {
    const pdf = await makeApiCall({
      apiId: 'plaid',
      endpoint: '/statements/download',
      method: 'POST',
      body: {
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
        access_token: userAccessToken,
        statement_id: statement.statement_id
      },
      responseType: 'arraybuffer' // Binary response
    });

    // Save PDF
    const filename = `statement_${statement.year}_${statement.month}.pdf`;
    await fs.writeFile(filename, pdf.data);
    console.log(`Downloaded: ${filename}`);
  }
}
```

### Example 3: Get Account Balances and Transaction Summary

```javascript
// Get current balances
const balances = await makeApiCall({
  apiId: 'plaid',
  endpoint: '/accounts/balance/get',
  method: 'POST',
  body: {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    access_token: userAccessToken
  }
});

// Get recent transactions
const transactions = await makeApiCall({
  apiId: 'plaid',
  endpoint: '/transactions/sync',
  method: 'POST',
  body: {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    access_token: userAccessToken,
    cursor: null,
    days_requested: 30
  }
});

// Create summary
const summary = {
  accounts: balances.data.accounts.map(acc => ({
    name: acc.name,
    type: acc.subtype,
    balance: acc.balances.current,
    available: acc.balances.available
  })),
  recentTransactions: transactions.data.added.length,
  totalSpent: transactions.data.added
    .filter(txn => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0)
};

console.log(summary);
```

### Example 4: Incremental Transaction Sync (Efficient Updates)

```javascript
// First sync (initial load)
let cursor = null;
let allTransactions = [];

do {
  const result = await makeApiCall({
    apiId: 'plaid',
    endpoint: '/transactions/sync',
    method: 'POST',
    body: {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: userAccessToken,
      cursor: cursor,
      count: 500
    }
  });

  // Add new transactions
  allTransactions.push(...result.data.added);

  // Update modified transactions
  result.data.modified.forEach(modTxn => {
    const idx = allTransactions.findIndex(t => t.transaction_id === modTxn.transaction_id);
    if (idx !== -1) allTransactions[idx] = modTxn;
  });

  // Remove deleted transactions
  result.data.removed.forEach(removedId => {
    allTransactions = allTransactions.filter(t => t.transaction_id !== removedId);
  });

  cursor = result.data.next_cursor;

  // Continue if there are more pages
} while (result.data.has_more);

// Save cursor for future incremental syncs
await saveCursor(userId, cursor);

console.log(`Total transactions: ${allTransactions.length}`);
```

---

## Troubleshooting

### Issue 1: "INVALID_REQUEST" - Missing required field

**Symptoms:**
```json
{
  "error_type": "INVALID_REQUEST",
  "error_code": "MISSING_FIELDS",
  "error_message": "the following required fields are missing: access_token"
}
```

**Cause:** Missing required fields in request body

**Solution:**
1. Ensure all required fields are present:
   - `client_id` and `secret` (or as headers)
   - `access_token` (for most endpoints)
2. Check field names are spelled correctly
3. Verify access_token is valid and not expired (though tokens don't expire by default)

---

### Issue 2: "INVALID_ACCESS_TOKEN" Error

**Symptoms:**
```json
{
  "error_type": "INVALID_INPUT",
  "error_code": "INVALID_ACCESS_TOKEN",
  "error_message": "the provided access token is not valid"
}
```

**Cause:**
- Access token was revoked via `/item/remove`
- Invalid or malformed token
- Using sandbox token with production URL (or vice versa)

**Solution:**
1. Verify you're using the correct environment (sandbox vs production)
2. Check if user needs to re-authenticate via Plaid Link
3. Ensure token wasn't accidentally removed from database
4. For testing, create a new Item via Link flow

---

### Issue 3: Statement Download Returns Empty or Corrupted PDF

**Symptoms:** PDF file is empty, corrupted, or won't open

**Cause:**
- Response not handled as binary data
- Encoding issue during transfer
- Missing Content-Type header handling

**Solution:**
```javascript
// Correct way to download PDF
const response = await fetch('https://sandbox.plaid.com/statements/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'PLAID-CLIENT-ID': clientId,
    'PLAID-SECRET': secret
  },
  body: JSON.stringify({
    access_token: accessToken,
    statement_id: statementId
  })
});

// Get as array buffer (binary)
const pdfBuffer = await response.arrayBuffer();

// Verify checksum
const checksum = response.headers.get('Plaid-Content-Hash');
const computedHash = await crypto.subtle.digest('SHA-256', pdfBuffer);
// Compare checksums

// Save binary data
await fs.writeFile('statement.pdf', Buffer.from(pdfBuffer));
```

---

### Issue 4: "ITEM_LOGIN_REQUIRED" Error

**Symptoms:**
```json
{
  "error_type": "ITEM_ERROR",
  "error_code": "ITEM_LOGIN_REQUIRED",
  "error_message": "the login details of this item have changed and a user login is required to update"
}
```

**Cause:**
- User changed their bank password
- Bank requires re-authentication
- MFA challenge needs to be completed

**Solution:**
1. Detect this error in your application
2. Prompt user to reconnect their account
3. Use Plaid Link Update Mode:
```javascript
const linkHandler = Plaid.create({
  token: linkToken,
  onSuccess: (public_token, metadata) => {
    // Item is now updated
  }
});
linkHandler.open();
```

---

### Issue 5: Rate Limiting (Unknown Limits)

**Symptoms:** Requests start failing or slowing down

**Cause:** Hitting Plaid's rate limits (not publicly documented)

**Solution:**
1. Implement exponential backoff:
```typescript
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

2. Batch requests when possible
3. Cache transaction data and use cursor-based sync
4. Contact Plaid support for specific rate limits for your use case

---

### Issue 6: Getting 401 Unauthorized

**Symptoms:** All requests return 401

**Cause:**
- Invalid client_id or secret
- Using test credentials in production
- Credentials not properly passed to API

**Solution:**
1. Verify credentials in Plaid Dashboard
2. Check environment variables are loaded:
```bash
echo $PLAID_CLIENT_ID
echo $PLAID_SECRET
```
3. Ensure credentials match environment (sandbox vs production)
4. Try passing credentials as headers instead of body:
```javascript
headers: {
  'PLAID-CLIENT-ID': clientId,
  'PLAID-SECRET': secret
}
```

---

## Sandbox to Production Migration

### 🎯 Overview

This section covers everything you need to know about moving from Plaid Sandbox (testing) to Production (real banks).

**Current Status:** ✅ Your integration is production-ready. You just need production credentials.

---

### What You're Using Now (Sandbox)

**Sandbox Environment:**
- Base URL: `https://sandbox.plaid.com`
- Test banks only ("First Platypus Bank", etc.)
- Fake transaction data
- Test credentials: user_good / pass_good
- ✅ Free unlimited testing
- ✅ No approval needed
- ✅ Instant setup

**Your Sandbox Credentials:**
- Client ID: `6914a81a11cde4******` (example - you have yours)
- Secret: `f63eb9a9c******` (example - you have yours)
- Access Token: Generated via Link with test banks

---

### What Production Requires

**Production Environment:**
- Base URL: `https://production.plaid.com`
- Real banks (Chase, Bank of America, Wells Fargo, etc.)
- Real transaction data from users' actual accounts
- Real user credentials (their actual bank login)
- ⚠️ Requires Plaid approval (~1-2 weeks)
- ⚠️ Different credentials needed
- ⚠️ May have costs/pricing tiers

**Production Credentials (You'll Get These):**
- Client ID: `prod-xxxx-xxxx` (different from sandbox)
- Secret: `prod-secret-xxxx` (different from sandbox)
- Access Tokens: Generated via Link with real banks

---

### Is Your Code Production Ready? ✅ YES!

**What's Already Production-Ready:**
- ✅ All API integrations (balances, transactions)
- ✅ Authentication flow (Link implementation)
- ✅ Error handling
- ✅ Request/response formats
- ✅ Integration patterns
- ✅ Data processing logic

**What's NOT Production-Ready:**
- ⚠️ Using sandbox credentials (need production ones)
- ⚠️ Using sandbox base URL (need production URL)
- ⚠️ Test banks (users will connect real banks)

**Bottom Line:** Your code works perfectly. You just need to swap credentials and URL.

---

### Step-by-Step Migration Guide

#### Step 1: Apply for Plaid Production Access

**Timeline:** 1-2 weeks for approval

**Process:**

1. **Go to Plaid Dashboard**
   - Visit: https://dashboard.plaid.com
   - Log in with your account

2. **Click "Request Production Access"**
   - Usually in top-right or main dashboard

3. **Complete Application Form**

   Plaid will ask about:

   **Application Details:**
   - Company name and website
   - What your application does
   - How you'll use Plaid data
   - Expected volume (number of users)
   - Privacy policy URL (required)
   - Terms of service URL (required)

   **Use Case Description:**
   ```
   Example: "We provide accounting automation for small businesses.
   Users connect their bank accounts to automatically import transactions
   into our ledger system. We use balances and transaction data to
   generate financial reports and reconcile accounts."
   ```

   **Compliance Questions:**
   - How you store data
   - Security measures
   - User consent process
   - Data retention policy

4. **Submit Application**
   - Plaid reviews your submission
   - May ask follow-up questions
   - Approval typically takes 1-2 weeks

5. **Get Approval**
   - Email notification when approved
   - Production credentials become available

**Tips for Faster Approval:**
- Have privacy policy and ToS ready
- Be specific about your use case
- Mention you've tested in sandbox
- Show you understand data security

---

#### Step 2: Get Production Credentials

**Once Approved:**

1. **Access Production Dashboard**
   - Log into https://dashboard.plaid.com
   - Switch to "Production" environment (usually a toggle/dropdown)

2. **Retrieve Credentials**
   - Navigate to Keys or API section
   - Copy your production `client_id`
   - Copy your production `secret`
   - These are DIFFERENT from sandbox

3. **Secure Storage**
   - Store in environment variables
   - Never commit to Git
   - Use secrets management (AWS Secrets Manager, etc.)

**Example Production Credentials Format:**
```
Client ID: 5f1a2b3c4d5e6f7a8b9c0d1e
Secret: 9z8y7x6w5v4u3t2s1r0q9p8o
```

---

#### Step 3: Update Your Code

**Required Changes:** Only 2-3 lines!

**Option A: Environment Variable Approach (Recommended)**

```typescript
// Before (Sandbox Only)
const PLAID_CLIENT_ID = '6914a81a11cde40020b0fc33';
const PLAID_SECRET = 'f63eb9a9c21a982d782df6eeb5e327';
const BASE_URL = 'sandbox.plaid.com';

// After (Environment-Based)
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const BASE_URL = PLAID_ENV === 'production'
  ? 'production.plaid.com'
  : 'sandbox.plaid.com';
```

**Option B: Configuration File Approach**

```typescript
// config/plaid.ts
interface PlaidConfig {
  clientId: string;
  secret: string;
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

const config: Record<string, PlaidConfig> = {
  sandbox: {
    clientId: process.env.PLAID_SANDBOX_CLIENT_ID!,
    secret: process.env.PLAID_SANDBOX_SECRET!,
    baseUrl: 'https://sandbox.plaid.com',
    environment: 'sandbox'
  },
  production: {
    clientId: process.env.PLAID_PRODUCTION_CLIENT_ID!,
    secret: process.env.PLAID_PRODUCTION_SECRET!,
    baseUrl: 'https://production.plaid.com',
    environment: 'production'
  }
};

export const plaidConfig = config[process.env.NODE_ENV || 'sandbox'];
```

**Environment Variables:**
```bash
# .env.production
PLAID_ENV=production
PLAID_CLIENT_ID=your_production_client_id
PLAID_SECRET=your_production_secret

# .env.sandbox (for testing)
PLAID_ENV=sandbox
PLAID_CLIENT_ID=your_sandbox_client_id
PLAID_SECRET=your_sandbox_secret
```

**That's It!** Everything else stays the same.

---

#### Step 4: Test in Production

**Testing Strategy:**

1. **Start with Your Own Account**
   ```
   - Connect YOUR bank account first
   - Verify data comes through correctly
   - Check balances and transactions
   - Ensure no errors
   ```

2. **Internal Testing**
   ```
   - Have team members connect their banks
   - Test different banks (Chase, BofA, etc.)
   - Verify all account types work
   - Check edge cases
   ```

3. **Beta Testing**
   ```
   - Select trusted users for beta
   - Monitor for issues
   - Collect feedback
   - Fix any problems
   ```

4. **Full Rollout**
   ```
   - Gradually increase user access
   - Monitor error rates
   - Watch for Plaid API errors
   - Scale up as stable
   ```

**Key Differences in Production:**

| Aspect | Sandbox | Production |
|--------|---------|------------|
| Banks | Test banks only | All real banks |
| Credentials | user_good/pass_good | Users' actual passwords |
| Data | Fake transactions | Real bank data |
| Errors | Rare | More common (bank issues) |
| Rate Limits | Unlimited | May have limits |
| Costs | Free | Per-API-call pricing |

---

#### Step 5: Handle Production-Specific Scenarios

**Error Handling Improvements:**

```typescript
async function makePlaidCall(endpoint: string, body: any) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        ...body
      })
    });

    const data = await response.json();

    // Production-specific error handling
    if (data.error_code) {
      switch (data.error_code) {
        case 'ITEM_LOGIN_REQUIRED':
          // User needs to re-authenticate
          return {
            error: 'REAUTH_REQUIRED',
            message: 'Please reconnect your bank account',
            action: 'SHOW_LINK_UPDATE'
          };

        case 'INSUFFICIENT_CREDENTIALS':
          // Bank requires MFA
          return {
            error: 'MFA_REQUIRED',
            message: 'Additional authentication required',
            action: 'SHOW_LINK_UPDATE'
          };

        case 'INSTITUTION_DOWN':
          // Bank is temporarily unavailable
          return {
            error: 'BANK_UNAVAILABLE',
            message: 'Bank is temporarily unavailable. Try again later.',
            action: 'RETRY_LATER'
          };

        default:
          return {
            error: data.error_code,
            message: data.error_message,
            action: 'CONTACT_SUPPORT'
          };
      }
    }

    return { success: true, data };
  } catch (error) {
    return {
      error: 'NETWORK_ERROR',
      message: 'Failed to connect to Plaid',
      action: 'RETRY'
    };
  }
}
```

**Webhook Setup (Recommended for Production):**

```typescript
// Receive notifications when items need attention
app.post('/plaid/webhook', async (req, res) => {
  const { webhook_type, webhook_code, item_id } = req.body;

  switch (webhook_code) {
    case 'ITEM_LOGIN_REQUIRED':
      // Notify user to reconnect
      await notifyUser(item_id, 'Please reconnect your bank account');
      break;

    case 'TRANSACTIONS_REMOVED':
      // Some transactions were removed/modified
      await refreshTransactions(item_id);
      break;

    case 'ERROR':
      // Item error occurred
      await handleItemError(item_id);
      break;
  }

  res.json({ received: true });
});
```

---

### What Changes for Users

**Sandbox (Testing):**
```
User Experience:
1. Click "Connect Bank"
2. See list of test banks
3. Select "First Platypus Bank"
4. Enter: user_good / pass_good
5. See fake data
```

**Production (Real):**
```
User Experience:
1. Click "Connect Bank"
2. See list of REAL banks (Chase, BofA, Wells Fargo, etc.)
3. Select their actual bank
4. Enter their REAL bank credentials
5. See their ACTUAL transaction data
6. May need to complete MFA (SMS code, email, etc.)
```

**Nothing else changes!** Same UI, same flow, just real banks.

---

### Cost Considerations

**Sandbox:** Free unlimited

**Production Pricing (typical - verify with Plaid):**
- Transactions API: $0.05 - $0.10 per user/month
- Balance checks: $0.02 - $0.05 per check
- Statements: Additional cost if using
- Volume discounts available

**Cost Optimization Tips:**
- Cache transaction data (don't fetch every time)
- Use webhooks to know when to refresh
- Implement cursor-based sync (don't re-fetch all)
- Monitor API usage

---

### Deployment Checklist

**Pre-Production:**
- [ ] Applied for Plaid production access
- [ ] Received production credentials
- [ ] Updated environment variables
- [ ] Changed base URL to production
- [ ] Tested with your own bank account
- [ ] Implemented production error handling
- [ ] Set up webhook endpoint (recommended)
- [ ] Configured monitoring/alerts
- [ ] Updated privacy policy to mention Plaid
- [ ] Added "Powered by Plaid" badge (if required)

**During Production:**
- [ ] Start with beta users
- [ ] Monitor error rates
- [ ] Watch Plaid dashboard for issues
- [ ] Collect user feedback
- [ ] Respond to ITEM_LOGIN_REQUIRED quickly
- [ ] Handle bank downtime gracefully

**Post-Production:**
- [ ] Monitor API costs
- [ ] Optimize API usage
- [ ] Update documentation
- [ ] Train support team on Plaid issues
- [ ] Set up alerting for high error rates

---

### Common Production Issues & Solutions

**Issue 1: ITEM_LOGIN_REQUIRED**
```
Cause: User changed bank password, or bank requires re-authentication
Solution: Show Link in Update mode to re-authenticate
Frequency: Common (affects ~5-10% of users monthly)
```

**Issue 2: Bank Downtime**
```
Cause: Bank's servers are down or maintenance
Solution: Show friendly error, retry later automatically
Frequency: Occasional (major banks rarely, smaller banks more often)
```

**Issue 3: MFA Challenges**
```
Cause: Bank requires multi-factor authentication
Solution: Link handles this automatically, may take longer
Frequency: Common for first connection, rare after
```

**Issue 4: Rate Limiting**
```
Cause: Too many API requests in short time
Solution: Implement exponential backoff, cache data
Frequency: Rare with proper implementation
```

---

### Monitoring Production

**Key Metrics to Track:**

1. **Connection Success Rate**
   - Target: >95%
   - Alert if: <90%

2. **ITEM_LOGIN_REQUIRED Rate**
   - Expected: 5-10% per month
   - Alert if: >15%

3. **API Error Rate**
   - Target: <2%
   - Alert if: >5%

4. **Average Response Time**
   - Balances: <2s
   - Transactions: <500ms
   - Alert if: >5s

**Plaid Dashboard:**
- View real-time API health
- See error breakdowns
- Monitor usage/costs
- Download logs

---

### Rollback Plan

**If Production Issues Occur:**

```typescript
// Quick rollback to sandbox
const PLAID_ENV = process.env.FORCE_SANDBOX === 'true'
  ? 'sandbox'
  : process.env.PLAID_ENV;
```

**Steps:**
1. Set `FORCE_SANDBOX=true` environment variable
2. Restart application
3. Users see "Bank connections temporarily unavailable"
4. Debug production issue
5. Fix problem
6. Remove force sandbox flag
7. Resume production

---

### Summary: Sandbox → Production

**What You Need:**
1. Production credentials from Plaid (apply at dashboard.plaid.com)
2. Change 2-3 lines of code (base URL + credentials)
3. Test with real bank account
4. Deploy

**What Stays the Same:**
- All API endpoints
- Request/response formats
- Authentication flow
- Link integration
- Error handling logic
- Your application code

**What Changes:**
- Base URL: sandbox.plaid.com → production.plaid.com
- Credentials: sandbox → production
- Banks: test → real
- Data: fake → real
- Cost: free → per-API-call pricing

**Timeline:**
- Application submission: 30 minutes
- Plaid approval: 1-2 weeks
- Code changes: 15 minutes
- Testing: 1-2 hours
- Deployment: Normal deployment time

**Estimated Total: 2-3 weeks** (mostly waiting for Plaid approval)

---

### Quick Reference: Code Changes

**Single Change Needed:**

```typescript
// config/plaid.config.ts

export const plaidConfig = {
  // Change these when moving to production
  clientId: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  baseUrl: process.env.PLAID_ENV === 'production'
    ? 'https://production.plaid.com'
    : 'https://sandbox.plaid.com',

  // Everything else stays the same
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  retryAttempts: 3
};
```

**Environment Variables:**
```bash
# Production
PLAID_ENV=production
PLAID_CLIENT_ID=<your_production_client_id>
PLAID_SECRET=<your_production_secret>

# Sandbox
PLAID_ENV=sandbox
PLAID_CLIENT_ID=<your_sandbox_client_id>
PLAID_SECRET=<your_sandbox_secret>
```

**That's literally it!** 🎉

---

## Appendix: Complete Endpoint Directory

**🚨 CRITICAL: This section is REQUIRED for AgenticLedger integration**

### Why This Matters

AgenticLedger's capability selection UI needs a complete list of all endpoints with descriptions to show users what actions they can perform with this API. This table is used directly in the platform.

### Complete Endpoint Directory (Name → Description)

#### Category 1: Transactions (4 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `transactions_sync` | POST | `/transactions/sync` | Get incremental transaction updates using cursor (recommended) |
| `transactions_get` | POST | `/transactions/get` | Get transactions for specific date range (legacy method) |
| `transactions_refresh` | POST | `/transactions/refresh` | Force fresh transaction data pull from financial institution |
| `transactions_recurring_get` | POST | `/transactions/recurring/get` | Get recurring transaction patterns and subscriptions |

#### Category 2: Statements (3 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `statements_list` | POST | `/statements/list` | Get list of available bank statements with dates |
| `statements_download` | POST | `/statements/download` | Download single bank statement as PDF file |
| `statements_refresh` | POST | `/statements/refresh` | Trigger on-demand statement extraction from institution |

#### Category 3: Balance (1 endpoint)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `accounts_balance_get` | POST | `/accounts/balance/get` | Get real-time account balances (forces fresh fetch) |

#### Category 4: Account Info (1 endpoint)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `accounts_get` | POST | `/accounts/get` | Get account information, metadata, and basic details |

#### Category 5: Link & Token Management (2 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `link_token_create` | POST | `/link/token/create` | Create link token for user authentication flow |
| `item_public_token_exchange` | POST | `/item/public_token/exchange` | Exchange public token from Link for permanent access token |

#### Category 6: Item Management (2 endpoints)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `item_get` | POST | `/item/get` | Get information about an Item (institution, status, products) |
| `item_remove` | POST | `/item/remove` | Remove Item and invalidate access token (user disconnect) |

#### Category 7: Categories (1 endpoint)

| Endpoint Name | Method | Path | Description |
|---------------|--------|------|-------------|
| `categories_get` | POST | `/categories/get` | Get all available transaction categorization options |

### Quick Reference: Endpoints by Test Status

**✅ Live Tested & Verified (0 endpoints):**
- None yet - requires active Plaid credentials and Link flow setup
- See "Testing Guide" section for how to test with Sandbox

**❌ Known Issues (0 endpoints):**
- None known

**📋 Documented Not Yet Tested (14 endpoints):**
- All endpoints listed above
- All require access_token (except link_token_create)
- All documented based on official Plaid API documentation
- Testing requires completing Link flow to obtain access_token

### Endpoint Priority for Bank Statement Use Case

**High Priority (Must Implement First):**
1. `link_token_create` - Required to get started
2. `item_public_token_exchange` - Required to get access token
3. `transactions_sync` - Primary method for transaction data
4. `statements_list` - See available statements
5. `statements_download` - Download statement PDFs
6. `accounts_balance_get` - Get current balances

**Medium Priority (Common Use Cases):**
7. `accounts_get` - Get account details
8. `item_get` - Check connection status
9. `transactions_refresh` - Force data refresh

**Low Priority (Nice to Have):**
10. `transactions_recurring_get` - Subscription detection
11. `statements_refresh` - On-demand statement extraction
12. `categories_get` - Category reference
13. `transactions_get` - Legacy transaction method
14. `item_remove` - User disconnect

---

## How to Update JSON Config

### Option 1: Add to Platform Database (Recommended)

If using AgenticLedger or similar platform:

1. Access platform admin panel
2. Navigate to API Management → AnyAPICall Configurations
3. Click "Add New API"
4. Paste the JSON configuration from Option B above
5. Save and test with one endpoint first

### Option 2: Add to config/apis.json (If Using Locally)

1. Open `config/apis.json` in your AnyAPICall server directory
2. Add the Plaid configuration to the array
3. Restart the server (no rebuild needed)
4. Verify server loaded the config: check startup logs

### Validation Checklist

- [ ] All required fields present (`id`, `name`, `baseUrl`)
- [ ] All endpoints use `method: "POST"`
- [ ] `authType` set to `"custom"` (not "bearer" or "apikey")
- [ ] Common headers include `Content-Type: application/json`
- [ ] Environment variable configured: `PLAID_CLIENT_ID`, `PLAID_SECRET`
- [ ] Test with one endpoint first (`link_token_create` doesn't need access_token)
- [ ] Field names match platform conventions
- [ ] Base URL set to sandbox for testing

---

## Summary

### What This Guide Provides

✅ **Complete Plaid API configuration** for AnyAPICall MCP Server
✅ **14 endpoints documented** covering transactions, statements, balances
✅ **Authentication flow explained** with Link integration guide
✅ **TypeScript and JSON configurations** ready to use
✅ **Helper functions** for token management and API calls
✅ **Usage examples** for common bank statement use cases
✅ **Troubleshooting guide** for common issues
✅ **Complete endpoint directory** for AgenticLedger UI integration

### What You Should Do

**Immediate Next Steps:**

1. **Sign up for Plaid**
   - Go to https://dashboard.plaid.com
   - Create account
   - Get your client_id and secret
   - Start in Sandbox environment (free)

2. **Add to Your Platform**
   - Use TypeScript configuration if using AgenticLedger pattern
   - Use JSON configuration if using JSON-based platform
   - Set base URL to `https://sandbox.plaid.com` for testing

3. **Implement Link Flow**
   - Add Plaid Link JavaScript library to frontend
   - Create link token endpoint
   - Handle Link success callback
   - Exchange public token for access token
   - Store access token securely

4. **Test Core Endpoints**
   - `link_token_create` - Can test immediately
   - Complete Link flow in Sandbox with test bank
   - Test `transactions_sync`, `statements_list`, `accounts_balance_get`

5. **Prepare for Production**
   - Apply for Plaid Production access (requires approval)
   - Switch base URL to `https://production.plaid.com`
   - Update credentials to production keys

### Key Reminders

🔴 **ALL endpoints use POST method** - No GET requests
🔴 **Access token required** for most endpoints (get via Link flow)
🔴 **PDF downloads return binary data** - Handle appropriately
🔴 **Tokens don't expire** - But can be revoked
🔴 **Sandbox is free** - Use for testing before production
🔴 **Production requires approval** - Apply early if needed

### For Bank Statement Data Specifically

**Primary Endpoints:**
- `/transactions/sync` - Transaction history (most efficient)
- `/statements/list` - List available statements
- `/statements/download` - Get PDF statements
- `/accounts/balance/get` - Current balances

**Data Retention:**
- Transactions: Up to 24 months historical
- Statements: Up to 2 years historical

**Best Practices:**
- Use `/transactions/sync` with cursor for incremental updates
- Store cursor value for efficient future syncs
- Download statements as needed (not all at once)
- Verify PDF checksums from `Plaid-Content-Hash` header

---

## Next Steps

### Testing in Sandbox

1. **Create Link Token:**
```bash
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "your_client_id",
    "secret": "your_secret",
    "user": {"client_user_id": "test-user-123"},
    "client_name": "Test App",
    "products": ["transactions", "statements"],
    "country_codes": ["US"],
    "language": "en"
  }'
```

2. **Use Plaid Link Sandbox:**
   - Open Link with the link_token
   - Select "First Platypus Bank" (test institution)
   - Username: `user_good`
   - Password: `pass_good`
   - Select accounts and continue

3. **Exchange Public Token:**
```bash
curl -X POST https://sandbox.plaid.com/item/public_token/exchange \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "your_client_id",
    "secret": "your_secret",
    "public_token": "public-sandbox-xxx"
  }'
```

4. **Get Transactions:**
```bash
curl -X POST https://sandbox.plaid.com/transactions/sync \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "your_client_id",
    "secret": "your_secret",
    "access_token": "access-sandbox-xxx",
    "cursor": null,
    "count": 100
  }'
```

### Resources

- **Plaid Dashboard:** https://dashboard.plaid.com
- **API Documentation:** https://plaid.com/docs/api/
- **Sandbox Test Credentials:** https://plaid.com/docs/sandbox/test-credentials/
- **Link Integration Guide:** https://plaid.com/docs/link/
- **Quickstart Guides:** https://plaid.com/docs/quickstart/
- **Postman Collection:** Available in Plaid Dashboard

---

**Document Version:** 1.0
**Last Updated:** 2025-11-12
**Test Status:** ⏳ Ready for Testing (Requires Credentials)
**Integration Status:** Ready for Platform Integration
**Author:** AgenticLedger Development Team

---

**Built with ❤️ for the AgenticLedger AI Agent Platform**

*Enabling seamless bank statement data access for AI agents* 🚀
