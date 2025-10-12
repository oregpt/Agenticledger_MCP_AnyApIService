/**
 * AnyAPICall MCP Server
 *
 * Universal Natural Language API MCP Server for AgenticLedger Platform
 *
 * Follows AgenticLedger Platform MCP Server Build Pattern v1.0.0
 * Authentication Pattern: Pattern 3 (API Key)
 */

import {
  MCPServerInstance,
  MCPTool,
  MCPResponse,
  APICallRequest
} from './types.js';
import {
  MakeAPICallSchema,
  ListAvailableAPIsSchema,
  GetAPIDocumentationSchema,
  MakeAPICallInput,
  ListAvailableAPIsInput,
  GetAPIDocumentationInput
} from './schemas.js';
import { apiRegistry } from './apis/registry.js';
import { apiClient } from './utils/apiClient.js';

/**
 * AnyAPICall MCP Server Implementation
 *
 * Provides tools for AI agents to make HTTP API calls to any registered API
 * with natural language intent mapping
 */
export class AnyAPICallMCPServer implements MCPServerInstance {
  name = 'any-api-call';
  version = '1.0.0';
  description = 'Universal Natural Language API MCP Server - Make any HTTP API call through AI-friendly tools. Supports 6+ core APIs including CoinGecko, OpenWeatherMap, GitHub, NewsAPI, and more. Expandable to any REST API.';

  tools: MCPTool[] = [
    {
      name: 'make_api_call',
      description: 'Make an HTTP API call to any registered API with full control over method, parameters, headers, and body. Supports GET, POST, PUT, PATCH, DELETE. Handles authentication automatically.',
      inputSchema: MakeAPICallSchema
    },
    {
      name: 'list_available_apis',
      description: 'List all available APIs in the registry with their authentication requirements, endpoints, and capabilities. Filter by category or authentication requirement.',
      inputSchema: ListAvailableAPIsSchema
    },
    {
      name: 'get_api_documentation',
      description: 'Get detailed documentation for a specific API including all available endpoints, parameters, examples, and authentication requirements.',
      inputSchema: GetAPIDocumentationSchema
    }
  ];

  async initialize(): Promise<void> {
    const summary = apiRegistry.getSummary();

    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║   ANY-API-CALL MCP SERVER INITIALIZED                  ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
    console.log(`✅ Server Version: ${this.version}`);
    console.log(`✅ Total APIs Registered: ${summary.total}`);
    console.log(`   ├─ Public APIs (no auth): ${summary.public}`);
    console.log(`   └─ Authenticated APIs: ${summary.authenticated}\n`);
    console.log(`📋 Registered APIs:`);

    summary.apis.forEach(api => {
      const authIcon = api.requiresAuth ? '🔐' : '🌐';
      console.log(`   ${authIcon} ${api.name} (${api.id}) - ${api.endpointCount} endpoints`);
    });

    console.log(`\n✅ ANY-API-CALL MCP Server ready to serve!\n`);
  }

  async shutdown(): Promise<void> {
    console.log(`\n🔄 ANY-API-CALL MCP Server shutting down...`);
    console.log(`✅ Shutdown complete\n`);
  }

