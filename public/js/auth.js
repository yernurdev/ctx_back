// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Mock Login Logic
            // In a real app, you would validate credentials with Firebase Auth here.
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                // Simulate successful login
                console.log(`Logged in as ${email}`);

                // Redirect to calculator
                window.location.href = '/calculator';
            } else {
                alert('Please enter email and password.');
            }
        });
    }
});
