/**
 * TestSprite Test Runner
 * Main entry point for running automated tests
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import test suites
import authTests from './suites/authentication.test.js';
import dashboardTests from './suites/dashboard.test.js';
import inventoryTests from './suites/inventory.test.js';
import invoiceTests from './suites/invoice.test.js';
import customerTests from './suites/customer.test.js';
import staffTests from './suites/staff.test.js';
import settingsTests from './suites/settings.test.js';
import websocketTests from './suites/websocket.test.js';
import roleAccessTests from './suites/role-access.test.js';

// Test configuration
const config = {
    baseUrl: 'http://localhost:5173',
    apiUrl: 'http://localhost:8081',
    headless: false,
    slowMo: 100,
    timeout: 30000
};

// Test suites registry
const testSuites = {
    authentication: authTests,
    dashboard: dashboardTests,
    inventory: inventoryTests,
    invoices: invoiceTests,
    customers: customerTests,
    staff: staffTests,
    settings: settingsTests,
    websocket: websocketTests,
    roleAccess: roleAccessTests
};

// Create results directory
const resultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

// Test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failedTestDetails = [];

// Helper function to take screenshot
async function takeScreenshot(page, name) {
    const screenshotPath = path.join(resultsDir, 'screenshots', `${name}-${Date.now()}.png`);
    const screenshotDir = path.dirname(screenshotPath);

    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
}

// Helper function to wait for element
async function waitForElement(page, selector, timeout = 10000) {
    try {
        await page.waitForSelector(selector, { timeout });
        return true;
    } catch (error) {
        return false;
    }
}

// Helper function to check if element exists
async function elementExists(page, selector) {
    try {
        const element = await page.$(selector);
        return element !== null;
    } catch (error) {
        return false;
    }
}

// Test utilities
const testUtils = {
    takeScreenshot,
    waitForElement,
    elementExists,
    config
};

// Run a single test
async function runTest(browser, testName, testFn) {
    console.log(`  ⏳ Running: ${testName}`);
    totalTests++;

    const page = await browser.newPage();

    try {
        await testFn(page, testUtils);
        passedTests++;
        console.log(`  ✅ PASSED: ${testName}`);
        return true;
    } catch (error) {
        failedTests++;
        failedTestDetails.push({ name: testName, error: error.message });
        console.log(`  ❌ FAILED: ${testName}`);
        console.log(`     Error: ${error.message}`);

        // Take screenshot on failure
        try {
            const screenshotPath = await takeScreenshot(page, `failed-${testName.replace(/\s+/g, '-')}`);
            console.log(`     Screenshot: ${screenshotPath}`);
        } catch (screenshotError) {
            console.log(`     Could not take screenshot: ${screenshotError.message}`);
        }

        return false;
    } finally {
        await page.close();
    }
}

// Run a test suite
async function runTestSuite(browser, suiteName, tests) {
    console.log(`\n📦 Test Suite: ${suiteName}`);
    console.log('─'.repeat(50));

    for (const [testName, testFn] of Object.entries(tests)) {
        await runTest(browser, testName, testFn);
    }
}

// Main test runner
async function runTests() {
    console.log('\n🚀 Starting TestSprite Test Runner');
    console.log('═'.repeat(50));

    // Parse command line arguments
    const args = process.argv.slice(2);
    const suiteArg = args.find(arg => arg.startsWith('--suite='));
    const runAll = args.includes('--all');

    let suitesToRun = [];

    if (suiteArg) {
        const suiteName = suiteArg.split('=')[1];
        if (testSuites[suiteName]) {
            suitesToRun = [{ name: suiteName, tests: testSuites[suiteName] }];
        } else {
            console.error(`❌ Test suite "${suiteName}" not found`);
            process.exit(1);
        }
    } else if (runAll) {
        suitesToRun = Object.entries(testSuites).map(([name, tests]) => ({ name, tests }));
    } else {
        // Default: run authentication and dashboard tests
        suitesToRun = [
            { name: 'authentication', tests: testSuites.authentication },
            { name: 'dashboard', tests: testSuites.dashboard }
        ];
    }

    // Launch browser
    console.log('\n🌐 Launching browser...');
    const browser = await puppeteer.launch({
        headless: config.headless,
        slowMo: config.slowMo,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    try {
        // Run test suites
        for (const { name, tests } of suitesToRun) {
            await runTestSuite(browser, name, tests);
        }

        // Print summary
        console.log('\n' + '═'.repeat(50));
        console.log('📊 Test Summary');
        console.log('═'.repeat(50));
        console.log(`Total Tests:  ${totalTests}`);
        console.log(`✅ Passed:     ${passedTests}`);
        console.log(`❌ Failed:     ${failedTests}`);
        console.log(`Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0}%`);

        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            failedTestDetails.forEach(({ name, error }) => {
                console.log(`  - ${name}`);
                console.log(`    ${error}`);
            });
        }

        // Generate HTML report
        generateHtmlReport();

        console.log('\n✨ Test run completed!');
        console.log(`📁 Results saved to: ${resultsDir}`);

    } catch (error) {
        console.error('\n❌ Test runner error:', error);
    } finally {
        await browser.close();
    }

    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
}

// Generate HTML report
function generateHtmlReport() {
    const reportPath = path.join(resultsDir, 'report.html');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TestSprite Test Report - Azoov</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h3 {
      color: #6c757d;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .stat-card .value {
      font-size: 2.5em;
      font-weight: bold;
      color: #667eea;
    }
    .stat-card.passed .value { color: #28a745; }
    .stat-card.failed .value { color: #dc3545; }
    .details {
      padding: 40px;
    }
    .test-group {
      margin-bottom: 30px;
    }
    .test-group h2 {
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }
    .test-item {
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .test-item.passed {
      background: #d4edda;
      border-left: 4px solid #28a745;
    }
    .test-item.failed {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    .test-item .icon {
      font-size: 1.5em;
    }
    .test-item .name {
      flex: 1;
      font-weight: 500;
    }
    .test-item .error {
      font-size: 0.9em;
      color: #721c24;
      margin-top: 5px;
      font-family: monospace;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #6c757d;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 TestSprite Test Report</h1>
      <p>Azoov Full Stack Application</p>
      <p>${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="value">${totalTests}</div>
      </div>
      <div class="stat-card passed">
        <h3>Passed</h3>
        <div class="value">${passedTests}</div>
      </div>
      <div class="stat-card failed">
        <h3>Failed</h3>
        <div class="value">${failedTests}</div>
      </div>
      <div class="stat-card">
        <h3>Success Rate</h3>
        <div class="value">${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%</div>
      </div>
    </div>
    
    <div class="details">
      <div class="test-group">
        <h2>Test Results</h2>
        ${failedTestDetails.length === 0 ?
            '<div class="test-item passed"><span class="icon">✅</span><span class="name">All tests passed!</span></div>' :
            failedTestDetails.map(({ name, error }) => `
            <div class="test-item failed">
              <span class="icon">❌</span>
              <div>
                <div class="name">${name}</div>
                <div class="error">${error}</div>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
    
    <div class="footer">
      Generated by TestSprite Test Runner
    </div>
  </div>
</body>
</html>
  `;

    fs.writeFileSync(reportPath, html);
}

// Run tests
runTests();
