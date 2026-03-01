// TO BACKEND DEVELOPER: All localStorage logic needs to be replaced with API fetch calls.
const API_BASE_URL = '';

/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Active Navigation Link Highlighting
    const currentLocation = location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');

    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (currentLocation === itemHref || (currentLocation === '' && itemHref === 'index.html')) {
            item.classList.add('active');
        }
    });

    // File Upload Handling
    const fileInput = document.getElementById('exam-file');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadWrapper = document.querySelector('.file-upload-wrapper');

    if (fileInput && fileNameDisplay && uploadWrapper) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = `Selected: ${e.target.files[0].name}`;
                uploadWrapper.style.borderColor = 'var(--primary-green)';
                uploadWrapper.style.backgroundColor = 'rgba(46, 204, 113, 0.05)';
            } else {
                fileNameDisplay.textContent = 'Drag and drop your file here or click to browse';
                uploadWrapper.style.borderColor = '#ccc';
                uploadWrapper.style.backgroundColor = '#fafbfc';
            }
        });

        uploadWrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadWrapper.classList.add('dragover');
        });

        uploadWrapper.addEventListener('dragleave', () => {
            uploadWrapper.classList.remove('dragover');
        });

        uploadWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadWrapper.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }

    // Google Login Toggle
    const loginBtn = document.getElementById('google-login-btn');
    if (loginBtn) {
        // Check if user is already logged in (using localStorage for demo)
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loginBtn.textContent = 'Sign Out';
            loginBtn.classList.replace('btn-outline', 'btn');
            loginBtn.style.backgroundColor = '#e74c3c';
            loginBtn.style.borderColor = '#e74c3c';
        }

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                localStorage.setItem('isLoggedIn', 'false');
                loginBtn.textContent = 'Google Login';
                loginBtn.classList.replace('btn', 'btn-outline');
                loginBtn.style.backgroundColor = 'transparent';
                loginBtn.style.borderColor = 'var(--primary-green)';
            } else {
                localStorage.setItem('isLoggedIn', 'true');
                loginBtn.textContent = 'Sign Out';
                loginBtn.classList.replace('btn-outline', 'btn');
                loginBtn.style.backgroundColor = '#e74c3c';
                loginBtn.style.borderColor = '#e74c3c';
            }
        });
    }

    // "I am Done" Buttons
    const doneButtons = document.querySelectorAll('.btn-done');
    doneButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const topic = e.target.getAttribute('data-topic');
            let completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '[]');

            if (!completedTopics.includes(topic)) {
                completedTopics.push(topic);
                localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
            }

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    });

    // Dashboard Initialization
    if (window.location.pathname.includes('dashboard.html')) {
        // Load Profile Data
        const profileName = document.getElementById('profile-name');
        const profilePhone = document.getElementById('profile-phone');
        const profileInitial = document.getElementById('profile-initial');

        const storedName = localStorage.getItem('userName') || 'SUNKAVALLI CHARAN RAM';
        const storedPhone = localStorage.getItem('userPhone') || '+917893140112';

        if (profileName) profileName.textContent = storedName.toUpperCase();
        if (profilePhone) profilePhone.textContent = storedPhone;
        if (profileInitial) profileInitial.textContent = storedName.charAt(0).toUpperCase();

        // Load Completed Topics
        const completedList = document.getElementById('completed-topics-list');
        if (completedList) {
            let completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '[]');

            if (completedTopics.length > 0) {
                completedList.innerHTML = ''; // Clear empty message
                completedTopics.forEach(topic => {
                    const li = document.createElement('li');
                    li.className = 'activity-item';
                    li.innerHTML = `
                        <div style="color: #3498db; font-size: 1.2rem; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="activity-text">
                            <p><strong>Completed:</strong> ${topic}</p>
                            <small>Just now</small>
                        </div>
                    `;
                    completedList.appendChild(li);
                });
            }
        }

        // Initialize Charts if Chart.js is present
        if (typeof Chart !== 'undefined') {
            // Donut Chart
            const donutCtx = document.getElementById('donutChart');
            if (donutCtx) {
                new Chart(donutCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Pending', 'In Progress'],
                        datasets: [{
                            data: [18, 5, 2],
                            backgroundColor: ['#2ecc71', '#f1c40f', '#3498db'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }

            // Bar Chart
            const barCtx = document.getElementById('barChart');
            if (barCtx) {
                new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Hours Studied',
                            data: [2, 3.5, 1.5, 4, 2, 5, 3],
                            backgroundColor: '#2c3e50',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        }
    }

    // Global Header Sync & Auth Logic
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authBtns = document.querySelectorAll('.logout-btn');

    if (isLoggedIn === 'true') {
        authBtns.forEach(btn => {
            btn.textContent = 'Logout';
            btn.href = '#';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = 'index.html';
            });
        });
    } else {
        authBtns.forEach(btn => {
            btn.textContent = 'Login';
            btn.href = 'signin.html';
        });
    }

    // Upload to Results Flow
    const uploadForm = document.querySelector('.upload-card form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = uploadForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI is mapping your syllabus to GATE 2026...';
            submitBtn.style.opacity = '0.8';
            submitBtn.style.cursor = 'not-allowed';

            setTimeout(() => {
                window.location.href = 'results.html';
            }, 3000);
        });
    }

    // Interactive Results
    const downloadPlanBtn = document.getElementById('download-plan-btn');
    if (downloadPlanBtn) {
        downloadPlanBtn.addEventListener('click', () => {
            alert('Your GATE Bridge Plan has been generated!');
        });
    }

    // Functional Delete
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                localStorage.clear();
                window.location.href = 'signin.html';
            }
        });
    }

    // Sign In Logic
    const signinForm = document.getElementById('signin-form');
    const phoneInput = document.getElementById('signin-phone');
    const phoneFeedback = document.getElementById('phone-feedback');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            const phonePattern = /^[6-9]\d{9}$/;

            if (phonePattern.test(val)) {
                phoneInput.style.borderColor = 'var(--primary-green)';
                phoneInput.style.boxShadow = '0 0 0 3px rgba(46, 204, 113, 0.2)';
                if (phoneFeedback) phoneFeedback.style.display = 'block';
            } else {
                phoneInput.style.borderColor = '#ddd';
                phoneInput.style.boxShadow = 'none';
                if (phoneFeedback) phoneFeedback.style.display = 'none';
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signin-name').value.trim();
            const email = document.getElementById('signin-email').value.trim();
            const phone = document.getElementById('signin-phone').value.trim();

            // Strict Validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phonePattern = /^[6-9]\d{9}$/; // Indian 10-digit format starting with 6,7,8,9

            if (!emailPattern.test(email)) {
                alert('Please enter a valid Email address.');
                return;
            }

            if (!phonePattern.test(phone)) {
                alert('Please enter a valid 10-digit Indian mobile number.');
                return;
            }

            const existingPhone = localStorage.getItem('userPhone');
            const existingEmail = localStorage.getItem('userEmail');

            // Unique Identity Rule
            if (existingPhone && existingPhone === '+91' + phone && existingEmail && existingEmail !== email) {
                alert(`This phone number (${phone}) is already registered with a different email address.`);
                return;
            }

            // Save details
            // BACKEND INTEGRATION POINT: Send POST request to /api/auth/login or /api/auth/register here with { name, email, phone }
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', '+91' + phone);
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect
            window.location.href = 'dashboard.html';
        });
    }

});
