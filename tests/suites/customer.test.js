/**
 * Customer Test Suite
 */

export default {
    'Should load customers page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/customers`);
        await page.waitForTimeout(2000);
        console.log('      Customers page accessed');
    },

    'Should display customer list': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/customers`);
        await page.waitForTimeout(2000);

        const hasCustomers = await page.evaluate(() => {
            return document.querySelectorAll('table, [class*="customer"]').length > 0;
        });

        console.log(`      Customer list: ${hasCustomers ? 'Found' : 'Not found'}`);
    }
};
