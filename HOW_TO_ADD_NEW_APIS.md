# How to Add New APIs - Complete Guide

## Quick Start

**TLDR:** Edit `config/apis.json` → Restart server → Done!

No code changes, no rebuild needed!

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Guide](#step-by-step-guide)
3. [API Configuration Structure](#api-configuration-structure)
4. [Real Examples](#real-examples)
5. [Testing Your API](#testing-your-api)
6. [Common Issues](#common-issues)
7. [Advanced Configuration](#advanced-configuration)

---

## Prerequisites

Before adding a new API, gather this information:

- ✅ **API Base URL** (e.g., `https://api.spotify.com/v1`)
- ✅ **API Documentation** link
- ✅ **Authentication Type** (none, API key, Bearer token, Basic auth)
- ✅ **Authentication Header Name** (if using API key)
- ✅ **Endpoint Paths** you want to support
- ✅ **Parameters** for each endpoint
- ✅ **Rate Limits** (if documented)

Optional but helpful:
- 📖 Example request/response from API docs
- 🔑 Test API key (for verification)

---

## Step-by-Step Guide

### Step 1: Open the Config File

Navigate to:
```
C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\AnyAPICall\config\apis.json
```

Open in your favorite text editor (VS Code, Notepad++, etc.)

### Step 2: Find the APIs Array

Look for the `"apis"` array:
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-01-16",
  "apis": [
    // Existing APIs here...
  ]
}
```

### Step 3: Add Your API Definition

Add a comma after the last API, then paste your new API:

```json
{
  "apis": [
    // ... existing APIs ...
    {
      "id": "your-api-id",
      "name": "Your API Name",
      "description": "What this API does",
      "baseUrl": "https://api.example.com",
      "requiresAuth": true,
      "authType": "bearer",
      "endpoints": [
        {
          "name": "endpoint_name",
          "path": "/endpoint/path",
          "method": "GET",
          "description": "What this endpoint does",
          "queryParams": []
        }
      ]
    }
  ]
}
```

### Step 4: Save the File

Save `apis.json` with your changes.

### Step 5: Restart the MCP Server

**No rebuild needed!** Just restart:

```bash
# Kill the running server (Ctrl+C if running in terminal)
# Or on Windows:
taskkill /IM node.exe /F

# Restart server
npm start
# Or however you normally start the server
```

### Step 6: Verify

You should see in the console:
```
📄 Loading API definitions from config/apis.json...
✅ Loaded 7 APIs from JSON config
   🔐 Your API Name (your-api-id) - 1 endpoints
```

---

## API Configuration Structure

### Minimal API (Public, No Auth)

```json
{
  "id": "publicapi",
  "name": "Public API",
  "description": "A simple public API",
  "baseUrl": "https://api.public.com",
  "requiresAuth": false,
  "endpoints": [
    {
      "name": "get_data",
      "path": "/data",
      "method": "GET",
      "description": "Get public data"
    }
  ]
}
```

### Full API (With Authentication)

```json
{
  "id": "fullapi",
  "name": "Full Featured API",
  "description": "API with all features",
  "baseUrl": "https://api.example.com/v1",
  "requiresAuth": true,
  "authType": "bearer",
  "authHeaderName": "Authorization",
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 5000
  },
  "commonHeaders": {
    "Accept": "application/json",
    "User-Agent": "AnyAPICall-MCP-Server"
  },
  "endpoints": [
    {
      "name": "search",
      "path": "/search",
      "method": "GET",
      "description": "Search for items",
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
          "description": "Max results",
          "default": 10
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "q": "test",
          "limit": 5
        }
      },
      "exampleResponse": {
        "results": [],
        "total": 0
      }
    }
  ]
}
```

---

## Real Examples

### Example 1: Adding Spotify API

```json
{
  "id": "spotify",
  "name": "Spotify",
  "description": "Search for music, artists, albums, and playlists on Spotify",
  "baseUrl": "https://api.spotify.com/v1",
  "requiresAuth": true,
  "authType": "bearer",
  "rateLimit": {
    "requestsPerMinute": 180,
    "requestsPerDay": 10000
  },
  "endpoints": [
    {
      "name": "search",
      "path": "/search",
      "method": "GET",
      "description": "Search for tracks, albums, artists, or playlists",
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
          "required": true,
          "description": "Type: track, album, artist, playlist",
          "enum": ["track", "album", "artist", "playlist"]
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results (1-50)",
          "default": 20
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "q": "Bohemian Rhapsody",
          "type": "track",
          "limit": 10
        }
      }
    },
    {
      "name": "get_track",
      "path": "/tracks/{id}",
      "method": "GET",
      "description": "Get detailed information about a track",
      "parameters": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "Spotify track ID"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "id": "3n3Ppam7vgaVa1iaRUc9Lp"
        }
      }
    }
  ]
}
```

### Example 2: Adding Stripe API

```json
{
  "id": "stripe",
  "name": "Stripe",
  "description": "Process payments and manage customers with Stripe",
  "baseUrl": "https://api.stripe.com/v1",
  "requiresAuth": true,
  "authType": "bearer",
  "rateLimit": {
    "requestsPerMinute": 100,
    "requestsPerDay": 100000
  },
  "endpoints": [
    {
      "name": "list_customers",
      "path": "/customers",
      "method": "GET",
      "description": "List all customers",
      "queryParams": [
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results (1-100)",
          "default": 10
        }
      ]
    },
    {
      "name": "get_customer",
      "path": "/customers/{id}",
      "method": "GET",
      "description": "Get a specific customer",
      "parameters": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "Customer ID"
        }
      ]
    },
    {
      "name": "create_payment_intent",
      "path": "/payment_intents",
      "method": "POST",
      "description": "Create a payment intent",
      "bodyParams": [
        {
          "name": "amount",
          "type": "number",
          "required": true,
          "description": "Amount in cents"
        },
        {
          "name": "currency",
          "type": "string",
          "required": true,
          "description": "Currency code (e.g., usd)"
        }
      ],
      "exampleRequest": {
        "body": {
          "amount": 2000,
          "currency": "usd"
        }
      }
    }
  ]
}
```

### Example 3: Adding Twitter/X API

```json
{
  "id": "twitter",
  "name": "Twitter/X",
  "description": "Search tweets, get user timelines, and post tweets",
  "baseUrl": "https://api.twitter.com/2",
  "requiresAuth": true,
  "authType": "bearer",
  "commonHeaders": {
    "User-Agent": "AnyAPICall-MCP-v2"
  },
  "rateLimit": {
    "requestsPerMinute": 15,
    "requestsPerDay": 500
  },
  "endpoints": [
    {
      "name": "search_recent_tweets",
      "path": "/tweets/search/recent",
      "method": "GET",
      "description": "Search tweets from the last 7 days",
      "queryParams": [
        {
          "name": "query",
          "type": "string",
          "required": true,
          "description": "Search query using Twitter search operators"
        },
        {
          "name": "max_results",
          "type": "number",
          "required": false,
          "description": "Max tweets to return (10-100)",
          "default": 10
        }
      ],
      "exampleRequest": {
        "queryParams": {
          "query": "AI agents",
          "max_results": 20
        }
      }
    },
    {
      "name": "get_user_by_username",
      "path": "/users/by/username/{username}",
      "method": "GET",
      "description": "Get user information by username",
      "parameters": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "Twitter username (without @)"
        }
      ],
      "exampleRequest": {
        "pathParams": {
          "username": "elonmusk"
        }
      }
    }
  ]
}
```

---

## Testing Your API

### Step 1: Test via List Tool

```typescript
// Check if your API is registered
const result = await mcpServer.executeTool('list_available_apis', {});
console.log(result.data.apis);
// Should show your new API
```

### Step 2: Test via Documentation Tool

```typescript
// Get documentation for your API
const docs = await mcpServer.executeTool('get_api_documentation', {
  apiId: 'your-api-id'
});
console.log(docs.data);
```

### Step 3: Test Actual API Call

```typescript
// Make a test call (with a valid API key)
const response = await mcpServer.executeTool('make_api_call', {
  accessToken: 'your_api_key_here',
  apiId: 'your-api-id',
  endpoint: '/test-endpoint',
  method: 'GET'
});
console.log(response);
```

### Step 4: Verify in Console

When server starts, you should see:
```
✅ Registered API: Your API Name (your-api-id)
```

---

## Common Issues

### Issue 1: JSON Syntax Error

**Error:**
```
❌ Error loading JSON config: Unexpected token...
```

**Solution:**
- Check for missing commas between objects
- Validate JSON at https://jsonlint.com/
- Make sure all strings use double quotes `"` not single `'`

