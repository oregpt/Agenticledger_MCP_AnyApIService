/**
 * Simple server to handle Plaid Link flow
 * Avoids CORS issues by proxying requests through Node.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Your Plaid credentials
const PLAID_CLIENT_ID = '6914a81a11cde40020b0fc33';
const PLAID_SECRET = 'f63eb9a9c21a982d782df6eeb5e327';
const PORT = 3000;

/**
 * Make request to Plaid API
 */
function makePlaidRequest(endpoint, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      ...body
    });

    const options = {
      hostname: 'sandbox.plaid.com',
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

/**
 * Create HTTP server
 */
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the HTML file
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'test-link-flow-server.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // API endpoint: Create link token
  if (req.url === '/api/create-link-token' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        const data = JSON.parse(body);

        const result = await makePlaidRequest('/link/token/create', {
          user: { client_user_id: data.userId || 'test-user-' + Date.now() },
          client_name: 'AnyAPICall Test',
          products: ['transactions', 'auth'],
          country_codes: ['US'],
          language: 'en'
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // API endpoint: Exchange public token
  if (req.url === '/api/exchange-token' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        const data = JSON.parse(body);

        const result = await makePlaidRequest('/item/public_token/exchange', {
          public_token: data.publicToken
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Plaid Link Server Started!');
  console.log('='.repeat(70));
  console.log(`\n📍 Open this URL in your browser:\n`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log('='.repeat(70));
  console.log('\n✅ Server ready to handle Plaid Link flow');
  console.log('✅ CORS issues resolved');
  console.log('✅ Your credentials are loaded\n');
  console.log('Press Ctrl+C to stop the server\n');
});
