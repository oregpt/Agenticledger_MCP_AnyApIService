# Pre-Built API Configurations

This directory contains ready-to-use API configurations for integration with the AgenticLedger Platform and AnyAPICall MCP Server.

---

## 📋 What's in This Folder?

Each file contains:
- ✅ Complete JSON configuration
- ✅ API documentation and overview
- ✅ Authentication requirements
- ✅ Integration guide for platform teams
- ✅ Usage examples and test cases
- ✅ Known issues and best practices

---

## 🎯 Available APIs

| API | File | Auth Required | Endpoints | Status |
|-----|------|---------------|-----------|--------|
| **Canton Network (NodeFortress)** | `nodefortress_canton.md` | ✅ Yes (Bearer) | 15+ | ✅ Ready |
| **Bitwave Address Service** | `bitwave.md` | ❌ No | 9 | ✅ Ready |

---

## 🚀 Quick Start for Platform Teams

### Option 1: Copy JSON Config (Recommended)

1. Open the `.md` file for the API you want to integrate
2. Find the **"JSON Configuration"** section
3. Copy the entire JSON object
4. Paste into your platform's API registry or `config/apis.json`

**Example:**
```bash
# Open nodefortress_canton.md
# Copy the JSON configuration section
# Add to your system
```

### Option 2: Direct File Reference

Load configs programmatically:

```typescript
import fs from 'fs';
import path from 'path';

// Read the markdown file
const configFile = fs.readFileSync(
  path.join(__dirname, 'api-configs/nodefortress_canton.md'),
  'utf-8'
);

// Extract JSON (between ```json and ```)
const jsonMatch = configFile.match(/```json\n([\s\S]*?)\n```/);
const apiConfig = JSON.parse(jsonMatch[1]);

// Use the config
registerAPI(apiConfig);
```

---

## 📖 How to Use These Configs

### For AgenticLedger Platform

1. **Review the API documentation** in the `.md` file
2. **Copy the JSON configuration** section
3. **Add to platform's API registry**
4. **Configure user authentication** (if required)
5. **Test with provided examples**
6. **Deploy to production**

### For AnyAPICall MCP Server

1. **Open `config/apis.json`**
2. **Add the API to the `"apis"` array**
3. **Restart the MCP server** (no rebuild needed!)
4. **Verify** it shows up in `list_available_apis`

---

## 🔐 Authentication Setup

### APIs Requiring Auth

**Canton Network (NodeFortress):**
- Type: Bearer Token
- Setup: Users provide their NodeFortress API token
- Platform stores: Per-user API keys
- Test token provided in the config file

**Platform Implementation:**
```typescript
{
  userId: "user123",
  apiKeys: {
    "canton-nodefortress": "user_token_here"
  }
}
```

### Public APIs

**Bitwave Address Service:**
- No authentication needed
- Ready to use immediately
- No setup required

---

## ✅ Integration Checklist

Before integrating an API into your platform:

- [ ] Read the complete API documentation (`.md` file)
- [ ] Understand authentication requirements
- [ ] Review rate limits and caching strategies
- [ ] Copy JSON configuration
- [ ] Test with provided examples
- [ ] Implement error handling
- [ ] Set up user API key management (if required)
- [ ] Test in staging environment
- [ ] Monitor API calls in production
- [ ] Document for your users

---

## 📝 File Structure Explained

Each API configuration file follows this structure:

```markdown
# API Name

## Overview
- What the API does
- Key features

## Authentication
- Required or not
- How to get tokens

## Rate Limits
- Request limits
- Best practices

## JSON Configuration
- Complete config ready to copy

## Integration Guide
- Step-by-step for platform teams

## Usage Examples
- Real code examples

## Known Issues & Notes
- Things to watch out for
```

---

## 🔄 Adding More APIs

Want to add more pre-built configs? Follow this template:

1. **Create new file:** `api-configs/your-api-name.md`
2. **Use existing files as template**
3. **Include all sections:**
   - Overview
   - Authentication
   - JSON Configuration
   - Integration Guide
   - Usage Examples
4. **Test the configuration**
5. **Submit PR or add to repo**

---

## 🧪 Testing Configurations

### Test Canton Network API:

```bash
# With curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://pro.explorer.canton.nodefortress.io/api/v1/stats/network

# With AnyAPICall MCP
make_api_call({
  accessToken: "YOUR_TOKEN",
  apiId: "canton-nodefortress",
  endpoint: "/api/v1/stats/network"
})
```

