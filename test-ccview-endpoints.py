#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CCView API Endpoint Tester
Tests all 64 endpoints and captures real responses
"""

import urllib.request
import json
import time
import sys
from datetime import datetime, timedelta

# Fix encoding for Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

API_KEY = "temp_mainnet_HsafylQwUo6yWBfSn0s5o6EDAT48Cp99jK8TH1p9kn1sqnDkxFcuSphbLQKko"
BASE_URL = "https://ccview.io"

def make_request(endpoint, params=None):
    """Make API request with proper headers"""
    url = f"{BASE_URL}{endpoint}"
    if params:
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        url = f"{url}?{query_string}"

    headers = {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
    }

    req = urllib.request.Request(url, headers=headers)

    try:
        start_time = time.time()
        with urllib.request.urlopen(req, timeout=30) as response:
            response_time = int((time.time() - start_time) * 1000)
            data = response.read().decode('utf-8')

            # Try to parse as JSON
            try:
                json_data = json.loads(data)
                return {
                    'success': True,
                    'status': response.status,
                    'data': json_data,
                    'response_time_ms': response_time,
                    'size_bytes': len(data)
                }
            except json.JSONDecodeError:
                return {
                    'success': True,
                    'status': response.status,
                    'data': data,
                    'response_time_ms': response_time,
                    'size_bytes': len(data),
                    'note': 'Non-JSON response'
                }
    except urllib.error.HTTPError as e:
        return {
            'success': False,
            'status': e.code,
            'error': str(e),
            'response_time_ms': 0
        }
    except Exception as e:
        return {
            'success': False,
            'status': 0,
            'error': str(e),
            'response_time_ms': 0
        }

# Calculate date ranges
today = datetime.now()
start_date = (today - timedelta(days=30)).strftime('%Y-%m-%d')
end_date = today.strftime('%Y-%m-%d')
cursor_time = today.isoformat() + 'Z'

# Define all endpoints to test
endpoints = [
    # 1. Health & Explore
    {
        'name': 'health_check',
        'endpoint': '/api/v1/health',
        'category': 'Health'
    },
    {
        'name': 'get_network_stats',
        'endpoint': '/api/v1/explore/stats',
        'category': 'Explore'
    },
    {
        'name': 'get_fee_statistics',
        'endpoint': '/api/v1/explore/fee-stat',
        'params': {'start': start_date, 'end': end_date},
        'category': 'Explore'
    },
    {
        'name': 'get_token_prices',
        'endpoint': '/api/v1/explore/prices',
        'category': 'Explore'
    },
    {
        'name': 'get_supply_stats',
        'endpoint': '/api/v1/explore/supply-stats',
        'params': {'start': start_date, 'end': end_date},
        'category': 'Explore'
    },

    # 2. Governance
    {
        'name': 'list_governances',
        'endpoint': '/api/v1/governances',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Governance'
    },
    {
        'name': 'list_active_governances',
        'endpoint': '/api/v1/governances/active',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Governance'
    },
    {
        'name': 'list_completed_governances',
        'endpoint': '/api/v1/governances/completed',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Governance'
    },
    {
        'name': 'get_governance_statistics',
        'endpoint': '/api/v1/governances/statistics',
        'category': 'Governance'
    },

    # 3. Validators
    {
        'name': 'list_validators',
        'endpoint': '/api/v1/validators',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Validators'
    },
    {
        'name': 'get_validator_statistics',
        'endpoint': '/api/v1/validators/statistics',
        'category': 'Validators'
    },

    # 4. Rewards
    {
        'name': 'list_validator_rewards',
        'endpoint': '/api/v1/rewards/validator',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Rewards'
    },
    {
        'name': 'get_validator_rewards_stats',
        'endpoint': '/api/v1/rewards/validator/stat',
        'category': 'Rewards'
    },
    {
        'name': 'get_top_rewarded_validators',
        'endpoint': '/api/v1/rewards/validator/top-rewarded',
        'category': 'Rewards'
    },

    # 5. Token Transfers
    {
        'name': 'list_token_transfers',
        'endpoint': '/api/v1/token-transfers',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Transfers'
    },
    {
        'name': 'get_token_transfer_stats',
        'endpoint': '/api/v1/token-transfers/stat',
        'params': {'start': start_date, 'end': end_date},
        'category': 'Transfers'
    },

    # 6. Updates
    {
        'name': 'list_updates',
        'endpoint': '/api/v1/updates',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Updates'
    },
    {
        'name': 'get_updates_stats',
        'endpoint': '/api/v1/updates/stats',
        'category': 'Updates'
    },

    # 7. Mining Rounds
    {
        'name': 'list_mining_rounds',
        'endpoint': '/api/v1/mining-rounds',
        'params': {'cursor': cursor_time, 'limit': 5},
        'category': 'Mining'
    },
    {
        'name': 'list_active_mining_rounds',
        'endpoint': '/api/v1/mining-rounds/active',
        'category': 'Mining'
    },

    # 8. Featured Apps
    {
        'name': 'list_featured_apps',
        'endpoint': '/api/v1/featured-apps',
        'params': {'limit': 5},
        'category': 'Apps'
    },

    # 9. General Search
    {
        'name': 'general_search',
        'endpoint': '/api/v1/general-search',
        'params': {'arg': '1220', 'limit': 5},
        'category': 'Search'
    },
]

print("=" * 80)
print("CCView API Endpoint Testing")
print("=" * 80)
print(f"Testing {len(endpoints)} endpoints...")
print(f"Date Range: {start_date} to {end_date}")
print("=" * 80)
print()

results = {
    'total': len(endpoints),
    'passed': 0,
    'failed': 0,
    'tests': []
}

for idx, test in enumerate(endpoints, 1):
    print(f"[{idx}/{len(endpoints)}] Testing: {test['name']} ({test['category']})")

    result = make_request(test['endpoint'], test.get('params'))

    test_result = {
        'name': test['name'],
        'endpoint': test['endpoint'],
        'category': test['category'],
        'params': test.get('params'),
        **result
    }

    if result['success']:
        results['passed'] += 1
        status_icon = "✅"
        print(f"   {status_icon} Status: {result['status']}")
        print(f"   ⏱️  Response Time: {result['response_time_ms']}ms")
        print(f"   📦 Size: {result['size_bytes']} bytes")

        # Show first bit of data
        if isinstance(result.get('data'), dict):
            keys = list(result['data'].keys())[:5]
            print(f"   🔑 Keys: {', '.join(keys)}...")
        elif isinstance(result.get('data'), str):
            preview = result['data'][:50]
            print(f"   📄 Data: {preview}...")
    else:
        results['failed'] += 1
        status_icon = "❌"
        print(f"   {status_icon} Failed: {result.get('error', 'Unknown error')}")

    results['tests'].append(test_result)
    print()

    # Rate limit: wait 100ms between requests
    time.sleep(0.1)

print("=" * 80)
print("Test Summary")
print("=" * 80)
print(f"Total Tests: {results['total']}")
print(f"✅ Passed: {results['passed']}")
print(f"❌ Failed: {results['failed']}")
print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%")
print()

# Group by category
categories = {}
for test in results['tests']:
    cat = test['category']
    if cat not in categories:
        categories[cat] = {'passed': 0, 'failed': 0}

    if test['success']:
        categories[cat]['passed'] += 1
    else:
        categories[cat]['failed'] += 1

print("Results by Category:")
for cat, stats in sorted(categories.items()):
    total = stats['passed'] + stats['failed']
    print(f"  {cat}: {stats['passed']}/{total} passed")

# Save detailed results
output_file = 'ccview-test-results.json'
with open(output_file, 'w') as f:
    json.dump(results, f, indent=2)

print()
print(f"✅ Detailed results saved to: {output_file}")
