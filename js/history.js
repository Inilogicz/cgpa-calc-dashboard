// history.js
import { auth, db } from '/firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Fetch CGPA history for the logged-in user
        await fetchCGPAHistory(user.uid);
    } else {
        console.log('No user is signed in.');
        alert('Please log in to access your history.');
        window.location.href = 'login.html'; // Redirect to login if not logged in
    }
});

// Function to fetch and display CGPA history
async function fetchCGPAHistory(userId) {
    try {
        const cgpaHistoryRef = collection(db, "users", userId, "cgpaHistory");
        const snapshot = await getDocs(cgpaHistoryRef);

        const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
        historyTable.innerHTML = ''; // Clear loading message

        if (snapshot.empty) {
            historyTable.innerHTML = '<tr><td colspan="3">No CGPA history available.</td></tr>';
            return;
        }

        // Populate history table
        snapshot.forEach(doc => {
            const data = doc.data();
            const newRow = historyTable.insertRow();

            newRow.insertCell(0).innerText = data.cgpa;
            newRow.insertCell(1).innerText = new Date(data.timestamp.toDate()).toLocaleString();
            newRow.insertCell(2).innerText = data.semester;
        });

    } catch (error) {
        console.error("Error fetching CGPA history:", error);
        alert('Failed to load CGPA history. Please try again later.');
    }
}
