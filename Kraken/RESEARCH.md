# Kraken API Research

## Balance API Documentation

### Endpoint
```
POST /0/private/Balance
```

### Base URL
```
https://api.kraken.com
```

### Full URL
```
https://api.kraken.com/0/private/Balance
```

### Authentication
- **Method:** API Key + Signature
- **Required Permission:** `Funds permissions - Query`
- **Headers:**
  - `API-Key`: Your API key
  - `API-Sign`: Request signature

### Request Method
POST (despite being a read operation)

### Request Parameters
None required (authenticated endpoint automatically returns all balances)

### Response Structure
```json
{
  "error": [],
  "result": {
    "ZUSD": "1234.5678",
    "XXBT": "0.12345678",
    "XETH": "5.4321",
    "USDT": "1000.00",
    "DOT": "100.5"
  }
}
```

### Response Fields
- `error`: Array of error messages (empty if successful)
- `result`: Object with asset-balance pairs
  - Key: Asset symbol (may include prefix like X, Z, or suffix like .B, .F, .T)
  - Value: Balance amount as string

### Special Asset Notations
Kraken uses special symbols and suffixes:
- **Prefixes:**
  - `X`: Cryptocurrency (e.g., XXBT = Bitcoin, XETH = Ethereum)
  - `Z`: Fiat currency (e.g., ZUSD = US Dollar, ZEUR = Euro)
- **Suffixes:**
  - `.B`: Yield-bearing products
  - `.F`: Automatically earning Kraken Rewards
  - `.T`: Tokenized assets

### Important Notes
- Returns net balances (accounts for pending withdrawals)
- For Earn/Staking assets migrated to new system, interact with base assets (e.g., `USDT` instead of `USDT.F`)
- Balance is string type for precision

### Alternative Endpoints

#### Get Extended Balance
```
POST /0/private/BalanceEx
```
Returns extended balance information including credits and held amounts.

#### Get Trade Balance
```
POST /0/private/TradeBalance
```
Returns summary of collateral balances, margin position valuations, equity, and margin level.

**Response includes:**
- Equivalent balance (combined balance of all currencies)
- Trade balance (combined balance of all equity currencies)
- Margin amount
- Unrealized net profit/loss
- Cost basis of open positions
- Current floating valuation
- Equity (trade balance + unrealized net profit/loss)
- Free margin
- Margin level percentage

### WebSocket Alternative
For real-time balance updates, use the WebSocket v2 API:
- **Channel:** `balances`
- Streams client asset balances and transactions from account ledger
- Requires authentication token

### Key Features
- Simple, clean response format
- Covers all asset types (crypto, fiat, staking)
- Net balances after pending withdrawals
- Both REST and WebSocket support
- Supports margin and staking balance queries

### API Setup
1. Create API key in account settings
2. Enable "Query Funds" permission
3. Optional: Enable "Query Open Orders & Trades" for trade-related data
4. Recommended: Enable two-factor authentication (2FA)

### Example cURL Request
```bash
curl -X POST "https://api.kraken.com/0/private/Balance" \
  -H "API-Key: your_api_key" \
  -H "API-Sign: computed_signature" \
  -d "nonce=1234567890"
```

### Official Documentation
- API Center: https://docs.kraken.com/api/
- Balance Endpoint: https://docs.kraken.com/api/docs/rest-api/get-account-balance/
- Account Data: https://docs.kraken.com/api/docs/category/rest-api/account-data/

---

## Transactions API Documentation

### Overview
Kraken provides endpoints to retrieve transaction history through the "Ledgers" system, which records all account activity including deposits, withdrawals, trades, fees, and more.

---

### 1. Get Ledgers Info (Transaction History)

#### Endpoint
```
POST /0/private/Ledgers
```

#### Full URL
```
https://api.kraken.com/0/private/Ledgers
```

#### Authentication
- **Method:** API Key + Signature
- **Required Permission:** `Data - Query ledger entries`
- **Headers:**
  - `API-Key`: Your API key
  - `API-Sign`: Request signature

