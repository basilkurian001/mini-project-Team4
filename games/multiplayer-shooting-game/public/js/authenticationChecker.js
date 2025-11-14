// auth-check.js

const AUTH_CHECK_URL = 'http://10.57.207.31/gamehub/backend/login_server_validation.php';
//const AUTH_CHECK_URL = '../../backend/login_server_validation.php'; // Your existing auth endpoint

// Check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch(`${AUTH_CHECK_URL}?action=checkAuth`, {
            method: 'GET',
            credentials: 'include' // Important for sending session cookies
        });
        
        const result = await response.json();
        
        if (result.authenticated) {
            return {
                isLoggedIn: true,
                user: result.user
            };
        } else {
            return {
                isLoggedIn: false,
                user: null
            };
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        return {
            isLoggedIn: false,
            user: null,
            error: error.message
        };
    }
}

/* if (authStatus.isLoggedIn) {
        showLoggedInState(authStatus.user);
    } else {
        showLoggedOutState();
    } */

