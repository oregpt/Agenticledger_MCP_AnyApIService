/**
 * Core Trusted API Definitions
 *
 * This file contains the initial set of trusted APIs that the MCP server supports.
 * Each API definition includes endpoints, authentication requirements, and usage examples.
 */

import { APIDefinition } from '../types.js';

// ============================================================================
// Cryptocurrency & Finance APIs
// ============================================================================

export const COINGECKO_API: APIDefinition = {
  id: 'coingecko',
  name: 'CoinGecko',
  description: 'Cryptocurrency prices, market data, and charts. Free tier available with no API key required.',
  baseUrl: 'https://api.coingecko.com/api/v3',
  requiresAuth: false,
  rateLimit: {
    requestsPerMinute: 10,
    requestsPerDay: 10000
  },
  endpoints: [
    {
      name: 'list_coins',
      path: '/coins/markets',
      method: 'GET',
      description: 'Get list of cryptocurrency prices and market data',
      queryParams: [
        { name: 'vs_currency', type: 'string', required: true, description: 'Target currency (usd, eur, etc.)', default: 'usd' },
        { name: 'ids', type: 'string', required: false, description: 'Comma-separated coin IDs' },
        { name: 'per_page', type: 'number', required: false, description: 'Results per page (max 250)', default: 100 },
        { name: 'page', type: 'number', required: false, description: 'Page number', default: 1 }
      ],
      exampleRequest: {
        queryParams: { vs_currency: 'usd', per_page: 10 }
      },
      exampleResponse: [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 43250,
          market_cap: 846000000000,
          price_change_24h: 1234.56
        }
      ]
    },
    {
      name: 'get_coin_data',
      path: '/coins/{id}',
      method: 'GET',
      description: 'Get detailed data for a specific cryptocurrency',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Coin ID (e.g., bitcoin, ethereum)' }
      ],
      queryParams: [
        { name: 'localization', type: 'boolean', required: false, description: 'Include localized languages', default: false },
        { name: 'tickers', type: 'boolean', required: false, description: 'Include ticker data', default: false },
        { name: 'market_data', type: 'boolean', required: false, description: 'Include market data', default: true }
      ],
      exampleRequest: {
        pathParams: { id: 'bitcoin' },
        queryParams: { market_data: true }
      }
    }
  ]
};

// ============================================================================
// Weather APIs
// ============================================================================

export const OPENWEATHER_API: APIDefinition = {
  id: 'openweather',
  name: 'OpenWeatherMap',
  description: 'Current weather, forecasts, and historical weather data worldwide. Requires free API key.',
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  requiresAuth: true,
  authType: 'apikey',
  authHeaderName: 'appid', // OpenWeather uses 'appid' query parameter
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 1000
  },
  endpoints: [
    {
      name: 'current_weather',
      path: '/weather',
      method: 'GET',
      description: 'Get current weather data for a location',
      queryParams: [
        { name: 'q', type: 'string', required: false, description: 'City name (e.g., "London" or "London,UK")' },
        { name: 'lat', type: 'number', required: false, description: 'Latitude' },
        { name: 'lon', type: 'number', required: false, description: 'Longitude' },
        { name: 'units', type: 'string', required: false, description: 'Units: standard, metric, imperial', default: 'metric' }
      ],
      exampleRequest: {
        queryParams: { q: 'London', units: 'metric' }
      },
      exampleResponse: {
        name: 'London',
        main: { temp: 15.5, feels_like: 14.2, humidity: 72 },
        weather: [{ main: 'Clouds', description: 'overcast clouds' }]
      }
    },
    {
      name: 'forecast',
      path: '/forecast',
      method: 'GET',
      description: 'Get 5-day weather forecast with 3-hour intervals',
      queryParams: [
        { name: 'q', type: 'string', required: false, description: 'City name' },
        { name: 'lat', type: 'number', required: false, description: 'Latitude' },
        { name: 'lon', type: 'number', required: false, description: 'Longitude' },
        { name: 'units', type: 'string', required: false, description: 'Units: standard, metric, imperial', default: 'metric' }
      ]
    }
  ]
};

