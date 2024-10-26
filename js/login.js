// login.js
import { auth } from '/firebase-config.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const resetPasswordLink = document.getElementById('reset-password');

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Sign in the user
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful!');
        window.location.href = 'dashboard.html'; // Redirect to dashboard on successful login
    } catch (error) {
        // Handle login errors
        errorMessage.innerText = error.message; // Display error message
        errorMessage.style.display = 'block'; // Show the error message
        console.error('Error logging in:', error);
    }
});

// Handle password reset
resetPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    const email = prompt('Please enter your email address for password reset:');

    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent! Please check your inbox.'); // Notify user
        } catch (error) {
            alert('Error sending password reset email: ' + error.message); // Notify error
            console.error('Error sending password reset email:', error);
        }
    } else {
        alert('Please enter a valid email address.'); // Notify if email is empty
    }
});