  async executeTool(name: string, args: any): Promise<MCPResponse> {
    try {
      switch (name) {
        case 'make_api_call':
          return await this.handleMakeAPICall(args);

        case 'list_available_apis':
          return await this.handleListAvailableAPIs(args);

        case 'get_api_documentation':
          return await this.handleGetAPIDocumentation(args);

        default:
          return {
            success: false,
            error: `Unknown tool: ${name}. Available tools: ${this.tools.map(t => t.name).join(', ')}`
          };
      }
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        const issues = error.issues.map((issue: any) =>
          `${issue.path.join('.')}: ${issue.message}`
        ).join(', ');

        return {
          success: false,
          error: `Validation error: ${issues}`
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async listTools(): Promise<MCPTool[]> {
    return this.tools;
  }

  // ============================================================================
  // Tool Handlers
  // ============================================================================

  /**
   * Handle make_api_call tool
   *
   * Execute an HTTP API call to any registered API
   */
  private async handleMakeAPICall(args: any): Promise<MCPResponse> {
    // Validate input with Zod schema
    const validated: MakeAPICallInput = MakeAPICallSchema.parse(args);

    // Get API definition from registry
    const api = apiRegistry.getAPI(validated.apiId);

    if (!api) {
      return {
        success: false,
        error: `API '${validated.apiId}' not found in registry. Use 'list_available_apis' tool to see available APIs. ` +
          `Available: ${apiRegistry.listAPIs().map(a => a.id).join(', ')}`
      };
    }

    // Build API call request
    const request: APICallRequest = {
      accessToken: validated.accessToken,
      apiId: validated.apiId,
      endpoint: validated.endpoint,
      method: validated.method || 'GET',
      pathParams: validated.pathParams,
      queryParams: validated.queryParams,
      body: validated.body,
      headers: validated.headers
    };

    try {
      // Validate request against API definition
      apiClient.validateRequest(api, request);

      // Execute the API call
      const response = await apiClient.executeRequest(api, request);

      // Check for HTTP errors
      if (response.statusCode >= 400) {
        return {
          success: false,
          error: `API returned error status ${response.statusCode}. ` +
            `Response: ${JSON.stringify(response.data, null, 2)}`
        };
      }

      // Return successful response
      return {
        success: true,
        data: {
          statusCode: response.statusCode,
          data: response.data,
          responseTime: response.responseTime,
          api: {
            id: api.id,
            name: api.name
          },
          endpoint: response.endpoint,
          metadata: {
            timestamp: new Date().toISOString(),
            rateLimit: api.rateLimit
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to execute API call: ${error.message}`
      };
    }
  }

  /**
   * Handle list_available_apis tool
   *
   * List all registered APIs with optional filtering
   */
  private async handleListAvailableAPIs(args: any): Promise<MCPResponse> {
    // Validate input
    const validated: ListAvailableAPIsInput = ListAvailableAPIsSchema.parse(args);

    let apis = apiRegistry.listAPIs();

    // Filter by authentication requirement if specified
    if (validated.requiresAuth !== undefined) {
      apis = apis.filter(api => api.requiresAuth === validated.requiresAuth);
    }

    // Filter by category if specified (search in description)
    if (validated.category) {
      apis = apis.filter(api =>
        api.description.toLowerCase().includes(validated.category!.toLowerCase())
      );
    }

    // Format API list for response
    const apiList = apis.map(api => ({
      id: api.id,
      name: api.name,
      description: api.description,
      requiresAuth: api.requiresAuth,
      authType: api.authType,
      baseUrl: api.baseUrl,
      endpointCount: api.endpoints.length,
      endpoints: api.endpoints.map(e => ({
        name: e.name,
        method: e.method,
        path: e.path,
        description: e.description
      })),
      rateLimit: api.rateLimit
    }));

    return {
      success: true,
      data: {
        total: apiList.length,
        authenticated: apiList.filter(a => a.requiresAuth).length,
        public: apiList.filter(a => !a.requiresAuth).length,
        apis: apiList
      }
    };
  }

  /**
   * Handle get_api_documentation tool
   *
   * Get detailed documentation for a specific API
   */
  private async handleGetAPIDocumentation(args: any): Promise<MCPResponse> {
    // Validate input
    const validated: GetAPIDocumentationInput = GetAPIDocumentationSchema.parse(args);

    // Get API from registry
    const api = apiRegistry.getAPI(validated.apiId);

    if (!api) {
      return {
        success: false,
        error: `API '${validated.apiId}' not found. Available APIs: ${apiRegistry.listAPIs().map(a => a.id).join(', ')}`
      };
    }

    // Format comprehensive API documentation
    const documentation = {
      id: api.id,
      name: api.name,
      description: api.description,
      baseUrl: api.baseUrl,
      authentication: {
        required: api.requiresAuth,
        type: api.authType || 'none',
        headerName: api.authHeaderName,
        instructions: api.requiresAuth
          ? `Provide API key/token in 'accessToken' parameter. Auth type: ${api.authType}`
          : 'No authentication required - this is a public API'
      },
      rateLimit: api.rateLimit || { note: 'No rate limit information available' },
      commonHeaders: api.commonHeaders || {},
      endpoints: api.endpoints.map(endpoint => ({
        name: endpoint.name,
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description,
        parameters: {
          path: endpoint.parameters || [],
          query: endpoint.queryParams || [],
          body: endpoint.bodyParams || []
        },
        exampleRequest: endpoint.exampleRequest || null,
        exampleResponse: endpoint.exampleResponse || null,
        usage: {
          tool: 'make_api_call',
          args: {
            apiId: api.id,
            endpoint: endpoint.name,
            method: endpoint.method,
            ...(endpoint.exampleRequest || {})
          }
        }
      })),
      totalEndpoints: api.endpoints.length
    };

    return {
      success: true,
      data: documentation
    };
  }
}

// Export singleton server instance
export const server = new AnyAPICallMCPServer();
