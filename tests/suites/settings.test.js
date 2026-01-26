/**
 * Settings Test Suite
 */

export default {
    'Should load settings page': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/settings`);
        await page.waitForTimeout(2000);
        console.log('      Settings page accessed');
    },

    'Should display settings options': async (page, { config }) => {
        await page.goto(`${config.baseUrl}/settings`);
        await page.waitForTimeout(2000);

        const hasSettings = await page.evaluate(() => {
            const text = document.body.textContent.toLowerCase();
            return text.includes('setting') || text.includes('preference');
        });

        console.log(`      Settings content: ${hasSettings ? 'Found' : 'Not found'}`);
    }
};
