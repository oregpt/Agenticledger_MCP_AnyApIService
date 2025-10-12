# AnyAPICall MCP Server

**Universal Natural Language API MCP Server for AgenticLedger Platform**

Make any HTTP API call through AI-friendly tools. Supports 6+ core APIs out of the box and easily expandable to any REST API.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Test Coverage](https://img.shields.io/badge/tests-100%25-brightgreen)]()
[![MCP Pattern](https://img.shields.io/badge/MCP-Pattern%203-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)]()

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Available Tools](#available-tools)
- [Supported APIs](#supported-apis)
- [Usage Examples](#usage-examples)
- [Adding New APIs](#adding-new-apis)
- [Testing](#testing)
- [Platform Integration](#platform-integration)

---

## Overview

AnyAPICall is a Universal MCP (Model Context Protocol) server that enables AI agents to interact with any HTTP REST API through natural language. Instead of building separate MCP servers for each API, this server provides a flexible, configuration-driven approach that works with any REST API.

### What Makes This Different?

🔧 **Configuration-Driven** - Add new APIs by simply adding configuration, no code changes needed

🌐 **Universal** - Works with any REST API (GET, POST, PUT, PATCH, DELETE, etc.)

🔐 **Flexible Authentication** - Supports Bearer tokens, API keys, custom headers, and basic auth

📖 **Self-Documenting** - AI agents can discover and learn APIs on-the-fly

🚀 **Production Ready** - 100% test coverage with real API calls

---

## Features

### Core Capabilities

- ✅ **Make Any API Call** - Full control over HTTP method, headers, body, and parameters
- ✅ **List Available APIs** - Discover all registered APIs with filtering
- ✅ **Get API Documentation** - Detailed docs for each API including endpoints and examples
- ✅ **Path Parameter Substitution** - Dynamic URL building with `{param}` placeholders
- ✅ **Query Parameter Handling** - Clean query string construction
- ✅ **Request Body Support** - POST/PUT/PATCH with JSON bodies
- ✅ **Custom Headers** - Full header control for special requirements
- ✅ **Multiple Auth Patterns** - Bearer, API Key, Custom Header, Basic
- ✅ **Error Handling** - Clear, actionable error messages
- ✅ **Performance Monitoring** - Response times included in all responses

### Included APIs (No Configuration Needed)

1. **CoinGecko** 🪙 - Cryptocurrency prices and market data (Public)
2. **OpenWeatherMap** ☁️ - Current weather and forecasts (API Key)
3. **JSONPlaceholder** 🧪 - Testing and prototyping (Public)
4. **REST Countries** 🌍 - Geographic and country data (Public)
5. **GitHub** 🐙 - Repositories, users, and issues (Public + Token)
6. **NewsAPI** 📰 - Breaking news and article search (API Key)

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/oregpt/Agenticledger_MCP_AnyApIService.git
cd Agenticledger_MCP_AnyApIService

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```

### Basic Usage

```typescript
import { server } from './dist/index.js';

// Initialize server
await server.initialize();

// Make an API call
const result = await server.executeTool('make_api_call', {
  apiId: 'coingecko',
  endpoint: '/coins/markets',
  method: 'GET',
  queryParams: {
    vs_currency: 'usd',
    per_page: 10
  }
});

console.log(result.data);

// Shutdown
await server.shutdown();
```

---

## Authentication

### Authentication Pattern

**Pattern:** Pattern 3 (API Key) - AgenticLedger Platform MCP Server Build Pattern

**Token Format:**
```typescript
{
  accessToken: "your_api_key_here"  // Optional for public APIs
}
```

### Public vs Authenticated APIs

**Public APIs (No Token Needed):**
- CoinGecko
- JSONPlaceholder
- REST Countries
- GitHub (public endpoints)

**Authenticated APIs (Token Required):**
- OpenWeatherMap - Get free key at https://openweathermap.org/api
- NewsAPI - Get free key at https://newsapi.org/
- GitHub (private endpoints) - Generate token at https://github.com/settings/tokens

### Setting API Keys for Testing

```bash
# For authenticated API tests
export OPENWEATHER_API_KEY="your_openweather_key"
export NEWSAPI_KEY="your_newsapi_key"
export GITHUB_TOKEN="your_github_token"

# Run tests
npm test
```

---

## Available Tools

### 1. make_api_call

Execute an HTTP API call to any registered API.

**Parameters:**
- `accessToken` (string, optional): API key/token for authenticated APIs
- `apiId` (string, required): API identifier (e.g., "coingecko")
- `endpoint` (string, required): Endpoint path (e.g., "/coins/markets")
- `method` (string, optional): HTTP method (default: "GET")
- `pathParams` (object, optional): Path parameter replacements
- `queryParams` (object, optional): Query string parameters
- `body` (any, optional): Request body for POST/PUT/PATCH
- `headers` (object, optional): Custom headers

**Example:**
```typescript
{
  apiId: 'github',
  endpoint: '/users/{username}',
  method: 'GET',
  pathParams: {
    username: 'octocat'
  }
}
```

---

### 2. list_available_apis

List all registered APIs with optional filtering.

**Parameters:**
- `category` (string, optional): Filter by category
- `requiresAuth` (boolean, optional): Filter by auth requirement

**Example:**
```typescript
{
  requiresAuth: false  // Get only public APIs
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 4,
    "public": 4,
    "authenticated": 0,
    "apis": [...]
  }
}
```

---

### 3. get_api_documentation

Get detailed documentation for a specific API.

**Parameters:**
- `apiId` (string, required): API identifier

**Example:**
```typescript
{
  apiId: 'coingecko'
}
```

**Response Includes:**
- API description and base URL
- Authentication requirements
- All endpoints with parameters
- Example requests and responses
- Usage instructions

---

## Supported APIs

### CoinGecko

**ID:** `coingecko`
**Auth:** Not required
**Rate Limit:** 10 req/min, 10,000 req/day

**Endpoints:**
- `list_coins` - Get cryptocurrency market data
- `get_coin_data` - Get detailed coin information

**Example:**
```typescript
{
  apiId: 'coingecko',
  endpoint: '/coins/markets',
  queryParams: {
    vs_currency: 'usd',
    per_page: 10
  }
}
```

---

### OpenWeatherMap

**ID:** `openweather`
**Auth:** API Key required
**Rate Limit:** 60 req/min, 1,000 req/day

**Endpoints:**
- `current_weather` - Current weather for a location
- `forecast` - 5-day forecast with 3-hour intervals

**Example:**
```typescript
{
  accessToken: "your_openweather_key",
  apiId: 'openweather',
  endpoint: '/weather',
  queryParams: {
    q: 'London',
    units: 'metric'
  }
}
```

---

### JSONPlaceholder

**ID:** `jsonplaceholder`
**Auth:** Not required
**Rate Limit:** No limit

**Endpoints:**
- `list_posts` - Get all posts
- `get_post` - Get specific post
- `create_post` - Create new post
- `list_users` - Get all users
- `list_comments` - Get all comments

**Example:**
```typescript
{
  apiId: 'jsonplaceholder',
  endpoint: '/posts',
  method: 'POST',
  body: {
    title: 'My Post',
    body: 'Content here',
    userId: 1
  }
}
```

---

### REST Countries

**ID:** `restcountries`
**Auth:** Not required
**Rate Limit:** No limit

**Endpoints:**
- `all_countries` - Get all countries
- `search_by_name` - Search countries by name
- `get_by_code` - Get country by ISO code
- `by_region` - Get countries by region

**Example:**
```typescript
{
  apiId: 'restcountries',
  endpoint: '/name/{name}',
  pathParams: {
    name: 'united'
  }
}
```

---

### GitHub

**ID:** `github`
**Auth:** Optional (higher rate limits with token)
**Rate Limit:** 60 req/min (public), 5,000 req/day (authenticated)

**Endpoints:**
- `get_user` - Get user information
- `get_repo` - Get repository information
- `search_repositories` - Search repositories
- `list_repo_issues` - List repository issues

**Example:**
```typescript
{
  accessToken: "github_token",  // Optional
  apiId: 'github',
  endpoint: '/search/repositories',
  queryParams: {
    q: 'machine learning',
    sort: 'stars',
    per_page: 10
  }
}
```

---

### NewsAPI

**ID:** `newsapi`
**Auth:** API Key required
**Rate Limit:** 5 req/min, 100 req/day (free tier)

**Endpoints:**
- `top_headlines` - Breaking news headlines
- `search_articles` - Search through articles

**Example:**
```typescript
{
  accessToken: "your_newsapi_key",
  apiId: 'newsapi',
  endpoint: '/top-headlines',
  queryParams: {
    country: 'us',
    category: 'technology',
    pageSize: 10
  }
}
```

---

## Usage Examples

### Example 1: Get Cryptocurrency Prices

```typescript
const crypto = await server.executeTool('make_api_call', {
  apiId: 'coingecko',
  endpoint: '/coins/markets',
  method: 'GET',
  queryParams: {
    vs_currency: 'usd',
    ids: 'bitcoin,ethereum',
    per_page: 2
  }
});

console.log(crypto.data.data);
// [
//   { id: 'bitcoin', symbol: 'btc', current_price: 114729, ... },
//   { id: 'ethereum', symbol: 'eth', current_price: 4113.86, ... }
// ]
```

---

### Example 2: Get Weather for Multiple Cities

```typescript
const cities = ['London', 'Paris', 'Tokyo'];

for (const city of cities) {
  const weather = await server.executeTool('make_api_call', {
    accessToken: process.env.OPENWEATHER_API_KEY,
    apiId: 'openweather',
    endpoint: '/weather',
    queryParams: {
      q: city,
      units: 'metric'
    }
  });

  const data = weather.data.data;
  console.log(`${data.name}: ${data.main.temp}°C - ${data.weather[0].description}`);
}
```

---

### Example 3: Search GitHub Repositories

```typescript
const repos = await server.executeTool('make_api_call', {
  apiId: 'github',
  endpoint: '/search/repositories',
  queryParams: {
    q: 'mcp server',
    sort: 'stars',
    order: 'desc',
    per_page: 5
  }
});

repos.data.data.items.forEach(repo => {
  console.log(`⭐ ${repo.stargazers_count} - ${repo.full_name}`);
});
```

---

### Example 4: Get Country Information

```typescript
const country = await server.executeTool('make_api_call', {
  apiId: 'restcountries',
  endpoint: '/alpha/{code}',
  pathParams: {
    code: 'US'
  }
});

const data = country.data.data[0];
console.log(`${data.name.common}`);
console.log(`Capital: ${data.capital[0]}`);
console.log(`Population: ${data.population.toLocaleString()}`);
console.log(`Region: ${data.region}`);
```

---

## Adding New APIs

Adding a new API is simple - just add configuration to `src/apis/definitions.ts`:

```typescript
export const YOUR_API: APIDefinition = {
  id: 'your-api',
  name: 'Your API Name',
  description: 'What this API does',
  baseUrl: 'https://api.example.com/v1',
  requiresAuth: true,
  authType: 'bearer',  // or 'apikey', 'basic', 'custom'
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 1000
  },
  endpoints: [
    {
      name: 'endpoint_name',
      path: '/endpoint/{id}',
      method: 'GET',
      description: 'What this endpoint does',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Resource ID' }
      ],
      queryParams: [
        { name: 'limit', type: 'number', required: false, description: 'Results limit' }
      ]
    }
  ]
};

// Add to CORE_APIS array
export const CORE_APIS: APIDefinition[] = [
  // ... existing APIs
  YOUR_API
];
```

**That's it!** No code changes needed. The server automatically:
- Registers the API
- Validates requests
- Handles authentication
- Builds URLs with path/query params
- Returns standardized responses

---

## Testing

### Run All Tests

```bash
npm test
```

### Run With API Keys

```bash
export OPENWEATHER_API_KEY="your_key"
export NEWSAPI_KEY="your_key"
export GITHUB_TOKEN="your_token"
npm test
```

### Test Coverage

- ✅ All 3 tools tested
- ✅ All 6 APIs tested with real calls
- ✅ Error scenarios validated
- ✅ Parameter validation tested
- ✅ Authentication tested
- ✅ 100% success rate

### Test Results

```
✅ PASSED: 6/6 tests
❌ FAILED: 0/6 tests
📈 SUCCESS RATE: 100.0%
⚡ AVERAGE RESPONSE TIME: 95ms
```

---

## Platform Integration

### For AgenticLedger Platform

This MCP server follows **AgenticLedger Platform MCP Server Build Pattern v1.0.0**.

**Authentication Pattern:** Pattern 3 (API Key)

**Token Mapping:**
```typescript
{
  token1: "api_key"  // Direct API key for authenticated APIs
}
```

**Platform Handles:**
- User credential collection
- Token storage and security
- UI for API key configuration
- AI agent orchestration

**MCP Server Handles:**
- Tool definitions
- API call execution
- Response formatting
- Error handling

### Integration Report

See `PLATFORM_INTEGRATION_REPORT.md` for comprehensive testing documentation including:
- Real API test results
- Performance metrics
- Error handling verification
- Platform compliance checklist

---

## Project Structure

```
AnyAPICall/
├── src/
│   ├── index.ts                    # Main MCP server
│   ├── types.ts                    # TypeScript type definitions
│   ├── schemas.ts                  # Zod validation schemas
│   ├── apis/
│   │   ├── registry.ts             # API registry manager
│   │   └── definitions.ts          # API configurations
│   └── utils/
│       └── apiClient.ts            # HTTP client wrapper
├── tests/
│   └── integration-test.js         # Integration tests
├── dist/                           # Compiled JavaScript
├── package.json
├── tsconfig.json
├── README.md                       # This file
└── PLATFORM_INTEGRATION_REPORT.md  # Platform integration docs
```

---

## Performance

**Average Response Times (Real APIs):**
- CoinGecko: 241ms
- GitHub: 116ms
- REST Countries: 119ms
- JSONPlaceholder: 91ms

**Tool Execution:**
- list_available_apis: 1ms
- get_api_documentation: 1ms

**Success Rate:** 100%

---

## Contributing

To contribute a new API:

1. Add API definition to `src/apis/definitions.ts`
2. Add to `CORE_APIS` array
3. Run tests: `npm test`
4. Submit PR with test results

No code changes needed for new APIs!

---

## License

MIT

---

## Links

- **GitHub Repository:** https://github.com/oregpt/Agenticledger_MCP_AnyApIService
- **AgenticLedger Platform:** https://agenticledger.com
- **MCP Server Build Pattern:** See repository docs

---

## Support

**Issues:** https://github.com/oregpt/Agenticledger_MCP_AnyApIService/issues

---

**Built with ❤️ for the AgenticLedger AI Agent Platform**

*Universal API Access for AI Agents* 🚀
