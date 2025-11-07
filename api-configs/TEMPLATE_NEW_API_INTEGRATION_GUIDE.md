# TEMPLATE: New API Integration Guide for AnyAPICall

**Purpose:** This template guides you through creating a comprehensive, single-file integration guide for any new API you want to add to the AnyAPICall MCP Server ecosystem.

**Output:** One complete markdown file named: `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_[API_NAME].md`

---

## Pre-Integration Checklist

Before starting, gather this information:

### API Research
- [ ] API official documentation URL
- [ ] API base URL(s)
- [ ] Authentication method (None, API Key, Bearer Token, OAuth, etc.)
- [ ] Special header requirements (User-Agent, etc.)
- [ ] Rate limits (per second, per minute, per day)
- [ ] Cost (Free, Paid tiers, etc.)
- [ ] All available endpoints documented

### Test Preparation
- [ ] Get test API credentials (if auth required)
- [ ] Identify 3-5 most important endpoints to test
- [ ] Prepare test data/parameters
- [ ] Set up environment for API calls (curl, Python, etc.)

---

## Step-by-Step Guide Creation Process

### STEP 1: Live Testing (MOST IMPORTANT!)

**Goal:** Prove every endpoint works with real API calls

For EACH endpoint you want to document:

1. **Make the actual API call**
   ```bash
   # Document the exact curl command
   curl -H "Header: Value" "https://api.example.com/endpoint"
   ```

2. **Capture the response**
   - Save the full response
   - Note the HTTP status code
   - Record response time
   - Measure response size

3. **Document the result**
   - ✅ PASS or ❌ FAIL
   - What data was returned
   - Any interesting findings

**Minimum Tests Required:**
- [ ] Test 1: Most basic/common endpoint
- [ ] Test 2: Endpoint with parameters
- [ ] Test 3: Endpoint with authentication (if applicable)
- [ ] Test 4: Complex/interesting endpoint
- [ ] Test 5: Multi-step or comparison test (optional)

**Document Format for Each Test:**
```markdown
### Test X: [Test Name] ✅/❌

**Endpoint:** `full-url-here`

**Request:**
```bash
[exact curl command or code]
```

**Response:**
```json
[actual response - can be truncated but show real data]
```

**Result:**
- Status: [200 OK, etc.]
- Response Time: [Xms]
- Data Size: [X KB]

**Key Finding:** [What this proves]
```

---

### STEP 2: Create the Comprehensive Document

Use this structure for the final document:

```markdown
# [API NAME] - AnyAPICall Integration Guide (SUGGESTIVE)

**🚨 IMPORTANT: Platform-First Approach**

Before using this guide, AgenticLedger platform teams should inspect their own platform to see what patterns have previously worked for existing APIs using AnyAPICall. This document provides suggestions and guidance, but your platform's existing patterns should take precedence.

---

## Table of Contents
1. Quick Reference
2. Live Test Results - PROOF IT WORKS
3. Suggested JSON Configuration
4. Platform Integration Notes
5. Usage Examples
6. Troubleshooting
7. Appendix: How to Update JSON Config

---

## Quick Reference

### API Overview
[Table with key facts]

### Suggested API ID
```
api-name-here
```

### Key Requirements
[Any special requirements like headers, formatting, etc.]

---

## Live Test Results - PROOF IT WORKS

**Test Date:** YYYY-MM-DD
**Test Status:** ✅ X/Y TESTS PASSED
**Test Environment:** [Production/Staging/etc.]

### Test Summary
[Table showing all tests]

### Test 1: [Name]
[Full test documentation - see STEP 1 format]

### Test 2: [Name]
[Full test documentation]

[... continue for all tests]

### Performance Summary
- Average Response Time
- Success Rate
- Key Metrics

---

## Suggested JSON Configuration

**⚠️ REMINDER:** Check your platform's existing AnyAPI configurations first!

### Complete JSON Config
```json
{
  "id": "api-id",
  "name": "API Name",
  "description": "...",
  "baseUrl": "...",
  "requiresAuth": true/false,
  "authType": "...",
  "rateLimit": { ... },
  "commonHeaders": { ... },
  "endpoints": [
    {
      "name": "endpoint_name",
      "path": "/path",
      "method": "GET",
      "description": "...",
      "parameters": [ ... ],
      "exampleRequest": { ... },
      "exampleResponse": { ... }
    }
  ]
}
```

### Common Parameters/Patterns
[Document any special parameter formats, common patterns, etc.]

---

## Platform Integration Notes

### STEP 1: Check Your Platform First! 🔍

1. Review existing APIs in your platform
2. Identify common patterns
3. Match your platform's style

### STEP 2: Adapt the Configuration
[Guidance on what to adapt]

### STEP 3: Configure [Special Requirements]
[E.g., User-Agent, rate limiting, etc.]

### STEP 4: Enable for Users
[How to make it available]

---

## Usage Examples

### Example 1: [Common Use Case Name]
```javascript
// Working code example
```

### Example 2: [Another Use Case]
```javascript
// Working code example
```

### Example 3: [Complex Scenario]
```javascript
// Working code example
```

---

## Troubleshooting

### Issue 1: [Common Problem]
**Symptoms:** [What users see]
**Cause:** [Why it happens]
**Solution:** [How to fix]

### Issue 2: [Another Problem]
[Same format]

[... at least 3-5 issues]

---

## Appendix: How to Update JSON Config

### Option 1: Add to Platform Database (Recommended)
[Platform-specific instructions]

### Option 2: Add to config/apis.json (If Using Locally)
[Step-by-step]

### Validation Checklist
- [ ] All required fields present
- [ ] Special requirements configured
- [ ] Test with one endpoint first
- [ ] Field names match platform conventions

---

## Summary

### What We Proved
[Bullet points of test results]

### What This Guide Provides
[What's included]

### What You Should Do
[Action items for platform team]

### Key Reminders
[Critical points to remember]

---

**Document Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Test Status:** ✅ All Tests Passed
**Integration Status:** Ready for Platform Integration
```

