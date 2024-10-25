// signup.js
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { auth, db } from '/firebase-config.js'; // Ensure this path is correct

const signupForm = document.querySelector('#signupForm');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get values from form fields
    const name = document.querySelector('#name').value;
    const matriculationNumber = document.querySelector('#matriculationNumber').value;
    const department = document.querySelector('#department').value;
    const session = document.querySelector('#session').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Signup successful:', user);

        // Store additional user info in Firestore
        const userRef = doc(db, 'users', user.uid); // Create a document in Firestore with the user's UID as the ID
        await setDoc(userRef, {
            name,
            matriculationNumber,
            department,
            session,
            email
        });

        console.log('User data saved to Firestore.');

        // Redirect to dashboard after signup
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error during signup:', error.message);
        alert(error.message); // Display error message to the user
    }
});
