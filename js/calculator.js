// Import Firebase configuration and functions
import { firebaseConfig, db, auth } from '/firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Variables to store subjects and grades
let subjects = [];

// Grade point values
const gradePoints = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0 };

// Add subject to table
function addSubject() {
    const subject = document.getElementById('subject').value.trim();
    const grade = document.getElementById('grade').value;
    const unit = parseInt(document.getElementById('unit').value, 10);

    if (!subject || !grade || !unit) {
        document.getElementById('inputError').textContent = "Please fill all fields correctly.";
        return;
    }

    subjects.push({ subject, grade, unit });
    displaySubjects();
    document.getElementById('inputError').textContent = ""; // Clear error message
}

// Display subjects in the table
function displaySubjects() {
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = '';
    subjects.forEach((item, index) => {
        subjectList.innerHTML += `
            <tr>
                <td>${item.subject}</td>
                <td>${item.grade}</td>
                <td>${item.unit}</td>
                <td><button onclick="removeSubject(${index})">Remove</button></td>
            </tr>`;
    });
}

// Calculate CGPA
function calculateCGPA() {
    let totalPoints = 0, totalUnits = 0;

    subjects.forEach(({ grade, unit }) => {
        totalPoints += gradePoints[grade] * unit;
        totalUnits += unit;
    });

    const cgpa = totalUnits ? Math.min((totalPoints / totalUnits).toFixed(2), 5.00) : "0.00"; // Ensure CGPA does not exceed 5.0
    document.getElementById('cgpa').textContent = cgpa;

    // Get selected semester from dropdown
    const semester = document.getElementById('semester').value;

    // Show download and print buttons if CGPA calculated
    document.getElementById('downloadButton').style.display = 'block';
    document.getElementById('printButton').style.display = 'block';

    saveHistory(cgpa, semester); // Pass semester to saveHistory function
    updateChart(cgpa); // Call to update the chart with the new CGPA
}

// Save CGPA calculation to Firestore
async function saveHistory(cgpa, semester) {
    const user = auth.currentUser;
    if (user) {
        try {
            await addDoc(collection(db, "users", user.uid, "cgpaHistory"), {
                subjects,
                cgpa,
                semester,
                timestamp: new Date()
            });
            alert("CGPA record saved successfully!");
        } catch (error) {
            console.error("Error saving CGPA history:", error);
            alert("Error saving CGPA history: " + error.message);
        }
    } else {
        console.error("User not authenticated");
        alert("User not authenticated. Please log in to save your CGPA.");
    }
}

// Remove subject from the list
function removeSubject(index) {
    subjects.splice(index, 1);
    displaySubjects();
}

// Reset the form and clear subjects
function resetForm() {
    subjects = [];
    document.getElementById('cgpaForm').reset();
    displaySubjects();
    document.getElementById('cgpa').textContent = "0.00";
    document.getElementById('downloadButton').style.display = 'none';
    document.getElementById('printButton').style.display = 'none';
}

// Download CGPA report
function downloadCGPA() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("CGPA Report", 10, 10);
    subjects.forEach((item, i) => {
        doc.text(`${i + 1}. ${item.subject} - Grade: ${item.grade} - Unit: ${item.unit}`, 10, 20 + (i * 10));
    });
    doc.text(`CGPA: ${document.getElementById('cgpa').textContent}`, 10, 20 + (subjects.length * 10) + 10);
    doc.save("cgpa_report.pdf");
}

// Update chart with CGPA
function updateChart(cgpa) {
    const ctx = document.getElementById('cgpaChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['CGPA'],
            datasets: [{
                label: 'Your CGPA',
                data: [cgpa],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 5
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5 // Maximum CGPA limit
                }
            }
        }
    });
}

// Logout function
function logout() {
    signOut(auth).then(() => {
        console.log("User signed out successfully.");
        window.location.href = 'index.html'; // Redirect to login page
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

// Navigation to dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html'; // Redirect to the dashboard
}

// Navigation to history
function viewHistory() {
    window.location.href = 'history.html'; // Redirect to history page
}

window.addSubject = addSubject;
window.removeSubject = removeSubject;
window.resetForm = resetForm;
window.downloadCGPA = downloadCGPA;
window.goToDashboard = goToDashboard;
window.viewHistory = viewHistory;
window.logout = logout;
window.calculateCGPA = calculateCGPA; 