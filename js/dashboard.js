    // dashboard.js
    import { auth, db } from '/firebase-config.js';
    import { doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

    // Listen for authentication state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById('name').innerText = `Name: ${userData.name}`;
                document.getElementById('matriculation-number').innerText = `Matriculation Number: ${userData.matriculationNumber}`;
                document.getElementById('department').innerText = `Department: ${userData.department}`;
                document.getElementById('session').innerText = `Session: ${userData.session}`;
                
                // Fetch and display CGPA history
                await fetchCGPAHistory(user.uid);
            } else {
                console.error('No such user document!');
                alert('User document not found. Please sign up again.');
            }
        } else {
            console.log('No user is signed in.');
            alert('Please log in to access the dashboard.');
            window.location.href = 'login.html'; 
        }
    });

    // Function to fetch CGPA history and update the chart
    async function fetchCGPAHistory(userId) {
        try {
            const cgpaHistoryRef = collection(db, "users", userId, "cgpaHistory");
            const snapshot = await getDocs(cgpaHistoryRef);
            
            if (snapshot.empty) {
                console.log("No CGPA history found.");
                document.getElementById('historyList').innerHTML = '<p>No CGPA history available.</p>';
                document.getElementById('chartContainer').style.display = 'none'; // Hide chart container
                return;
            } else {
                document.getElementById('chartContainer').style.display = 'block'; // Show chart container
            }
    
            // Aggregate CGPA values by semester
            const semesterCGPA = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                const semester = data.semester;
                const cgpa = data.cgpa;
    
                // Store each CGPA by semester
                if (!semesterCGPA[semester]) {
                    semesterCGPA[semester] = [];
                }
                semesterCGPA[semester].push(cgpa);
            });
    
            // Prepare data for chart
            const labels = Object.keys(semesterCGPA);
            const cgpaValues = labels.map(semester => {
                const values = semesterCGPA[semester];
                return values.reduce((acc, curr) => acc + curr, 0) / values.length; // Average CGPA for the semester
            });
    
            // Update chart with fetched data
            await updateChart(labels, cgpaValues);
    
            // Display the fetched data in the history table
            let historyHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                historyHTML += `
                    <tr>
                        <td>${data.cgpa}</td>
                        <td>${new Date(data.timestamp.toDate()).toLocaleString()}</td>
                        <td>${data.semester}</td>
                    </tr>`;
            });
            document.getElementById('historyList').innerHTML = historyHTML;
    
        } catch (error) {
            console.error("Error fetching CGPA history:", error);
        }
    }
    

    // Initialize a variable to hold the chart instance
    let performanceChart;

    // Function to update the chart
    async function updateChart(labels, cgpaValues) {
        const ctx = document.getElementById('performanceChart').getContext('2d');

        // Destroy the previous chart instance if it exists
        if (performanceChart) {
            performanceChart.destroy();  // Ensure the previous chart is destroyed
        }

        // Create a new chart instance
        performanceChart = new Chart(ctx, {
            type: 'line', // Change to 'line' to show trends over semesters
            data: {
                labels: labels,
                datasets: [{
                    label: 'CGPA Over Semesters',
                    data: cgpaValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CGPA'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semester'
                        }
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }

    // Logout functionality
    document.getElementById('logout-button').addEventListener('click', async () => {
        try {
            await auth.signOut();
            console.log('User logged out');
            window.location.href = 'index.html'; // Redirect to login after logout
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    }); 