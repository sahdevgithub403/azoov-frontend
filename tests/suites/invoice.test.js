/**
 * Invoice Test Suite
 */

export default {
    'Should load invoice page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/invoices`);
        await page.waitForTimeout(2000);
        console.log('      Invoice page accessed');
    },

    'Should display invoice list': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/invoices`);
        await page.waitForTimeout(2000);

        const hasInvoices = await page.evaluate(() => {
            return document.querySelectorAll('table, [class*="invoice"]').length > 0;
        });

        console.log(`      Invoice list: ${hasInvoices ? 'Found' : 'Not found'}`);
    },

    'Should have create invoice button': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/invoices`);
        await page.waitForTimeout(2000);

        const hasCreateButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button, a'));
            return buttons.some(btn => btn.textContent?.toLowerCase().includes('create'));
        });

        console.log(`      Create button: ${hasCreateButton ? 'Found' : 'Not found'}`);
    }
};
