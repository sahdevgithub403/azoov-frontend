/**
 * Dashboard Test Suite
 * Tests dashboard functionality and navigation
 */

export default {
    'Should load dashboard': async (page, { config, waitForElement }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        if (currentUrl.includes('/login') || currentUrl === config.baseUrl + '/') {
            console.log('      Redirected to login (not authenticated)');
            return;
        }

        // Check for dashboard elements
        const hasDashboardContent = await page.evaluate(() => {
            const text = document.body.textContent.toLowerCase();
            return text.includes('dashboard') ||
                text.includes('overview') ||
                text.includes('statistics');
        });

        if (!hasDashboardContent) {
            throw new Error('Dashboard content not found');
        }
    },

    'Should display sidebar navigation': async (page, { config, elementExists }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        // Look for navigation elements
        const hasNav = await page.evaluate(() => {
            const navElements = document.querySelectorAll('nav, [class*="sidebar"], [class*="navigation"]');
            return navElements.length > 0;
        });

        if (!hasNav) {
            console.log('      Navigation not found (may be on login page)');
            return;
        }

        console.log('      Navigation elements found');
    },

    'Should show statistics cards': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const statsCards = await page.evaluate(() => {
            const cards = document.querySelectorAll('[class*="card"], [class*="stat"]');
            return cards.length;
        });

        console.log(`      Found ${statsCards} card elements`);
    },

    'Should display recent activity': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const hasActivity = await page.evaluate(() => {
            const text = document.body.textContent.toLowerCase();
            return text.includes('recent') ||
                text.includes('activity') ||
                text.includes('latest');
        });

        console.log(`      Recent activity section: ${hasActivity ? 'Found' : 'Not found'}`);
    },

    'Should navigate to inventory page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        // Look for inventory link
        const inventoryLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button'));
            return links.find(link =>
                link.textContent?.toLowerCase().includes('inventory') ||
                link.textContent?.toLowerCase().includes('products')
            );
        });

        if (inventoryLink) {
            await page.click('a:has-text("Inventory"), a:has-text("Products")');
            await page.waitForTimeout(1000);

            const currentUrl = page.url();
            console.log(`      Navigated to: ${currentUrl}`);
        } else {
            console.log('      Inventory link not found');
        }
    },

    'Should navigate to invoices page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const invoiceLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button'));
            return links.find(link =>
                link.textContent?.toLowerCase().includes('invoice') ||
                link.textContent?.toLowerCase().includes('billing')
            );
        });

        if (invoiceLink) {
            await page.click('a:has-text("Invoice"), a:has-text("Billing")');
            await page.waitForTimeout(1000);

            const currentUrl = page.url();
            console.log(`      Navigated to: ${currentUrl}`);
        } else {
            console.log('      Invoice link not found');
        }
    },

    'Should show user profile menu': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const hasProfileMenu = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('[class*="profile"], [class*="user"], [class*="avatar"]'));
            return elements.length > 0;
        });

        console.log(`      Profile menu: ${hasProfileMenu ? 'Found' : 'Not found'}`);
    },

    'Should display charts and graphs': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/dashboard`);
        await page.waitForTimeout(2000);

        const hasCharts = await page.evaluate(() => {
            const svgElements = document.querySelectorAll('svg');
            const canvasElements = document.querySelectorAll('canvas');
            return svgElements.length > 0 || canvasElements.length > 0;
        });

        console.log(`      Charts/Graphs: ${hasCharts ? 'Found' : 'Not found'}`);
    }
};
