// Import Firebase configuration and functions
import { firebaseConfig, db, auth, onAuthStateChanged } from '/firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

// Initialize Firebase (optional since it's done in firebase-config.js, but can be kept for clarity)
const app = initializeApp(firebaseConfig); // This line can also be removed if desired

// Variables to store subjects and grades
let subjects = [];

// Grade point values
const gradePoints = { "A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0 };

// Add subject to table
function addSubject() {
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    const unit = parseInt(document.getElementById('unit').value);

    if (!subject || !grade || !unit) {
        document.getElementById('inputError').textContent = "Please fill all fields correctly.";
        return;
    }

    subjects.push({ subject, grade, unit });
    displaySubjects();
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

    const cgpa = totalUnits ? (totalPoints / totalUnits).toFixed(2) : "0.00";
    document.getElementById('cgpa').textContent = cgpa;

    // Show download and print buttons if CGPA calculated
    document.getElementById('downloadButton').style.display = 'block';
    document.getElementById('printButton').style.display = 'block';

    saveHistory(cgpa); // Save CGPA to Firestore
}

// Save CGPA calculation to Firestore
async function saveHistory(cgpa) {
    const user = auth.currentUser;
    if (user) {
        try {
            await addDoc(collection(db, "users", user.uid, "cgpaHistory"), {
                subjects,
                cgpa,
                timestamp: new Date()
            });
            alert("CGPA record saved successfully!");
        } catch (error) {
            // Log error message and display alert
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
}

// Download CGPA report
function downloadCGPA() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("CGPA Report", 10, 10);
    subjects.forEach((item, i) => {
        doc.text(`${i + 1}. ${item.subject} - ${item.grade} (${item.unit} units)`, 10, 20 + i * 10);
    });
    doc.text(`CGPA: ${document.getElementById('cgpa').textContent}`, 10, 20 + subjects.length * 10);
    doc.save("CGPA_Report.pdf");
}

// Navigation functions
function goToDashboard() {
    window.location.href = "dashboard.html";
}

function viewHistory() {
    window.location.href = "history.html";
}

function logout() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

// Ensure user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("Please log in to access the calculator.");
        window.location.href = "login.html";
    }
});

// Make functions accessible globally
window.addSubject = addSubject;
window.removeSubject = removeSubject;
window.resetForm = resetForm;
window.downloadCGPA = downloadCGPA;
window.goToDashboard = goToDashboard;
window.viewHistory = viewHistory;
window.logout = logout;
window.calculateCGPA = calculateCGPA; // Expose calculateCGPA to global scope