// ============================================================================
// Developer/Testing APIs
// ============================================================================

export const JSONPLACEHOLDER_API: APIDefinition = {
  id: 'jsonplaceholder',
  name: 'JSONPlaceholder',
  description: 'Free fake REST API for testing and prototyping. No authentication required.',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  requiresAuth: false,
  endpoints: [
    {
      name: 'list_posts',
      path: '/posts',
      method: 'GET',
      description: 'Get all posts (100 items)',
      queryParams: [
        { name: '_limit', type: 'number', required: false, description: 'Limit number of results' },
        { name: 'userId', type: 'number', required: false, description: 'Filter by user ID' }
      ],
      exampleResponse: [
        { id: 1, userId: 1, title: 'Post title', body: 'Post content' }
      ]
    },
    {
      name: 'get_post',
      path: '/posts/{id}',
      method: 'GET',
      description: 'Get a specific post by ID',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Post ID (1-100)' }
      ]
    },
    {
      name: 'create_post',
      path: '/posts',
      method: 'POST',
      description: 'Create a new post (returns fake ID)',
      bodyParams: [
        { name: 'title', type: 'string', required: true, description: 'Post title' },
        { name: 'body', type: 'string', required: true, description: 'Post content' },
        { name: 'userId', type: 'number', required: true, description: 'User ID' }
      ],
      exampleRequest: {
        body: { title: 'Test', body: 'Content', userId: 1 }
      }
    },
    {
      name: 'list_users',
      path: '/users',
      method: 'GET',
      description: 'Get all users (10 items)'
    },
    {
      name: 'list_comments',
      path: '/comments',
      method: 'GET',
      description: 'Get all comments (500 items)',
      queryParams: [
        { name: 'postId', type: 'number', required: false, description: 'Filter by post ID' }
      ]
    }
  ]
};

// ============================================================================
// Geographic Data APIs
// ============================================================================

export const RESTCOUNTRIES_API: APIDefinition = {
  id: 'restcountries',
  name: 'REST Countries',
  description: 'Get information about countries - population, languages, currencies, flags, and more. No authentication required.',
  baseUrl: 'https://restcountries.com/v3.1',
  requiresAuth: false,
  endpoints: [
    {
      name: 'all_countries',
      path: '/all',
      method: 'GET',
      description: 'Get all countries',
      queryParams: [
        { name: 'fields', type: 'string', required: false, description: 'Comma-separated list of fields to return' }
      ],
      exampleRequest: {
        queryParams: { fields: 'name,capital,population,region' }
      }
    },
    {
      name: 'search_by_name',
      path: '/name/{name}',
      method: 'GET',
      description: 'Search countries by name',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Country name (full or partial)' }
      ],
      exampleRequest: {
        pathParams: { name: 'united' }
      }
    },
    {
      name: 'get_by_code',
      path: '/alpha/{code}',
      method: 'GET',
      description: 'Get country by ISO code',
      parameters: [
        { name: 'code', type: 'string', required: true, description: '2 or 3 letter ISO code (e.g., US, USA)' }
      ]
    },
    {
      name: 'by_region',
      path: '/region/{region}',
      method: 'GET',
      description: 'Get countries by region',
      parameters: [
        { name: 'region', type: 'string', required: true, description: 'Region name (Africa, Americas, Asia, Europe, Oceania)', enum: ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] }
      ]
    }
  ]
};

// ============================================================================
// GitHub API
// ============================================================================