#### Request Parameters
All parameters are optional:
- `asset` (string): Comma-delimited list of assets to restrict output (e.g., "BTC,ETH,USDT")
- `aclass` (string): Asset class (default: "currency")
- `type` (string): Filter by ledger entry type:
  - `all`: All types (default)
  - `deposit`: Deposits
  - `withdrawal`: Withdrawals
  - `trade`: Trades
  - `margin`: Margin trades
  - `rollover`: Rollover events
  - `credit`: Credits
  - `transfer`: Transfers
  - `settled`: Settled positions
  - `staking`: Staking operations
  - `dividend`: Dividend payments
  - `sale`: Sales
- `start` (integer): Starting unix timestamp or ledger ID for results
- `end` (integer): Ending unix timestamp or ledger ID for results
- `ofs` (integer): Result offset for pagination
- `nonce` (integer): Increasing nonce value for request authentication

#### Response Structure
```json
{
  "error": [],
  "result": {
    "ledger": {
      "L4UESK-KG3EQ-UFO4T5": {
        "refid": "TJKLXF-PGMUI-4NTLXU",
        "time": 1688667796.8802,
        "type": "trade",
        "subtype": "",
        "aclass": "currency",
        "asset": "XXBT",
        "amount": "-0.5000000000",
        "fee": "0.0000000000",
        "balance": "0.1234567890"
      },
      "LMNYCH-ECIXB-54LP6N": {
        "refid": "ABCDEF-12345-GHIJKL",
        "time": 1688667796.8803,
        "type": "deposit",
        "subtype": "",
        "aclass": "currency",
        "asset": "ZUSD",
        "amount": "1000.0000",
        "fee": "0.0000",
        "balance": "5000.0000"
      }
    },
    "count": 2
  }
}
```

#### Response Fields
- `error`: Array of error messages (empty if successful)
- `result`: Object containing ledger data
  - `ledger`: Object where keys are ledger entry IDs and values contain:
    - `refid`: Reference ID (links to related transaction like order ID)
    - `time`: Unix timestamp of the ledger entry
    - `type`: Type of ledger entry (deposit, withdrawal, trade, margin, etc.)
    - `subtype`: Additional classification (if applicable)
    - `aclass`: Asset class (usually "currency")
    - `asset`: Asset symbol (may have X/Z prefix or .B/.F/.T suffix)
    - `amount`: Transaction amount (positive for credits, negative for debits)
    - `fee`: Transaction fee charged
    - `balance`: Resulting balance after this transaction
  - `count`: Total number of available ledger entries matching criteria

#### Key Features
- Returns 50 results at a time by default (most recent first)
- Supports filtering by asset, type, and time range
- Includes detailed fee information
- Shows running balance after each transaction
- Can query historical data using timestamps
- Pagination support via `ofs` parameter

---

### 2. Query Ledgers (Get Specific Ledger Entries)

#### Endpoint
```
POST /0/private/QueryLedgers
```

#### Full URL
```
https://api.kraken.com/0/private/QueryLedgers
```

#### Request Parameters
- `id` (string, required): Comma-delimited list of ledger IDs to query
- `trades` (boolean, optional): Whether to include trades related to position in output (default: false)
- `nonce` (integer): Increasing nonce value for request authentication

#### Response Structure
Same format as Get Ledgers Info, but only returns the specified ledger entries.

#### Use Case
When you have specific ledger IDs (e.g., from a previous query) and want to retrieve their full details.

---

### 3. Get Trade History

#### Endpoint
```
POST /0/private/TradesHistory
```

#### Full URL
```
https://api.kraken.com/0/private/TradesHistory
```

#### Request Parameters
- `type` (string): Type of trade (default: "all")
  - `all`: All trades
  - `any position`: Any position (open or closed)
  - `closed position`: Closed positions only
  - `closing position`: Closing positions only
  - `no position`: No position trades
- `trades` (boolean): Whether to include trades related to position in output
- `start` (integer): Starting unix timestamp or trade tx ID
- `end` (integer): Ending unix timestamp or trade tx ID
- `ofs` (integer): Result offset for pagination
- `nonce` (integer): Nonce for authentication

#### Response Structure
```json
{
  "error": [],
  "result": {
    "trades": {
      "TRADE-ID-1": {
        "ordertxid": "ORDER-ID-1",
        "postxid": "POST-ID-1",
        "pair": "XXBTZUSD",
        "time": 1688667796.8802,
        "type": "buy",
        "ordertype": "limit",
        "price": "30000.00",
        "cost": "300.00",
        "fee": "0.60",
        "vol": "0.01",
        "margin": "0.00",
        "misc": ""
      }
    },
    "count": 1
  }
}
```

