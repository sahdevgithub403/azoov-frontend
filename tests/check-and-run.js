/**
 * Server Status Checker and Test Launcher
 * Checks if backend and frontend are running before launching tests
 */

import http from 'http';
import { spawn } from 'child_process';

const BACKEND_URL = 'http://localhost:8081';
const FRONTEND_URL = 'http://localhost:5173';

// Color codes for terminal
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkServer(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: '/',
            method: 'GET',
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            resolve(true);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function checkServers() {
    log('\n========================================', 'cyan');
    log('   Azoov TestSprite - Server Check', 'cyan');
    log('========================================\n', 'cyan');

    log('[1/2] Checking Backend Server...', 'blue');
    const backendRunning = await checkServer(BACKEND_URL);

    if (backendRunning) {
        log('✓ Backend is running on http://localhost:8081', 'green');
    } else {
        log('✗ Backend is NOT running!', 'red');
        log('\nPlease start the backend server:', 'yellow');
        log('  cd c:\\Users\\HP\\Downloads\\azoov-backend\\azoov-backend', 'yellow');
        log('  mvn spring-boot:run\n', 'yellow');
        process.exit(1);
    }

    log('[2/2] Checking Frontend Server...', 'blue');
    const frontendRunning = await checkServer(FRONTEND_URL);

    if (frontendRunning) {
        log('✓ Frontend is running on http://localhost:5173', 'green');
    } else {
        log('✗ Frontend is NOT running!', 'red');
        log('\nPlease start the frontend server:', 'yellow');
        log('  cd e:\\Azoov\\frontend', 'yellow');
        log('  npm run dev\n', 'yellow');
        process.exit(1);
    }

    log('\n✓ All servers are running!', 'green');
    log('========================================\n', 'cyan');

    return true;
}

async function runTests() {
    const serversReady = await checkServers();

    if (!serversReady) {
        return;
    }

    log('Starting tests in 3 seconds...', 'blue');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get command line arguments
    const args = process.argv.slice(2);

    // Run the test runner
    const testProcess = spawn('node', ['tests/run-tests.js', ...args], {
        stdio: 'inherit',
        shell: true
    });

    testProcess.on('close', (code) => {
        if (code === 0) {
            log('\n✓ Tests completed successfully!', 'green');
        } else {
            log('\n✗ Some tests failed. Check the report for details.', 'yellow');
        }
        process.exit(code);
    });
}

runTests();
