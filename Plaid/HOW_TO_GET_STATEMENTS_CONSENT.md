# How to Get Bank Statements Consent

## 🎯 Quick Answer

To get PDF bank statements, you need to:
1. **Request the "statements" product** during Link flow
2. **User grants consent** in Plaid Link UI
3. **May require additional Plaid approval** (not always available in sandbox)

---

## 📊 Current Situation

**What you have now:**
- ✅ Transactions access (working)
- ✅ Auth access (working)
- ❌ Statements access (not consented)

**What you requested during Link:**
```json
{
  "products": ["transactions", "auth"]
}
```

**What you need to request:**
```json
{
  "products": ["transactions", "auth", "statements"]
}
```

---

## 🔧 Solution 1: Reconnect Bank Account (Quick Test)

### Step 1: Update Link Token Request

I can update your local server to include statements. This requires:

**Change in `plaid-link-server.cjs` line 90:**
```javascript
// OLD:
products: ['transactions', 'auth'],

// NEW:
products: ['transactions', 'auth', 'statements'],
```

### Step 2: Reconnect Your Test Bank

1. Stop the current server (I'll do this for you)
2. Update the code to request statements
3. Restart server
4. Go back to http://localhost:3000
5. Connect bank again (it will ask for statements consent)

**Want me to do this now?** (Yes/No)

---

## 📝 Important Notes About Statements

### ⚠️ Statements Product Limitations

**1. Not All Banks Support It**
- Only ~50% of US banks provide statements via API
- "First Platypus Bank" (test bank) may or may not support it
- Production banks vary

**2. May Require Production Access**
- Sandbox has limited statements support
- Often need to apply for Plaid Production access
- Some features only work with real banks

**3. Pricing Considerations**
- Statements product may have additional costs
- Check with Plaid about pricing
- Transactions are usually free/cheaper

### ✅ Alternative: Use Transactions (Recommended)

**You already have this working!**

Transactions provide the same data as statements:
- ✅ All spending/income data
- ✅ Dates and amounts
- ✅ Merchant details
- ✅ Categories
- ✅ Historical data (2+ years)

**What statements add:**
- PDF files (formatted like paper statements)
- Official bank formatting
- Account summary pages

**For most use cases, transactions are sufficient!**

---

## 🚀 How to Test Statements Consent

### Method 1: Update Local Server (What I Can Do Now)

**Steps:**
1. I'll update your server code to request statements
2. Restart the server
3. You reconnect the test bank
4. Plaid Link will show "Statements" in the consent screen
5. You approve it
6. Test `/statements/list` again

**Time:** 5 minutes

### Method 2: Create New Link Token Manually

**Direct API Call:**
```bash
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "6914a81a11cde40020b0fc33",
    "secret": "f63eb9a9c21a982d782df6eeb5e327",
    "user": {"client_user_id": "test-user-123"},
    "client_name": "Test App",
    "products": ["transactions", "auth", "statements"],
    "country_codes": ["US"],
    "language": "en"
  }'
```

This returns a `link_token` that includes statements consent.

### Method 3: Use Link Update Mode (Existing Connection)

If you want to keep your existing access token and just add statements:

**Create Update Mode Link Token:**
```bash
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "6914a81a11cde40020b0fc33",
    "secret": "f63eb9a9c21a982d782df6eeb5e327",
    "user": {"client_user_id": "test-user-123"},
    "access_token": "access-sandbox-88b8cf12-41f3-4ea4-a2bd-01c3a4985395",
    "products": ["statements"]
  }'
```

This lets you add statements consent without creating a new Item.

---

## 🎯 What Happens During Link Flow

### Without Statements:
```
┌─────────────────────────────┐
│ Plaid Link                  │
├─────────────────────────────┤
│ Select Bank                 │
│ Enter Credentials           │
│ Select Accounts             │
│                             │
│ Permissions:                │
│ ✓ View balances             │
│ ✓ View transactions         │
│ ✓ Verify account info       │
└─────────────────────────────┘
```

### With Statements:
```
┌─────────────────────────────┐
│ Plaid Link                  │
├─────────────────────────────┤
│ Select Bank                 │
│ Enter Credentials           │
│ Select Accounts             │
│                             │
│ Permissions:                │
│ ✓ View balances             │
│ ✓ View transactions         │
│ ✓ Verify account info       │
│ ✓ Download statements  ⭐   │
└─────────────────────────────┘
```

The user explicitly sees and approves statements access.

---

## 🔍 Testing Statements in Sandbox

### Expected Behavior

**Best Case (Statements Supported):**
```bash
curl -X POST https://sandbox.plaid.com/statements/list \
  -d '{"client_id":"...","secret":"...","access_token":"..."}'

# Response:
{
  "accounts": [
    {
      "account_id": "xxx",
      "statements": [
        {
          "statement_id": "stmt_123",
          "month": 11,
          "year": 2025,
          "posting_date": "2025-11-01"
        }
      ]
    }
  ]
}
```

**Realistic Case (May Not Be Available):**
```json
{
  "error_code": "PRODUCT_NOT_READY",
  "error_message": "statements product is not yet ready for this item"
}
```

Or:
```json
{
  "accounts": [
    {
      "account_id": "xxx",
      "statements": []  // No statements available
    }
  ]
}
```

---

## 💡 Recommendations

### For Your Use Case (Bank Statement Data):

**Option 1: Stick with Transactions (Recommended)**
- ✅ Already working
- ✅ No additional consent needed
- ✅ Same data as statements
- ✅ More reliable across banks
- ✅ Easier to implement
- ✅ Lower cost

**Option 2: Add Statements (If PDF Needed)**
- ⚠️ Requires reconnecting
- ⚠️ May not work in sandbox
- ⚠️ Limited bank support
- ⚠️ Additional costs
- ✅ Get official PDFs
- ✅ Bank formatting

### My Suggestion:

**For Now:**
1. Use transactions for bank statement data (working now)
2. Test statements consent if you want to see the process
3. Know that it may not return data in sandbox

**For Production:**
1. Request statements consent during Link flow
2. Handle case where statements aren't available
3. Fall back to transactions
4. Most users won't notice the difference

---

## 🛠️ Want Me To Help You Test It?

I can:

**Option A:** Update your local server to request statements consent
- Updates the code
- Restarts server
- You reconnect bank
- We test if statements work

**Option B:** Just document how it works
- Leave current working setup
- Document the process for later
- Focus on transactions (already working)

**Option C:** Test with direct API calls
- Create new link token with statements
- Open Link in browser manually
- Test the consent flow

---

## 📞 What Plaid Support Would Say

Based on typical Plaid support responses:

**Question:** "Why can't I access statements?"

**Answer:**
1. "Did you request the statements product during Link?"
2. "Does your pricing plan include statements?"
3. "Is your account approved for Production?"
4. "Not all banks support statements API"
5. "Try with a different test bank"

**Bottom Line:**
- Statements are more restricted than transactions
- May require production approval
- Bank-dependent feature
- Transactions are more reliable

---

## 🎯 Quick Decision Matrix

| Need | Use This | Reason |
|------|----------|---------|
| Transaction history | `/transactions/sync` | ✅ Works now, reliable |
| Account balances | `/accounts/balance/get` | ✅ Works now, reliable |
| Spending analysis | `/transactions/sync` | ✅ Has all data needed |
| Official PDF statements | `/statements/download` | ⚠️ Requires consent + may not work |
| Bank-formatted docs | `/statements/download` | ⚠️ Limited availability |

**Verdict:** For "bank statement data", transactions are sufficient and more reliable.

---

## 🚀 Next Steps

Choose your path:

1. **Test Statements Consent** ← Want me to help with this?
   - I update the server
   - You reconnect bank
   - We see if it works

2. **Document & Move On**
   - Keep current working setup
   - Document for future reference
   - Use transactions for now

3. **Apply for Production**
   - Contact Plaid
   - Request statements approval
   - Test with real banks

**What would you like to do?**