export const GITHUB_API: APIDefinition = {
  id: 'github',
  name: 'GitHub',
  description: 'Access GitHub repositories, issues, pull requests, and user data. Requires personal access token for authenticated requests.',
  baseUrl: 'https://api.github.com',
  requiresAuth: false, // Some endpoints work without auth, but with lower rate limits
  authType: 'bearer',
  rateLimit: {
    requestsPerMinute: 60, // Without auth
    requestsPerDay: 5000 // With auth
  },
  commonHeaders: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'AnyAPICall-MCP-Server'
  },
  endpoints: [
    {
      name: 'get_user',
      path: '/users/{username}',
      method: 'GET',
      description: 'Get public information about a GitHub user',
      parameters: [
        { name: 'username', type: 'string', required: true, description: 'GitHub username' }
      ],
      exampleRequest: {
        pathParams: { username: 'octocat' }
      }
    },
    {
      name: 'get_repo',
      path: '/repos/{owner}/{repo}',
      method: 'GET',
      description: 'Get repository information',
      parameters: [
        { name: 'owner', type: 'string', required: true, description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, description: 'Repository name' }
      ]
    },
    {
      name: 'search_repositories',
      path: '/search/repositories',
      method: 'GET',
      description: 'Search for repositories',
      queryParams: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'sort', type: 'string', required: false, description: 'Sort by: stars, forks, updated', enum: ['stars', 'forks', 'updated'] },
        { name: 'per_page', type: 'number', required: false, description: 'Results per page (max 100)', default: 30 }
      ]
    },
    {
      name: 'list_repo_issues',
      path: '/repos/{owner}/{repo}/issues',
      method: 'GET',
      description: 'List repository issues',
      parameters: [
        { name: 'owner', type: 'string', required: true, description: 'Repository owner' },
        { name: 'repo', type: 'string', required: true, description: 'Repository name' }
      ],
      queryParams: [
        { name: 'state', type: 'string', required: false, description: 'Issue state: open, closed, all', default: 'open' },
        { name: 'per_page', type: 'number', required: false, description: 'Results per page', default: 30 }
      ]
    }
  ]
};

// ============================================================================
// News APIs
// ============================================================================

export const NEWSAPI: APIDefinition = {
  id: 'newsapi',
  name: 'NewsAPI',
  description: 'Access breaking news headlines and search articles from over 80,000 news sources. Requires API key.',
  baseUrl: 'https://newsapi.org/v2',
  requiresAuth: true,
  authType: 'apikey',
  authHeaderName: 'X-Api-Key',
  rateLimit: {
    requestsPerMinute: 5,
    requestsPerDay: 100 // Free tier
  },
  endpoints: [
    {
      name: 'top_headlines',
      path: '/top-headlines',
      method: 'GET',
      description: 'Get breaking news headlines',
      queryParams: [
        { name: 'country', type: 'string', required: false, description: '2-letter ISO country code (e.g., us, gb)' },
        { name: 'category', type: 'string', required: false, description: 'Category: business, entertainment, general, health, science, sports, technology', enum: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'] },
        { name: 'q', type: 'string', required: false, description: 'Search query' },
        { name: 'pageSize', type: 'number', required: false, description: 'Number of results (max 100)', default: 20 }
      ],
      exampleRequest: {
        queryParams: { country: 'us', category: 'technology', pageSize: 10 }
      }
    },
    {
      name: 'search_articles',
      path: '/everything',
      method: 'GET',
      description: 'Search through millions of articles',
      queryParams: [
        { name: 'q', type: 'string', required: true, description: 'Search query (required)' },
        { name: 'from', type: 'string', required: false, description: 'Start date (ISO 8601 format)' },
        { name: 'to', type: 'string', required: false, description: 'End date (ISO 8601 format)' },
        { name: 'language', type: 'string', required: false, description: 'Language code (e.g., en, es)' },
        { name: 'sortBy', type: 'string', required: false, description: 'Sort by: relevancy, popularity, publishedAt', default: 'publishedAt' },
        { name: 'pageSize', type: 'number', required: false, description: 'Number of results (max 100)', default: 20 }
      ]
    }
  ]
};

// ============================================================================
// Export All API Definitions
// ============================================================================

export const CORE_APIS: APIDefinition[] = [
  COINGECKO_API,
  OPENWEATHER_API,
  JSONPLACEHOLDER_API,
  RESTCOUNTRIES_API,
  GITHUB_API,
  NEWSAPI
];
