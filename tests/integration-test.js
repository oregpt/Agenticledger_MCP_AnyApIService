/**
 * Integration Tests for AnyAPICall MCP Server
 *
 * Tests all tools with REAL API calls
 * Results will be used for PLATFORM_INTEGRATION_REPORT.md
 */

import { server } from '../dist/index.js';

// ============================================================================
// Test Configuration
// ============================================================================

const TEST_CONFIG = {
  // Optional: Add your API keys here for testing authenticated APIs
  // If not provided, will test public APIs only
  apiKeys: {
    openweather: process.env.OPENWEATHER_API_KEY || '',
    newsapi: process.env.NEWSAPI_KEY || '',
    github: process.env.GITHUB_TOKEN || ''
  }
};

// ============================================================================
// Test Results Storage
// ============================================================================

const testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  },
  tests: []
};

// ============================================================================
// Helper Functions
// ============================================================================

function logTest(testName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TEST: ${testName}`);
  console.log('='.repeat(80));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function recordTest(testName, passed, details) {
  testResults.summary.total++;
  if (passed) {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
  }

  testResults.tests.push({
    testName,
    passed,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// ============================================================================
// Test Suite
// ============================================================================

async function runIntegrationTests() {
  console.log(`\n╔════════════════════════════════════════════════════════════════════╗`);
  console.log(`║   ANYAPICALL MCP SERVER - INTEGRATION TESTS                        ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════╝\n`);
  console.log(`⏱️  Start Time: ${new Date().toISOString()}\n`);

  await server.initialize();

  // Test 1: List Available APIs
  await testListAvailableAPIs();

  // Test 2: Get API Documentation
  await testGetAPIDocumentation();

  // Test 3: CoinGecko API (Public)
  await testCoinGeckoAPI();

  // Test 4: JSONPlaceholder API (Public)
  await testJSONPlaceholderAPI();

  // Test 5: REST Countries API (Public)
  await testRESTCountriesAPI();

  // Test 6: GitHub API (Public endpoints)
  await testGitHubAPI();

  // Test 7: OpenWeatherMap API (Requires API key)
  if (TEST_CONFIG.apiKeys.openweather) {
    await testOpenWeatherAPI();
  } else {
    logInfo('Skipping OpenWeatherMap tests - no API key provided');
  }

  // Test 8: NewsAPI (Requires API key)
  if (TEST_CONFIG.apiKeys.newsapi) {
    await testNewsAPI();
  } else {
    logInfo('Skipping NewsAPI tests - no API key provided');
  }

  // Print final results
  await printFinalResults();

  await server.shutdown();

  return testResults;
}

// ============================================================================
// Individual Test Functions
// ============================================================================

async function testListAvailableAPIs() {
  logTest('List Available APIs');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('list_available_apis', {});

    const responseTime = Date.now() - startTime;

    if (result.success) {
      logSuccess(`Listed ${result.data.total} APIs in ${responseTime}ms`);
      logInfo(`Public APIs: ${result.data.public}, Authenticated: ${result.data.authenticated}`);

      result.data.apis.forEach(api => {
        const authIcon = api.requiresAuth ? '🔐' : '🌐';
        console.log(`   ${authIcon} ${api.name} (${api.id}) - ${api.endpointCount} endpoints`);
      });

      recordTest('list_available_apis', true, {
        responseTime,
        totalAPIs: result.data.total,
        publicAPIs: result.data.public,
        authenticatedAPIs: result.data.authenticated,
        response: result.data
      });
    } else {
      logError(`Failed: ${result.error}`);
      recordTest('list_available_apis', false, {
        error: result.error
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('list_available_apis', false, {
      error: error.message
    });
  }
}

async function testGetAPIDocumentation() {
  logTest('Get API Documentation - CoinGecko');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('get_api_documentation', {
      apiId: 'coingecko'
    });

    const responseTime = Date.now() - startTime;

    if (result.success) {
      logSuccess(`Retrieved documentation in ${responseTime}ms`);
      logInfo(`API: ${result.data.name}`);
      logInfo(`Endpoints: ${result.data.totalEndpoints}`);
      logInfo(`Authentication: ${result.data.authentication.required ? 'Required' : 'Not required'}`);

      recordTest('get_api_documentation', true, {
        responseTime,
        apiId: 'coingecko',
        endpointCount: result.data.totalEndpoints,
        requiresAuth: result.data.authentication.required
      });
    } else {
      logError(`Failed: ${result.error}`);
      recordTest('get_api_documentation', false, {
        error: result.error
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('get_api_documentation', false, {
      error: error.message
    });
  }
}

async function testCoinGeckoAPI() {
  logTest('CoinGecko API - Get Crypto Prices');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      apiId: 'coingecko',
      endpoint: '/coins/markets',
      method: 'GET',
      queryParams: {
        vs_currency: 'usd',
        per_page: 5,
        page: 1
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      logInfo(`Retrieved ${result.data.data.length} cryptocurrencies`);

      // Log first 3 coins
      result.data.data.slice(0, 3).forEach(coin => {
        console.log(`   💰 ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()}`);
      });

      recordTest('coingecko_crypto_prices', true, {
        responseTime,
        statusCode: result.data.statusCode,
        coinCount: result.data.data.length,
        sampleData: result.data.data.slice(0, 2),
        fullResponse: result.data
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('coingecko_crypto_prices', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('coingecko_crypto_prices', false, {
      error: error.message
    });
  }
}

async function testJSONPlaceholderAPI() {
  logTest('JSONPlaceholder API - List Posts');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      apiId: 'jsonplaceholder',
      endpoint: '/posts',
      method: 'GET',
      queryParams: {
        _limit: 5
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      logInfo(`Retrieved ${result.data.data.length} posts`);

      recordTest('jsonplaceholder_list_posts', true, {
        responseTime,
        statusCode: result.data.statusCode,
        postCount: result.data.data.length,
        sampleData: result.data.data[0]
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('jsonplaceholder_list_posts', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('jsonplaceholder_list_posts', false, {
      error: error.message
    });
  }
}

async function testRESTCountriesAPI() {
  logTest('REST Countries API - Search by Name');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      apiId: 'restcountries',
      endpoint: '/name/{name}',
      method: 'GET',
      pathParams: {
        name: 'united'
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      logInfo(`Found ${result.data.data.length} countries matching 'united'`);

      result.data.data.forEach(country => {
        console.log(`   🌍 ${country.name.common} - Capital: ${country.capital?.[0] || 'N/A'}, Population: ${country.population?.toLocaleString()}`);
      });

      recordTest('restcountries_search', true, {
        responseTime,
        statusCode: result.data.statusCode,
        countryCount: result.data.data.length,
        sampleData: result.data.data[0]
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('restcountries_search', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('restcountries_search', false, {
      error: error.message
    });
  }
}

async function testGitHubAPI() {
  logTest('GitHub API - Get User Info');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      apiId: 'github',
      endpoint: '/users/{username}',
      method: 'GET',
      pathParams: {
        username: 'octocat'
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      const user = result.data.data;
      logInfo(`User: ${user.name} (@${user.login})`);
      logInfo(`Repos: ${user.public_repos}, Followers: ${user.followers}`);

      recordTest('github_get_user', true, {
        responseTime,
        statusCode: result.data.statusCode,
        userData: {
          login: user.login,
          name: user.name,
          publicRepos: user.public_repos,
          followers: user.followers
        }
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('github_get_user', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('github_get_user', false, {
      error: error.message
    });
  }
}

async function testOpenWeatherAPI() {
  logTest('OpenWeatherMap API - Current Weather');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      accessToken: TEST_CONFIG.apiKeys.openweather,
      apiId: 'openweather',
      endpoint: '/weather',
      method: 'GET',
      queryParams: {
        q: 'London',
        units: 'metric'
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      const weather = result.data.data;
      logInfo(`Location: ${weather.name}, ${weather.sys.country}`);
      logInfo(`Temperature: ${weather.main.temp}°C (feels like ${weather.main.feels_like}°C)`);
      logInfo(`Condition: ${weather.weather[0].main} - ${weather.weather[0].description}`);

      recordTest('openweather_current', true, {
        responseTime,
        statusCode: result.data.statusCode,
        weatherData: {
          location: weather.name,
          temp: weather.main.temp,
          condition: weather.weather[0].main
        }
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('openweather_current', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('openweather_current', false, {
      error: error.message
    });
  }
}

async function testNewsAPI() {
  logTest('NewsAPI - Top Headlines');

  try {
    const startTime = Date.now();

    const result = await server.executeTool('make_api_call', {
      accessToken: TEST_CONFIG.apiKeys.newsapi,
      apiId: 'newsapi',
      endpoint: '/top-headlines',
      method: 'GET',
      queryParams: {
        country: 'us',
        category: 'technology',
        pageSize: 5
      }
    });

    const responseTime = Date.now() - startTime;

    if (result.success && result.data.statusCode === 200) {
      logSuccess(`API call successful in ${result.data.responseTime}ms`);
      const articles = result.data.data.articles;
      logInfo(`Retrieved ${articles.length} headlines`);

      articles.slice(0, 3).forEach((article, index) => {
        console.log(`   📰 ${index + 1}. ${article.title}`);
      });

      recordTest('newsapi_headlines', true, {
        responseTime,
        statusCode: result.data.statusCode,
        articleCount: articles.length,
        sampleHeadlines: articles.slice(0, 3).map(a => a.title)
      });
    } else {
      logError(`Failed: ${result.error || 'Status code: ' + result.data?.statusCode}`);
      recordTest('newsapi_headlines', false, {
        error: result.error || result.data
      });
    }
  } catch (error) {
    logError(`Exception: ${error.message}`);
    recordTest('newsapi_headlines', false, {
      error: error.message
    });
  }
}

// ============================================================================
// Results Reporting
// ============================================================================

async function printFinalResults() {
  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`📊 FINAL TEST RESULTS`);
  console.log('='.repeat(80));
  console.log(`\n✅ PASSED: ${testResults.summary.passed}/${testResults.summary.total} tests`);
  console.log(`❌ FAILED: ${testResults.summary.failed}/${testResults.summary.total} tests`);
  console.log(`📈 SUCCESS RATE: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);

  if (testResults.summary.passed > 0) {
    const successfulTests = testResults.tests.filter(t => t.passed);
    const avgTime = successfulTests.reduce((sum, t) => sum + (t.responseTime || 0), 0) / successfulTests.length;
    console.log(`⚡ AVERAGE RESPONSE TIME: ${Math.round(avgTime)}ms`);
  }

  console.log(`\n⏱️  End Time: ${new Date().toISOString()}`);
  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// Run Tests
// ============================================================================

runIntegrationTests()
  .then(results => {
    console.log('\n✅ Integration tests complete!');
    console.log('\n📝 Test results saved for PLATFORM_INTEGRATION_REPORT.md\n');

    process.exit(results.summary.failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n❌ Integration tests failed with exception:', error);
    process.exit(1);
  });
