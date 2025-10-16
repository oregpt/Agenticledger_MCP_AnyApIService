# Original TypeScript Configuration Approach

## Overview

This document describes the original TypeScript-based configuration approach that was used before migrating to JSON config.

## Original Files

### src/apis/definitions.ts
This file contained all API definitions in TypeScript format. It's still available as a fallback if the JSON config fails to load.

### How It Worked

```typescript
// src/apis/definitions.ts
export const COINGECKO_API: APIDefinition = {
  id: 'coingecko',
  name: 'CoinGecko',
  description: '...',
  baseUrl: 'https://api.coingecko.com/api/v3',
  requiresAuth: false,
  endpoints: [...]
};

export const CORE_APIS: APIDefinition[] = [
  COINGECKO_API,
  OPENWEATHER_API,
  // ... other APIs
];
```

### Registry Loading (Original)

```typescript
// src/apis/registry.ts
constructor() {
  this.apis = new Map();

  // Load all APIs from TypeScript file
  CORE_APIS.forEach(api => {
    this.registerAPI(api);
  });
}
```

## Advantages of Original Approach

✅ **Type Safety** - TypeScript compiler catches errors at build time
✅ **IDE Support** - Full autocomplete and IntelliSense
✅ **No Runtime Parsing** - Definitions compiled to JavaScript

## Disadvantages

❌ **Requires Rebuild** - Every API change needs `npm run build`
❌ **Requires Redeploy** - Can't update APIs without restarting server
❌ **Developer-Only** - Non-technical users can't add APIs
❌ **No Hot Reload** - Changes require full rebuild cycle

## When to Use

The TypeScript approach is better when:
- You need strong type safety during development
- APIs are stable and rarely change
- Only developers will be adding/modifying APIs
- You prefer compile-time validation

## Fallback Mechanism

The current implementation keeps this approach as a fallback:
```typescript
// If JSON config fails to load or doesn't exist
this.loadFromTypeScript();
```

This ensures the server always works even if the JSON config is corrupted or missing.

## Migration Path

To revert to TypeScript-only approach:

1. Open `src/apis/registry.ts`
2. Replace the constructor with:
```typescript
constructor() {
  this.apis = new Map();
  CORE_APIS.forEach(api => {
    this.registerAPI(api);
  });
}
```
3. Remove the JSON loading logic
4. Run `npm run build`

## Files Preserved

- `src/apis/definitions.ts` - Still contains all API definitions
- Original logic intact for fallback purposes

---

**Note:** Both approaches coexist in the current codebase. JSON config takes priority, TypeScript definitions serve as fallback.
