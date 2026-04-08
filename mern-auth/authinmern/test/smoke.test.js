/**
 * Smoke test for the Redis-backed authentication system.
 *
 * Run with: node test/smoke.test.js
 *
 * Requires a running server (npm run dev or npm start) with MongoDB and Redis
 * available. Override the base URL with the BASE_URL env var.
 *
 * Exit codes:
 *   0 – all assertions passed
 *   1 – one or more assertions failed
 */

'use strict';

const http = require('http');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const TEST_EMAIL = `smoke_${require('crypto').randomUUID().replace(/-/g, '')}@test.invalid`;
const TEST_PASSWORD = 'SmokePass1!';

let passed = 0;
let failed = 0;

// ---------------------------------------------------------------------------
// Minimal HTTP helper
// ---------------------------------------------------------------------------

function request(method, path, body, cookieHeader) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const isHttps = url.protocol === 'https:';
        const lib = isHttps ? https : http;

        const payload = body ? JSON.stringify(body) : undefined;
        const options = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
        };

        const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                let json;
                try { json = JSON.parse(data); } catch (parseErr) {
                    console.warn(`  [warn] Could not parse JSON response from ${method} ${path}: ${parseErr.message}. Raw: ${data.slice(0, 200)}`);
                    json = null;
                }
                resolve({ status: res.statusCode, headers: res.headers, body: json, raw: data });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

// ---------------------------------------------------------------------------
// Assertion helpers
// ---------------------------------------------------------------------------

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓  ${message}`);
        passed++;
    } else {
        console.error(`  ✗  ${message}`);
        failed++;
    }
}

function extractCookie(headers, name) {
    const setCookie = headers['set-cookie'] || [];
    const entry = setCookie.find((c) => c.startsWith(name + '='));
    return entry ? entry.split(';')[0] : null; // "name=value"
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

async function testHealthCheck() {
    console.log('\n[1] Health check');
    const res = await request('GET', '/api/health');
    assert(res.status === 200, `GET /api/health returns 200 (got ${res.status})`);
    assert(res.body && res.body.success === true, 'success: true in body');
}

async function testRegister() {
    console.log('\n[2] Register');
    const res = await request('POST', '/api/auth/register', {
        name: 'Smoke Tester',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
    });
    // 201 on success; accept 400 only if user already exists (re-run scenario)
    assert(
        res.status === 201 || (res.status === 400 && res.body && res.body.message === 'User already exists'),
        `POST /api/auth/register returns 201 (got ${res.status})`
    );
    return res;
}

async function testLoginSuccess() {
    console.log('\n[3] Login – correct credentials');
    const res = await request('POST', '/api/auth/login', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
    });
    assert(res.status === 200, `POST /api/auth/login returns 200 (got ${res.status})`);
    assert(res.body && res.body.success === true, 'success: true in body');

    const tokenCookie = extractCookie(res.headers, 'token');
    assert(tokenCookie !== null, 'Response sets a token cookie');

    // Verify cookie is HTTP-only
    const rawCookieHeader = (res.headers['set-cookie'] || []).find((c) => c.startsWith('token=')) || '';
    assert(rawCookieHeader.toLowerCase().includes('httponly'), 'token cookie is HTTP-only');

    return tokenCookie;
}

async function testIsAuthenticated(tokenCookie) {
    console.log('\n[4] isAuthenticated – valid Redis session');
    const res = await request('GET', '/api/auth/isauthenticated', null, tokenCookie);
    assert(res.status === 200, `GET /api/auth/isauthenticated returns 200 (got ${res.status})`);
    assert(res.body && res.body.success === true, 'success: true in body');
}

async function testLoginWrongPassword() {
    console.log('\n[5] Login – wrong password');
    const res = await request('POST', '/api/auth/login', {
        email: TEST_EMAIL,
        password: 'wrong-password',
    });
    assert(res.status === 401, `Wrong password returns 401 (got ${res.status})`);
    assert(res.body && res.body.success === false, 'success: false in body');
}

async function testLoginMissingFields() {
    console.log('\n[6] Login – missing fields');
    const res = await request('POST', '/api/auth/login', { email: TEST_EMAIL });
    assert(res.status === 400, `Missing password returns 400 (got ${res.status})`);
}

async function testLogout(tokenCookie) {
    console.log('\n[7] Logout – revokes Redis session');
    const res = await request('POST', '/api/auth/logout', null, tokenCookie);
    assert(res.status === 200, `POST /api/auth/logout returns 200 (got ${res.status})`);
    assert(res.body && res.body.success === true, 'success: true in body');

    // Session revoked – same cookie must now fail
    const authRes = await request('GET', '/api/auth/isauthenticated', null, tokenCookie);
    assert(authRes.status === 401, `After logout, same token returns 401 (got ${authRes.status})`);
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

(async () => {
    console.log(`\nSmoke tests against ${BASE_URL}\n${'─'.repeat(50)}`);
    try {
        await testHealthCheck();
        await testRegister();
        const tokenCookie = await testLoginSuccess();
        if (tokenCookie) {
            await testIsAuthenticated(tokenCookie);
            await testLogout(tokenCookie);
        }
        await testLoginWrongPassword();
        await testLoginMissingFields();
    } catch (err) {
        console.error('\nUnexpected error:', err.message);
        failed++;
    }

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Results: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
})();
