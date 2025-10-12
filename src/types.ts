/**
 * Type definitions for AnyAPICall MCP Server
 *
 * Following AgenticLedger Platform MCP Server Build Pattern
 */

import { z } from 'zod';

// ============================================================================
// MCP Interface Types (Required by Platform)
// ============================================================================

export interface MCPServerInstance {
  name: string;
  version: string;
  description: string;
  tools: MCPTool[];
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  executeTool(name: string, args: any): Promise<MCPResponse>;
  listTools(): Promise<MCPTool[]>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// ============================================================================
// API Definition Types
// ============================================================================

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface APIDefinition {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  requiresAuth: boolean;
  authType?: 'bearer' | 'apikey' | 'basic' | 'custom';
  authHeaderName?: string; // For custom auth headers (e.g., 'X-API-Key')
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
  commonHeaders?: Record<string, string>;
  endpoints: APIEndpoint[];
}

export interface APIEndpoint {
  name: string;
  path: string;
  method: HTTPMethod;
  description: string;
  parameters?: APIParameter[];
  queryParams?: APIParameter[];
  bodyParams?: APIParameter[];
  headers?: Record<string, string>;
  exampleRequest?: any;
  exampleResponse?: any;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
  enum?: string[];
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface APICallRequest {
  accessToken?: string; // Optional - only needed for authenticated APIs
  apiId: string; // Which API to call (e.g., 'coingecko', 'openweather')
  endpoint: string; // Endpoint path or name
  method?: HTTPMethod; // Default: GET
  pathParams?: Record<string, string>; // For URL path replacements
  queryParams?: Record<string, any>; // Query string parameters
  body?: any; // Request body for POST/PUT/PATCH
  headers?: Record<string, string>; // Custom headers
}

export interface APICallResponse {
  statusCode: number;
  headers: Record<string, string>;
  data: any;
  responseTime: number; // In milliseconds
  apiId: string;
  endpoint: string;
}

// ============================================================================
// API Registry Types
// ============================================================================

export interface APIRegistry {
  apis: Map<string, APIDefinition>;
  registerAPI(definition: APIDefinition): void;
  getAPI(id: string): APIDefinition | undefined;
  listAPIs(): APIDefinition[];
  searchAPIs(query: string): APIDefinition[];
}
