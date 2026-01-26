# 🧪 TestSprite - Azoov Full Stack Testing Suite

Comprehensive automated testing for the Azoov ERP application using Puppeteer-based browser automation.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Test Results](#test-results)
- [Configuration](#configuration)
- [Writing New Tests](#writing-new-tests)

## 🎯 Overview

This testing suite provides end-to-end automated testing for the entire Azoov application, including:

- ✅ Authentication & Authorization
- ✅ Dashboard & Navigation
- ✅ Inventory Management
- ✅ Invoice Creation & Management
- ✅ Customer Management
- ✅ Staff Management
- ✅ Settings & Configuration
- ✅ WebSocket Real-time Features
- ✅ Role-Based Access Control

## 📦 Prerequisites

Before running tests, ensure you have:

1. **Node.js** (v16 or higher)
2. **Backend Server** running on `http://localhost:8081`
3. **Frontend Server** running on `http://localhost:5173`

## 🚀 Installation

1. Navigate to the frontend directory:
```bash
cd e:\Azoov\frontend
```

2. Install dependencies (including Puppeteer):
```bash
npm install
```

This will install all required packages including `puppeteer` for browser automation.

## ▶️ Running Tests

### Run Default Tests (Authentication + Dashboard)
```bash
npm test
```

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Suite
```bash
npm run test:auth        # Authentication tests only
npm run test:dashboard   # Dashboard tests only
```

### Run Custom Suite
```bash
node tests/run-tests.js --suite=inventory
node tests/run-tests.js --suite=invoices
node tests/run-tests.js --suite=customers
node tests/run-tests.js --suite=staff
node tests/run-tests.js --suite=settings
node tests/run-tests.js --suite=websocket
node tests/run-tests.js --suite=roleAccess
```

## 📊 Test Suites

### 1. Authentication Suite (`authentication.test.js`)
- ✅ Login page loading
- ✅ Phone number validation
- ✅ OTP sending
- ✅ OTP verification
- ✅ JWT token storage
- ✅ Logout functionality

### 2. Dashboard Suite (`dashboard.test.js`)
- ✅ Dashboard loading
- ✅ Sidebar navigation
- ✅ Statistics cards display
- ✅ Recent activity
- ✅ Page navigation
- ✅ Charts and graphs

### 3. Inventory Suite (`inventory.test.js`)
- ✅ Product list display
- ✅ Add product functionality
- ✅ Search functionality
- ✅ Product filtering

### 4. Invoice Suite (`invoice.test.js`)
- ✅ Invoice list display
- ✅ Create invoice button
- ✅ Invoice details

### 5. Customer Suite (`customer.test.js`)
- ✅ Customer list display
- ✅ Customer management

### 6. Staff Suite (`staff.test.js`)
- ✅ Staff list display
- ✅ Staff management

### 7. Settings Suite (`settings.test.js`)
- ✅ Settings page loading
- ✅ Configuration options

### 8. WebSocket Suite (`websocket.test.js`)
- ✅ WebSocket connection
- ✅ Real-time updates

### 9. Role Access Suite (`role-access.test.js`)
- ✅ Admin route restrictions
- ✅ Role-based menu items
- ✅ Permission enforcement

## 📈 Test Results

After running tests, you'll find results in the `test-results` directory:

### Console Output
```
🚀 Starting TestSprite Test Runner
══════════════════════════════════════════════════

📦 Test Suite: authentication
──────────────────────────────────────────────────
  ✅ PASSED: Should load login page
  ✅ PASSED: Should show phone input field
  ✅ PASSED: Should validate phone number format
  ...

📊 Test Summary
══════════════════════════════════════════════════
Total Tests:  25
✅ Passed:     23
❌ Failed:     2
Success Rate: 92.00%
```

### HTML Report
Open `test-results/report.html` in your browser for a beautiful, detailed report with:
- Test statistics
- Pass/fail breakdown
- Error details
- Timestamps

### Screenshots
Failed tests automatically capture screenshots saved in:
```
test-results/screenshots/
```

## ⚙️ Configuration

Edit `testsprite.config.js` to customize:

```javascript
{
  baseUrl: 'http://localhost:5173',  // Frontend URL
  apiUrl: 'http://localhost:8081',   // Backend URL
  browser: {
    headless: false,                 // Set true for CI/CD
    viewport: { width: 1920, height: 1080 }
  },
  testTimeout: 30000,
  screenshots: {
    onFailure: true,
    path: './test-results/screenshots'
  }
}
```

## 📝 Writing New Tests

### Create a New Test Suite

1. Create a new file in `tests/suites/`:
```javascript
// tests/suites/my-feature.test.js
export default {
  'Test name': async (page, { config, waitForElement, elementExists }) => {
    await page.goto(`${config.baseUrl}/my-page`);
    await waitForElement(page, '.my-element');
    
    const exists = await elementExists(page, '.my-button');
    if (!exists) {
      throw new Error('Button not found');
    }
  }
};
```

2. Register it in `tests/run-tests.js`:
```javascript
import myFeatureTests from './suites/my-feature.test.js';

const testSuites = {
  // ... existing suites
  myFeature: myFeatureTests
};
```

3. Run your new suite:
```bash
node tests/run-tests.js --suite=myFeature
```

### Available Test Utilities

- `config` - Test configuration object
- `waitForElement(page, selector, timeout)` - Wait for element to appear
- `elementExists(page, selector)` - Check if element exists
- `takeScreenshot(page, name)` - Capture screenshot

### Page Methods (Puppeteer)

```javascript
await page.goto(url);                          // Navigate to URL
await page.click(selector);                    // Click element
await page.type(selector, text);               // Type text
await page.waitForTimeout(ms);                 // Wait for time
await page.waitForSelector(selector);          // Wait for element
await page.evaluate(() => { /* code */ });     // Run code in browser
```

## 🔧 Troubleshooting

### Tests Failing?

1. **Ensure servers are running:**
   ```bash
   # Terminal 1: Backend
   cd c:\Users\HP\Downloads\azoov-backend\azoov-backend
   mvn spring-boot:run
   
   # Terminal 2: Frontend
   cd e:\Azoov\frontend
   npm run dev
   ```

2. **Check URLs in config:**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8081`

3. **Clear browser data:**
   Tests use a fresh browser instance, but you can clear localStorage manually if needed.

4. **Increase timeouts:**
   Edit `testsprite.config.js` and increase `testTimeout` value.

### Puppeteer Installation Issues?

```bash
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

## 🎯 Best Practices

1. **Run backend and frontend before testing**
2. **Use descriptive test names**
3. **Keep tests independent** - Each test should work standalone
4. **Use appropriate waits** - Don't use arbitrary timeouts
5. **Check screenshots** on failures for debugging
6. **Update tests** when UI changes

## 📞 Support

For issues or questions:
1. Check the HTML report for detailed error messages
2. Review screenshots in `test-results/screenshots/`
3. Check console output for stack traces
4. Verify both servers are running

## 🎉 Happy Testing!

Your Azoov application is now equipped with comprehensive automated testing. Run tests regularly to ensure everything works perfectly!