### Issue 2: API Not Showing Up

**Checklist:**
- ✅ Did you save the file?
- ✅ Did you restart the server?
- ✅ Is the `id` unique?
- ✅ Is it inside the `"apis"` array?
- ✅ Check console for error messages

### Issue 3: Authentication Not Working

**Check:**
- `requiresAuth` set to `true`?
- `authType` specified? (bearer, apikey, basic)
- For API keys: `authHeaderName` specified?
- API key passed in `accessToken` parameter?

### Issue 4: Path Parameters Not Working

**Correct format:**
```json
{
  "path": "/users/{username}",
  "parameters": [
    {
      "name": "username",
      "type": "string",
      "required": true
    }
  ]
}
```

**Usage:**
```typescript
make_api_call({
  apiId: 'myapi',
  endpoint: '/users/{username}',
  pathParams: {
    username: 'john'
  }
})
```

---

## Advanced Configuration

### Multiple Authentication Methods

Some APIs support multiple auth methods:

```json
{
  "id": "flexible-api",
  "requiresAuth": false,
  "authType": "bearer",
  "note": "Auth optional but recommended for higher rate limits"
}
```

### Custom Headers

Add headers sent with every request:

```json
{
  "commonHeaders": {
    "Accept": "application/json",
    "User-Agent": "MyApp/1.0",
    "X-Custom-Header": "value"
  }
}
```

