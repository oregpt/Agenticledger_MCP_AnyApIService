/**
 * API Registry
 *
 * Central registry for managing API definitions
 */

import { APIDefinition, APIRegistry as IAPIRegistry } from '../types.js';
import { CORE_APIS } from './definitions.js';

export class APIRegistry implements IAPIRegistry {
  public apis: Map<string, APIDefinition>;

  constructor() {
    this.apis = new Map();

    // Register all core APIs on initialization
    CORE_APIS.forEach(api => {
      this.registerAPI(api);
    });
  }

  /**
   * Register a new API definition
   */
  registerAPI(definition: APIDefinition): void {
    if (this.apis.has(definition.id)) {
      console.warn(`API '${definition.id}' is already registered. Overwriting...`);
    }

    this.apis.set(definition.id, definition);
    console.log(`✅ Registered API: ${definition.name} (${definition.id})`);
  }

  /**
   * Get API definition by ID
   */
  getAPI(id: string): APIDefinition | undefined {
    return this.apis.get(id);
  }

  /**
   * List all registered APIs
   */
  listAPIs(): APIDefinition[] {
    return Array.from(this.apis.values());
  }

  /**
   * Search APIs by name or description
   */
  searchAPIs(query: string): APIDefinition[] {
    const lowerQuery = query.toLowerCase();

    return this.listAPIs().filter(api =>
      api.name.toLowerCase().includes(lowerQuery) ||
      api.description.toLowerCase().includes(lowerQuery) ||
      api.id.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get APIs by authentication requirement
   */
  getAPIsByAuthRequirement(requiresAuth: boolean): APIDefinition[] {
    return this.listAPIs().filter(api => api.requiresAuth === requiresAuth);
  }

  /**
   * Get summary information about all registered APIs
   */
  getSummary(): {
    total: number;
    authenticated: number;
    public: number;
    apis: Array<{ id: string; name: string; requiresAuth: boolean; endpointCount: number }>;
  } {
    const apis = this.listAPIs();

    return {
      total: apis.length,
      authenticated: apis.filter(a => a.requiresAuth).length,
      public: apis.filter(a => !a.requiresAuth).length,
      apis: apis.map(api => ({
        id: api.id,
        name: api.name,
        requiresAuth: api.requiresAuth,
        endpointCount: api.endpoints.length
      }))
    };
  }
}

// Singleton instance
export const apiRegistry = new APIRegistry();