### Test Bitwave API:

```bash
# With curl (no auth needed)
curl https://address-svc-utyjy373hq-uc.a.run.app/api/symbols/BTC

# With AnyAPICall MCP
make_api_call({
  apiId: "bitwave-address",
  endpoint: "/api/symbols/{symbol}",
  pathParams: { symbol: "BTC" }
})
```

---

## 📊 Configuration Quality Standards

Each config in this directory meets these standards:

✅ **Completeness:**
- All major endpoints documented
- Parameters clearly defined
- Examples provided

✅ **Accuracy:**
- Tested with real API calls
- Authentication verified
- Error handling documented

✅ **Usability:**
- Ready to copy-paste
- Clear integration instructions
- Platform team friendly

✅ **Documentation:**
- Overview and use cases
- Examples and test cases
- Known issues highlighted

---

## 🎓 Integration Examples

### Example 1: AgenticLedger Platform Integration

```typescript
// 1. Load pre-built config
import cantonConfig from './api-configs/nodefortress_canton.json';

// 2. Register with platform
platform.apiRegistry.register(cantonConfig);

// 3. Enable for users
platform.enableAPI('canton-nodefortress', {
  requiresUserToken: true,
  tokenLabel: "NodeFortress Canton API Token",
  getTokenUrl: "https://nodefortress.io/canton/api-access"
});

// 4. Use in agent
agent.makeAPICall({
  apiId: 'canton-nodefortress',
  endpoint: '/api/v1/transactions',
  userToken: user.getAPIKey('canton-nodefortress')
});
```

### Example 2: Direct MCP Server Integration

```json
// config/apis.json
{
  "version": "1.0.0",
  "apis": [
    // ... existing APIs ...

    // Paste Canton config here
    {
      "id": "canton-nodefortress",
      "name": "Canton Network Explorer",
      ...
    },

    // Paste Bitwave config here
    {
      "id": "bitwave-address",
      "name": "Bitwave Address Service",
      ...
    }
  ]
}
```

---

## 🔍 Finding the Right API

### By Use Case:

**Blockchain Explorer:**
- Canton Network API (`nodefortress_canton.md`)

**Address Validation:**
- Bitwave Address Service (`bitwave.md`)

**Coming Soon:**
- Stripe (Payments)
- Twilio (SMS/Voice)
- SendGrid (Email)
- More...

---

## 💡 Tips for Platform Teams

### 1. Start with Public APIs

Begin integration with **Bitwave** (no auth needed):
- Faster to test
- No user token management
- Proves integration works

### 2. Then Add Authenticated APIs

Move to **Canton Network**:
- Implement user token storage
- Test with provided token
- Deploy token UI for users

### 3. Cache Aggressively

- Cache symbol lists (rarely change)
- Cache blockchain info (static)
- Don't cache transaction data (real-time)

### 4. Handle Errors Gracefully

- Invalid tokens → prompt user to update
- Rate limits → queue and retry
- Network errors → show clear message

### 5. Monitor Usage

- Track API call volume
- Watch for rate limit issues
- Monitor error rates

---

## 📞 Support

### For API-Specific Issues:

- **Canton Network:** support@nodefortress.io
- **Bitwave:** Contact Bitwave support

### For Configuration Issues:

- Check the `.md` file for troubleshooting
- Review integration guide
- Test with provided examples

### For MCP Server Issues:

- See main `README.md`
- Check `HOW_TO_ADD_NEW_APIS.md`

---

## 🚦 Status Legend

- ✅ **Ready** - Tested and production-ready
- 🚧 **Beta** - Functional but may change
- 📝 **Draft** - Work in progress
- ⚠️ **Deprecated** - Use alternative

---

## 📦 What's Next?

### Planned Additions:

- Stripe Payments API
- Twilio SMS API
- SendGrid Email API
- OpenAI API
- Anthropic API
- And more...

### How to Request:

Have an API you want pre-configured?
1. Open an issue on GitHub
2. Provide API documentation URL
3. Note if auth is required
4. We'll create the config!

---

## 🎉 Ready to Integrate?

1. Pick an API from the list above
2. Open its `.md` file
3. Follow the integration guide
4. Copy the JSON configuration
5. Start building!

**Questions?** Check the `.md` file for detailed guides, or reach out to the API provider's support team.

---

**Last Updated:** 2025-01-16
**Total APIs:** 2
**Status:** Ready for Production
