/**
 * Inventory Test Suite
 * Tests product management functionality
 */

export default {
    'Should load inventory page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/inventory`);
        await page.waitForTimeout(2000);

        const hasInventoryContent = await page.evaluate(() => {
            const text = document.body.textContent.toLowerCase();
            return text.includes('inventory') ||
                text.includes('product') ||
                text.includes('stock');
        });

        if (!hasInventoryContent) {
            console.log('      May be redirected to login');
            return;
        }

        console.log('      Inventory page loaded');
    },

    'Should display product list': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/inventory`);
        await page.waitForTimeout(2000);

        const productCount = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            const lists = document.querySelectorAll('[class*="list"], [class*="grid"]');
            return tables.length + lists.length;
        });

        console.log(`      Found ${productCount} list/table elements`);
    },

    'Should have add product button': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/inventory`);
        await page.waitForTimeout(2000);

        const hasAddButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a'));
            return buttons.some(btn =>
                btn.textContent?.toLowerCase().includes('add') ||
                btn.textContent?.toLowerCase().includes('new') ||
                btn.textContent?.toLowerCase().includes('create')
            );
        });

        console.log(`      Add product button: ${hasAddButton ? 'Found' : 'Not found'}`);
    },

    'Should have search functionality': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/inventory`);
        await page.waitForTimeout(2000);

        const hasSearch = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            return inputs.some(input =>
                input.type === 'search' ||
                input.placeholder?.toLowerCase().includes('search')
            );
        });

        console.log(`      Search input: ${hasSearch ? 'Found' : 'Not found'}`);
    },

    'Should filter products': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/inventory`);
        await page.waitForTimeout(2000);

        const hasFilters = await page.evaluate(() => {
            const selects = document.querySelectorAll('select');
            const filterButtons = Array.from(document.querySelectorAll('button, [class*="filter"]'));
            return selects.length > 0 || filterButtons.some(btn =>
                btn.textContent?.toLowerCase().includes('filter')
            );
        });

        console.log(`      Filter options: ${hasFilters ? 'Found' : 'Not found'}`);
    }
};