#### Response Fields
- `trades`: Object with trade IDs as keys
  - `ordertxid`: Order responsible for execution
  - `postxid`: Position trade ID
  - `pair`: Trading pair
  - `time`: Unix timestamp
  - `type`: Type of order (buy/sell)
  - `ordertype`: Order type (market, limit, etc.)
  - `price`: Execution price
  - `cost`: Total cost of order
  - `fee`: Total fee charged
  - `vol`: Volume executed
  - `margin`: Initial margin used
- `count`: Total count of trades

---

### 4. Get Deposits Status

#### Endpoint
```
POST /0/private/DepositStatus
```

#### Full URL
```
https://api.kraken.com/0/private/DepositStatus
```

#### Request Parameters
- `asset` (string): Asset being deposited
- `method` (string, optional): Name of deposit method
- `nonce` (integer): Nonce for authentication

#### Response
Returns array of deposit status information including transaction IDs, amounts, statuses, and timestamps.

---

### 5. Get Withdrawals Status

#### Endpoint
```
POST /0/private/WithdrawStatus
```

#### Full URL
```
https://api.kraken.com/0/private/WithdrawStatus
```

#### Request Parameters
- `asset` (string): Asset being withdrawn
- `method` (string, optional): Name of withdrawal method
- `nonce` (integer): Nonce for authentication

#### Response
Returns array of withdrawal status information including reference IDs, amounts, statuses, and timestamps.

---

### 6. Export Report (Bulk Transaction Export)

#### Endpoint
```
POST /0/private/AddExport
```

#### Full URL
```
https://api.kraken.com/0/private/AddExport
```

#### Request Parameters
- `description` (string, required): Description for the export
- `report` (string, required): Type of report
  - `ledgers`: Ledger entries
  - `trades`: Trade history
- `format` (string, optional): Format of report (CSV or TSV, default: CSV)
- `starttm` (integer): Start unix timestamp
- `endtm` (integer): End unix timestamp
- `nonce` (integer): Nonce for authentication

#### Use Case
For bulk export of historical data. The report is generated asynchronously and can be retrieved later.

---

### Special Asset Notations in Transactions

When viewing transaction history, be aware of Kraken's asset naming:
- **`.B` assets**: Yield-bearing products (similar to `.S` staked and `.M` assets)
- **`.F` assets**: Balances automatically earning in Kraken Rewards
- **`.T` assets**: Tokenized assets

**Important**: These are read-only designations. To transact, use the base asset (e.g., use `USDT` to interact with both `USDT` and `USDT.F` balances).

---

### Rate Limiting

**Important**: Ledger and trade history API calls increase the rate limit counter by **2** (instead of the usual 1). Plan your request patterns accordingly to avoid rate limiting.

---

### Authentication Details

All transaction endpoints require:
1. **API-Key header**: Your API key
2. **API-Sign header**: HMAC-SHA512 signature of (URI path + SHA256(nonce + POST data)) using base64-decoded secret
3. **nonce**: Must be an always-increasing integer (typically use timestamp in microseconds)

### API Permissions Required

To access transaction history, enable these permissions on your API key:
- **Data - Query ledger entries**: For ledger-based queries
- **Data - Query open orders & trades**: For trade history queries
- **Data - Query funds**: For deposit/withdrawal status

### Pagination Best Practices

1. Start with `ofs=0` for first page
2. Increment `ofs` by 50 (or your page size) for subsequent pages
3. Check `count` in response to know total available entries
4. Use `start` and `end` timestamps to limit the date range

### Example cURL Request
```bash
curl -X POST "https://api.kraken.com/0/private/Ledgers" \
  -H "API-Key: your_api_key" \
  -H "API-Sign: computed_signature" \
  -d "nonce=1234567890" \
  -d "type=deposit" \
  -d "asset=BTC"
```

### Official Documentation
- API Center: https://docs.kraken.com/api/
- Get Ledgers: https://docs.kraken.com/api/docs/rest-api/get-ledgers/
- Account Data: https://docs.kraken.com/api/docs/category/rest-api/account-data/
- Export API: https://support.kraken.com/hc/en-us/articles/360025484891
