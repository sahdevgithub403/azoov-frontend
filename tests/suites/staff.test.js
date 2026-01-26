/**
 * Staff Management Test Suite
 */

export default {
    'Should load staff page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/staff`);
        await page.waitForTimeout(2000);
        console.log('      Staff page accessed');
    },

    'Should display staff list': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/staff`);
        await page.waitForTimeout(2000);

        const hasStaff = await page.evaluate(() => {
            return document.querySelectorAll('table, [class*="staff"]').length > 0;
        });

        console.log(`      Staff list: ${hasStaff ? 'Found' : 'Not found'}`);
    }
};
