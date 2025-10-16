/**
 * API Registry
 *
 * Central registry for managing API definitions
 */

import { APIDefinition, APIRegistry as IAPIRegistry } from '../types.js';
import { CORE_APIS } from './definitions.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class APIRegistry implements IAPIRegistry {
  public apis: Map<string, APIDefinition>;

  constructor() {
    this.apis = new Map();

    // Try to load APIs from JSON config first
    try {
      const configPath = path.join(__dirname, '../../config/apis.json');

      if (fs.existsSync(configPath)) {
        console.log('📄 Loading API definitions from config/apis.json...');
        const configData = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configData);

        if (config.apis && Array.isArray(config.apis)) {
          config.apis.forEach((api: APIDefinition) => {
            this.registerAPI(api);
          });
          console.log(`✅ Loaded ${config.apis.length} APIs from JSON config`);
        }
      } else {
        console.log('⚠️  config/apis.json not found, falling back to TypeScript definitions');
        this.loadFromTypeScript();
      }
    } catch (error) {
      console.error('❌ Error loading JSON config:', error);
      console.log('⚠️  Falling back to TypeScript definitions');
      this.loadFromTypeScript();
    }
  }

  /**
   * Fallback: Load APIs from TypeScript definitions
   */
  private loadFromTypeScript(): void {
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