### Enum Values

Restrict parameters to specific values:

```json
{
  "queryParams": [
    {
      "name": "status",
      "type": "string",
      "required": false,
      "description": "Filter by status",
      "enum": ["active", "pending", "completed"]
    }
  ]
}
```

### Default Values

Set default parameter values:

```json
{
  "queryParams": [
    {
      "name": "per_page",
      "type": "number",
      "required": false,
      "description": "Results per page",
      "default": 20
    }
  ]
}
```

### POST/PUT Requests with Body

```json
{
  "name": "create_item",
  "path": "/items",
  "method": "POST",
  "description": "Create a new item",
  "bodyParams": [
    {
      "name": "title",
      "type": "string",
      "required": true,
      "description": "Item title"
    },
    {
      "name": "description",
      "type": "string",
      "required": false,
      "description": "Item description"
    }
  ],
  "exampleRequest": {
    "body": {
      "title": "My Item",
      "description": "A test item"
    }
  }
}
```

---

## Field Reference

### API Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier (lowercase, no spaces) |
| `name` | string | ✅ Yes | Display name |
| `description` | string | ✅ Yes | What the API does |
| `baseUrl` | string | ✅ Yes | Base URL (no trailing slash) |
| `requiresAuth` | boolean | ✅ Yes | Whether API requires authentication |
| `authType` | string | ⚠️ If auth | Auth type: bearer, apikey, basic, custom |
| `authHeaderName` | string | ⚠️ For apikey | Header name for API key |
| `rateLimit` | object | ❌ No | Rate limit info |
| `commonHeaders` | object | ❌ No | Headers sent with all requests |
| `endpoints` | array | ✅ Yes | Array of endpoint definitions |

### Endpoint Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Endpoint identifier (snake_case) |
| `path` | string | ✅ Yes | Endpoint path (can have {params}) |
| `method` | string | ✅ Yes | HTTP method: GET, POST, PUT, DELETE, PATCH |
| `description` | string | ✅ Yes | What the endpoint does |
| `parameters` | array | ❌ No | Path parameters |
| `queryParams` | array | ❌ No | Query string parameters |
| `bodyParams` | array | ❌ No | Request body parameters |
| `exampleRequest` | object | ❌ No | Example request for documentation |
| `exampleResponse` | any | ❌ No | Example response for documentation |

### Parameter Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Parameter name |
| `type` | string | ✅ Yes | Type: string, number, boolean, object, array |
| `required` | boolean | ✅ Yes | Whether parameter is required |
| `description` | string | ✅ Yes | What the parameter does |
| `default` | any | ❌ No | Default value if not provided |
| `enum` | array | ❌ No | Allowed values |

---

## Best Practices

### ✅ Do's

- **Use descriptive IDs**: `spotify` not `api1`
- **Write clear descriptions**: Help the AI agent understand
- **Include examples**: Makes it easier for agents to use
- **Document rate limits**: Helps avoid hitting limits
- **Test before adding**: Verify API works with a test tool
- **Keep formatting consistent**: Follow existing patterns

### ❌ Don'ts

- **Don't duplicate IDs**: Each API must have unique ID
- **Don't forget commas**: JSON is strict about syntax
- **Don't add trailing slashes**: BaseURL should be `https://api.com` not `https://api.com/`
- **Don't hardcode secrets**: Never put API keys in config
- **Don't skip descriptions**: AI agents need context

---

## Quick Reference

### Restart Server (Windows)
```bash
# Find and kill Node processes
taskkill /IM node.exe /F

# Restart
npm start
```

### Restart Server (Linux/Mac)
```bash
# Kill running server
pkill node

# Or if running in terminal, just Ctrl+C

# Restart
npm start
```

### Validate JSON
```bash
# Online: https://jsonlint.com/
# Or use VS Code - it validates automatically
```

### Test Configuration
```bash
# Build and test
npm run build
npm test
```

---

## Getting Help

### Troubleshooting Steps

1. **Check console output** - Look for error messages
2. **Validate JSON syntax** - Use jsonlint.com
3. **Compare with examples** - Look at existing APIs
4. **Test with curl** - Verify API works outside MCP
5. **Check API docs** - Confirm endpoints and auth

### Common Commands

```bash
# Rebuild (if needed)
npm run build

# Test
npm test

# Start server
npm start

# Check logs
# (Look at console output when server starts)
```

---

## Summary

**Adding a new API is easy:**

1. ✏️ Edit `config/apis.json`
2. ➕ Add your API definition
3. 💾 Save the file
4. 🔄 Restart server
5. ✅ Test it works

**No code changes. No rebuild. Just configuration!** 🚀

---

## Next Steps

- Try adding a simple public API first
- Test with the built-in tools
- Add more complex APIs as you get comfortable
- Share your API configurations with the team

Happy API adding! 🎉