---

## Quality Checklist

Before considering the guide complete:

### Content Completeness
- [ ] All required sections present
- [ ] Every endpoint has at least one test
- [ ] All tests include real API calls and responses
- [ ] JSON configuration is complete and valid
- [ ] At least 3 usage examples included
- [ ] At least 3 troubleshooting scenarios documented

### Platform-First Approach
- [ ] Disclaimer at top emphasizing platform patterns
- [ ] Multiple reminders to check existing patterns
- [ ] Configuration marked as "suggestive" not prescriptive
- [ ] Adaptation guidance included

### Test Evidence Quality
- [ ] All tests show REAL data (not mocked)
- [ ] Actual curl commands or code included
- [ ] Response times documented
- [ ] Success/failure clearly marked
- [ ] Performance metrics included

### Usability
- [ ] Table of contents with working links
- [ ] Clear section headers
- [ ] Code blocks properly formatted
- [ ] Examples are copy-pasteable
- [ ] Troubleshooting has solutions, not just problems

### Documentation Standards
- [ ] Proper markdown formatting
- [ ] Consistent naming conventions
- [ ] No placeholder text (like "TODO" or "REPLACE THIS")
- [ ] Version and date stamps included
- [ ] Contact information included

---

## File Naming Convention

**Format:** `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_[API_NAME].md`

**Examples:**
- `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_SEC_EDGAR.md`
- `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_STRIPE.md`
- `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_SALESFORCE.md`

**Rules:**
- Use ALL CAPS for prefix
- Replace spaces with underscores
- Use descriptive API name (not just company name if ambiguous)
- Keep it concise but clear

---

## After Guide Creation

### Update SHIPPEDLOG.md

Add entry with this format:

```markdown
## YYYY-MM-DD

### 📊 [API Name] - Suggestive Integration Guide

**Status:** ✅ Research Complete - Ready for Platform Integration

**What We Delivered:**
- Complete [API Name] research and documentation
- Live testing of all X endpoints with real data
- Comprehensive integration guide for AgenticLedger platform
- 100% test success rate with production API

**API Details:**
- **API ID (Suggested):** `api-id`
- **Base URL:** `https://...`
- **Authentication:** [Type]
- **Rate Limits:** [Limits]
- **Total Endpoints Available:** X

**Endpoints Tested & Documented:**
1. `endpoint_1` - Description
2. `endpoint_2` - Description
[... list all]

**Files Created:**
- ✅ `api-configs/NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_[API_NAME].md`

**Live Test Results (Real Data Retrieved):**
- ✅ [Key finding 1]
- ✅ [Key finding 2]
[... bullet points of actual data]

**Testing Details:**
- ✅ X/Y endpoints tested successfully (Z% pass rate)
- ✅ Average response time: Xms
- ✅ All with real production data

**Impact:**
[Why this matters]
```

### Update Statistics Section

Update these sections in SHIPPEDLOG.md:
- [ ] Total Documentation Files count
- [ ] Add to documentation files list
- [ ] Update any relevant statistics

---

## Common Pitfalls to Avoid

### ❌ DON'T:
- Create multiple separate files for one API
- Include test results without actual API calls
- Use placeholder or mock data in tests
- Skip the platform-first disclaimer
- Make configuration prescriptive instead of suggestive
- Forget to document rate limits
- Skip troubleshooting section
- Use inconsistent formatting

### ✅ DO:
- Create ONE comprehensive file per API
- Test EVERY endpoint with real calls
- Show actual response data
- Emphasize checking platform patterns first
- Mark everything as suggestions
- Document ALL special requirements
- Include working code examples
- Format consistently throughout

---

## Example: Following This Template

**See:** `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_SEC_EDGAR.md`

This file was created following this exact template and includes:
- ✅ All required sections
- ✅ 5 live tests with real SEC data
- ✅ Complete JSON configuration
- ✅ Platform-first approach throughout
- ✅ Working code examples
- ✅ Comprehensive troubleshooting
- ✅ Single file format

Use it as a reference for structure and quality!

---

## Quick Start Workflow

1. **Research API** (1-2 hours)
   - Read documentation
   - Get credentials
   - Identify key endpoints

2. **Test Endpoints** (2-4 hours)
   - Make real API calls
   - Document every request/response
   - Capture all test data

3. **Create Guide** (2-3 hours)
   - Use this template
   - Fill in all sections
   - Include all test results

4. **Review Quality** (30 minutes)
   - Check against checklist
   - Verify all tests are real
   - Ensure platform-first approach

5. **Update Logs** (15 minutes)
   - Update SHIPPEDLOG.md
   - Update statistics
   - Commit changes

**Total Time:** ~6-10 hours per API

---

## Getting Help

**Questions about:**
- Template structure → Review SEC EDGAR guide as example
- Platform patterns → Check existing API configs in platform
- Testing approach → See "Live Test Results" sections in examples
- JSON structure → Compare with other api-configs/*.md files

---

**Template Version:** 1.0
**Created:** 2025-01-20
**Last Updated:** 2025-01-20
**Maintained By:** AgenticLedger Development Team

---

*This template ensures consistent, high-quality API integration guides that prioritize the platform's existing patterns while providing comprehensive test evidence and usage examples.*
