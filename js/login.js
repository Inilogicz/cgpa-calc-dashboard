// login.js
import { auth } from '/firebase-config.js'; // Ensure path is correct
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// Ensure the DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    
    if (loginForm) { // Check if the form exists
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User logged in successfully');
                window.location.href = 'dashboard.html'; // Redirect to dashboard after login
            } catch (error) {
                console.error('Error during login:', error.message);
            }
        });
    } else {
        console.error('Login form not found!');
    }
});
