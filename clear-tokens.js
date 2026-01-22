/**
 * JWT Token Cleanup Script
 * 
 * Run this in your browser's console to clear all authentication tokens
 * and force a fresh login.
 * 
 * HOW TO USE:
 * 1. Open your frontend application in the browser
 * 2. Press F12 to open Developer Tools
 * 3. Go to the "Console" tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. Refresh the page
 */

(function clearAuthTokens() {
    console.log('🧹 Clearing authentication tokens...');

    // Clear localStorage
    const localStorageKeys = Object.keys(localStorage);
    let clearedCount = 0;

    localStorageKeys.forEach(key => {
        if (key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('user') ||
            key.toLowerCase().includes('auth')) {
            console.log(`  ❌ Removing from localStorage: ${key}`);
            localStorage.removeItem(key);
            clearedCount++;
        }
    });

    // Clear sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage);

    sessionStorageKeys.forEach(key => {
        if (key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('user') ||
            key.toLowerCase().includes('auth')) {
            console.log(`  ❌ Removing from sessionStorage: ${key}`);
            sessionStorage.removeItem(key);
            clearedCount++;
        }
    });

    console.log(`✅ Cleared ${clearedCount} authentication-related items`);
    console.log('🔄 Please refresh the page or navigate to /login');

    // Optionally redirect to login
    const shouldRedirect = confirm('Tokens cleared! Redirect to login page now?');
    if (shouldRedirect) {
        window.location.href = '/login';
    }
})();
