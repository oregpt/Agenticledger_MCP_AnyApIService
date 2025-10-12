/**
 * Zod Schemas for AnyAPICall MCP Server
 *
 * Following AgenticLedger Platform MCP Server Build Pattern
 * All schemas use .describe() for AI agent understanding
 */

import { z } from 'zod';

// ============================================================================
// Tool Input Schemas (Required by Platform)
// ============================================================================

/**
 * Schema for making any API call
 * This is the primary tool for executing API requests
 */
export const MakeAPICallSchema = z.object({
  accessToken: z.string().optional().describe(
    'API access token or key (optional - only required for authenticated APIs). ' +
    'Format depends on API: Bearer token, API key, or custom auth string'
  ),
  apiId: z.string().describe(
    'API identifier from the registry (e.g., "coingecko", "openweather", "github"). ' +
    'Use list_available_apis tool to see all supported APIs'
  ),
  endpoint: z.string().describe(
    'API endpoint path or endpoint name (e.g., "/coins/markets" or "get_coin_price"). ' +
    'Can be full path or named endpoint from API definition'
  ),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
    .default('GET')
    .describe('HTTP method for the request. Defaults to GET if not specified'),
  pathParams: z.record(z.string()).optional().describe(
    'Path parameters for URL template replacement. ' +
    'Example: { "id": "bitcoin" } replaces {id} in /coins/{id}'
  ),
  queryParams: z.record(z.any()).optional().describe(
    'Query string parameters as key-value pairs. ' +
    'Example: { "vs_currency": "usd", "per_page": 10 }'
  ),
  body: z.any().optional().describe(
    'Request body for POST/PUT/PATCH requests. ' +
    'Can be object, array, or string depending on API requirements'
  ),
  headers: z.record(z.string()).optional().describe(
    'Custom HTTP headers as key-value pairs. ' +
    'Example: { "Content-Type": "application/json", "X-Custom": "value" }'
  )
});

/**
 * Schema for listing available APIs
 */
export const ListAvailableAPIsSchema = z.object({
  accessToken: z.string().optional().describe('Not used for this tool, but kept for consistency'),
  category: z.string().optional().describe(
    'Filter APIs by category (e.g., "crypto", "weather", "developer", "news")'
  ),
  requiresAuth: z.boolean().optional().describe(
    'Filter APIs by authentication requirement. true = only authenticated APIs, false = only public APIs'
  )
});

/**
 * Schema for getting detailed API documentation
 */
export const GetAPIDocumentationSchema = z.object({
  accessToken: z.string().optional().describe('Not used for this tool, but kept for consistency'),
  apiId: z.string().describe(
    'API identifier to get documentation for (e.g., "coingecko", "openweather")'
  )
});

// ============================================================================
// Validation Helpers
// ============================================================================

export type MakeAPICallInput = z.infer<typeof MakeAPICallSchema>;
export type ListAvailableAPIsInput = z.infer<typeof ListAvailableAPIsSchema>;
export type GetAPIDocumentationInput = z.infer<typeof GetAPIDocumentationSchema>;
