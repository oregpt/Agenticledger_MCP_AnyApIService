/**
 * API Client Utility
 *
 * Handles HTTP requests to external APIs with authentication,
 * header management, and response formatting
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIDefinition, APICallRequest, APICallResponse, HTTPMethod } from '../types.js';

export class APIClient {
  /**
   * Execute an API call based on the request configuration
   */
  async executeRequest(
    api: APIDefinition,
    request: APICallRequest
  ): Promise<APICallResponse> {
    const startTime = Date.now();

    try {
      // Build the full URL
      const url = this.buildURL(api, request);

      // Build headers
      const headers = this.buildHeaders(api, request);

      // Build axios config
      const axiosConfig: AxiosRequestConfig = {
        method: request.method || 'GET',
        url,
        headers,
        validateStatus: () => true // Don't throw on non-2xx status codes
      };

      // Add body for POST/PUT/PATCH requests
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method || 'GET')) {
        axiosConfig.data = request.body;
      }

      // Make the HTTP request
      const response: AxiosResponse = await axios(axiosConfig);

      const responseTime = Date.now() - startTime;

      // Return standardized response
      return {
        statusCode: response.status,
        headers: response.headers as Record<string, string>,
        data: response.data,
        responseTime,
        apiId: api.id,
        endpoint: request.endpoint
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      // Handle network or other errors
      throw new Error(
        `API request failed: ${error.message || 'Unknown error'}. ` +
        `Response time: ${responseTime}ms`
      );
    }
  }

  /**
   * Build the full URL with path parameters and query parameters
   */
  private buildURL(api: APIDefinition, request: APICallRequest): string {
    let url = api.baseUrl;

    // Add endpoint path
    let path = request.endpoint;

    // Replace path parameters (e.g., {id} -> actual value)
    if (request.pathParams) {
      Object.entries(request.pathParams).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, encodeURIComponent(value));
      });
    }

    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    url += path;

    // Add query parameters
    if (request.queryParams && Object.keys(request.queryParams).length > 0) {
      const queryParams = new URLSearchParams();

      Object.entries(request.queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      // Special handling for OpenWeather's appid parameter
      if (api.id === 'openweather' && request.accessToken) {
        queryParams.append('appid', request.accessToken);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += '?' + queryString;
      }
    } else if (api.id === 'openweather' && request.accessToken) {
      // OpenWeather requires appid as query parameter
      url += '?appid=' + request.accessToken;
    }

    return url;
  }

  /**
   * Build HTTP headers including authentication
   */
  private buildHeaders(
    api: APIDefinition,
    request: APICallRequest
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AnyAPICall-MCP-Server/1.0.0',
      ...api.commonHeaders,
      ...request.headers
    };

    // Add authentication headers if required
    if (api.requiresAuth && request.accessToken) {
      switch (api.authType) {
        case 'bearer':
          headers['Authorization'] = `Bearer ${request.accessToken}`;
          break;

        case 'apikey':
          if (api.authHeaderName) {
            // Custom header name (e.g., X-Api-Key for NewsAPI)
            if (api.id !== 'openweather') { // OpenWeather uses query param, not header
              headers[api.authHeaderName] = request.accessToken;
            }
          } else {
            headers['X-API-Key'] = request.accessToken;
          }
          break;

        case 'basic':
          // Expects accessToken in format "username:password"
          const encoded = Buffer.from(request.accessToken).toString('base64');
          headers['Authorization'] = `Basic ${encoded}`;
          break;

        case 'custom':
          // Custom authentication - handled by request.headers
          break;
      }
    }

    return headers;
  }

  /**
   * Find an endpoint definition by name or path
   */
  findEndpoint(api: APIDefinition, endpointNameOrPath: string): any {
    // Try to find by name first
    let endpoint = api.endpoints.find(e => e.name === endpointNameOrPath);

    // If not found, try by path
    if (!endpoint) {
      endpoint = api.endpoints.find(e => e.path === endpointNameOrPath);
    }

    return endpoint;
  }

  /**
   * Validate that the request has all required parameters
   */
  validateRequest(api: APIDefinition, request: APICallRequest): void {
    // Check if API requires authentication
    if (api.requiresAuth && !request.accessToken) {
      throw new Error(
        `API '${api.name}' requires authentication. ` +
        `Please provide an accessToken. ` +
        `Auth type: ${api.authType}`
      );
    }

    // Find the endpoint definition
    const endpoint = this.findEndpoint(api, request.endpoint);

    if (!endpoint) {
      throw new Error(
        `Endpoint '${request.endpoint}' not found in API '${api.name}'. ` +
        `Available endpoints: ${api.endpoints.map(e => e.name).join(', ')}`
      );
    }

    // Check required path parameters
    if (endpoint.parameters) {
      const requiredParams = endpoint.parameters.filter((p: any) => p.required);

      requiredParams.forEach((param: any) => {
        if (!request.pathParams || !(param.name in request.pathParams)) {
          throw new Error(
            `Required path parameter '${param.name}' is missing. ` +
            `Description: ${param.description}`
          );
        }
      });
    }

    // Check required query parameters
    if (endpoint.queryParams) {
      const requiredParams = endpoint.queryParams.filter((p: any) => p.required);

      requiredParams.forEach((param: any) => {
        if (!request.queryParams || !(param.name in request.queryParams)) {
          throw new Error(
            `Required query parameter '${param.name}' is missing. ` +
            `Description: ${param.description}`
          );
        }
      });
    }

    // Check required body parameters for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(request.method || 'GET')) {
      if (endpoint.bodyParams) {
        const requiredParams = endpoint.bodyParams.filter((p: any) => p.required);

        requiredParams.forEach((param: any) => {
          if (!request.body || !(param.name in request.body)) {
            throw new Error(
              `Required body parameter '${param.name}' is missing. ` +
              `Description: ${param.description}`
            );
          }
        });
      }
    }
  }
}

// Singleton instance
export const apiClient = new APIClient();
