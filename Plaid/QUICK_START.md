# Plaid Integration - Quick Start Guide

## You Have Credentials! ✅

You already have:
- ✅ Client ID
- ✅ Sandbox Secret

This means you can start testing immediately!

---

## Step 1: Test Your Credentials (2 minutes)

Run the test script to verify your credentials work:

```bash
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\AnyAPICall\Plaid"

# Set your credentials (replace with your actual values)
set PLAID_CLIENT_ID=your_client_id_here
set PLAID_SECRET=your_sandbox_secret_here

# Run the test
node test-plaid-api.js
```

**What happens:**
- Creates a link_token (proves your credentials work)
- Shows you next steps to complete authentication

---

## Step 2: Get an Access Token (5 minutes)

You need an access token to pull bank statement data. Two options:

### Option A: Use Plaid's Quickstart Tool (Easiest)

1. Go to: https://plaid.com/docs/quickstart/
2. Clone the quickstart repo:
   ```bash
   git clone https://github.com/plaid/quickstart
   cd quickstart
   ```
3. Follow the setup instructions
4. Select "sandbox" environment
5. Complete the Link flow
6. Copy the access_token from the terminal

### Option B: Build Simple Link UI (15 minutes)

Create a minimal HTML file to test Link:

```html
<!-- plaid-link-test.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Plaid Link Test</title>
  <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</head>
<body>
  <h1>Plaid Link Test</h1>
  <button id="link-button">Connect Bank Account</button>
  <pre id="result"></pre>

  <script>
    // Step 1: Get link token from backend
    async function getLinkToken() {
      const response = await fetch('https://sandbox.plaid.com/link/token/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: 'YOUR_CLIENT_ID',
          secret: 'YOUR_SECRET',
          user: { client_user_id: 'test-user-' + Date.now() },
          client_name: 'Test App',
          products: ['transactions', 'statements'],
          country_codes: ['US'],
          language: 'en'
        })
      });
      const data = await response.json();
      return data.link_token;
    }

    // Step 2: Initialize Plaid Link
    document.getElementById('link-button').addEventListener('click', async () => {
      const linkToken = await getLinkToken();

      const handler = Plaid.create({
        token: linkToken,
        onSuccess: async (public_token, metadata) => {
          document.getElementById('result').textContent =
            'Public Token: ' + public_token + '\n\nNow exchange this for access token!';

          // Exchange for access token
          const response = await fetch('https://sandbox.plaid.com/item/public_token/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: 'YOUR_CLIENT_ID',
              secret: 'YOUR_SECRET',
              public_token: public_token
            })
          });
          const data = await response.json();

          document.getElementById('result').textContent +=
            '\n\nAccess Token: ' + data.access_token +
            '\nItem ID: ' + data.item_id +
            '\n\n✅ Save this access token!';
        },
        onExit: (err, metadata) => {
          if (err) {
            document.getElementById('result').textContent = 'Error: ' + err;
          }
        }
      });

      handler.open();
    });
  </script>
</body>
</html>
```

**To use:**
1. Replace `YOUR_CLIENT_ID` and `YOUR_SECRET` with your credentials
2. Open the HTML file in a browser
3. Click "Connect Bank Account"
4. Use test credentials:
   - Bank: "First Platypus Bank"
   - Username: `user_good`
   - Password: `pass_good`
5. Copy the access_token from the page

---

## Step 3: Test Bank Statement Endpoints (2 minutes)

Once you have an access token, test the endpoints:

```bash
# Test with your access token
node test-plaid-api.js --access-token access-sandbox-xxx

# This will run all tests:
# ✅ Get Item Info
# ✅ Get Account Balances
# ✅ Get Transaction History
# ✅ List Available Statements
# ✅ Get Account Details
```

---

## Expected Test Results

### ✅ Successful Test Output:

```
======================================================================
✅ PASS - Get Account Balances
======================================================================
Status Code: 200
Response Time: 280ms

📊 ACCOUNT SUMMARY:

1. Plaid Checking (Plaid Gold Standard 0% Interest Checking)
   Type: depository - checking
   Mask: ***0000
   Current Balance: $100.00
   Available: $100.00
   Currency: USD

2. Plaid Savings (Plaid Silver Standard 0.1% Interest Saving)
   Type: depository - savings
   Mask: ***1111
   Current Balance: $210.00
   Available: $210.00
   Currency: USD
```

---

## What You Can Do Next

With a valid access token, you can:

1. **Get Transaction History**
   ```bash
   # Last 90 days of transactions
   curl -X POST https://sandbox.plaid.com/transactions/sync \
     -H 'Content-Type: application/json' \
     -d '{
       "client_id": "YOUR_CLIENT_ID",
       "secret": "YOUR_SECRET",
       "access_token": "YOUR_ACCESS_TOKEN",
       "cursor": null,
       "count": 100
     }'
   ```

2. **List Bank Statements**
   ```bash
   curl -X POST https://sandbox.plaid.com/statements/list \
     -H 'Content-Type: application/json' \
     -d '{
       "client_id": "YOUR_CLIENT_ID",
       "secret": "YOUR_SECRET",
       "access_token": "YOUR_ACCESS_TOKEN"
     }'
   ```

3. **Download Statement PDF**
   ```bash
   curl -X POST https://sandbox.plaid.com/statements/download \
     -H 'Content-Type: application/json' \
     -d '{
       "client_id": "YOUR_CLIENT_ID",
       "secret": "YOUR_SECRET",
       "access_token": "YOUR_ACCESS_TOKEN",
       "statement_id": "STATEMENT_ID_FROM_LIST"
     }' --output statement.pdf
   ```

4. **Get Real-Time Balances**
   ```bash
   curl -X POST https://sandbox.plaid.com/accounts/balance/get \
     -H 'Content-Type: application/json' \
     -d '{
       "client_id": "YOUR_CLIENT_ID",
       "secret": "YOUR_SECRET",
       "access_token": "YOUR_ACCESS_TOKEN"
     }'
   ```

---

## Integration Checklist

Once you've tested and confirmed everything works:

- [ ] Test credentials work (Step 1)
- [ ] Obtained access token (Step 2)
- [ ] Successfully retrieved transactions
- [ ] Successfully listed statements
- [ ] Successfully retrieved balances
- [ ] Add Plaid configuration to AnyAPICall (see main guide)
- [ ] Implement Link flow in your platform
- [ ] Set up secure token storage
- [ ] Test end-to-end flow

---

## Troubleshooting

### "INVALID_API_KEYS" Error
- Double-check your client_id and secret
- Ensure using sandbox credentials with sandbox URL
- Verify no extra spaces in credentials

### "INVALID_ACCESS_TOKEN" Error
- Access token expired or invalid
- Get a new access token by completing Link flow again
- Ensure using sandbox token with sandbox URL

### Can't Complete Link Flow
- Use test credentials:
  - Bank: "First Platypus Bank"
  - Username: `user_good`
  - Password: `pass_good`
- Don't use real bank credentials in sandbox!

---

## Next Steps

1. **Immediate:** Run `node test-plaid-api.js` to verify credentials
2. **Short-term:** Get an access token using Option A or B above
3. **Medium-term:** Integrate into AnyAPICall using the main guide
4. **Long-term:** Apply for Plaid Production access when ready

---

## Resources

- **Your Plaid Dashboard:** https://dashboard.plaid.com
- **Test Credentials:** https://plaid.com/docs/sandbox/test-credentials/
- **Quickstart Repo:** https://github.com/plaid/quickstart
- **Main Integration Guide:** `NEW_API_INTEGRATION_ANYAPI_SUGGESTIVE_GUIDE_PLAID.md`

---

**Ready to test?** Run:
```bash
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\AnyAPICall\Plaid"
node test-plaid-api.js
```
