// Global state
let books = [];
let isDarkMode = false;
let currentFilter = 'all';

// DOM Elements
const loader = document.getElementById('loader');
const loginModal = document.getElementById('loginModal');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const addBookModal = document.getElementById('addBookModal');
const booksTableBody = document.getElementById('booksTableBody');
const galleryGrid = document.getElementById('galleryGrid');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    simulateLoading();
    setupEventListeners();
});

// Simulate loading screen
function simulateLoading() {
    const progress = document.querySelector('.progress');
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 500);
        }
        progress.style.width = width + '%';
    }, 100);
}

// Event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });
}

// LOGIN
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const btn = e.target.querySelector('.login-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    // Loading
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    btn.disabled = true;

    try {
        const response = await fetch(`/login?username=${username}&password=${password}`, {
            method: 'POST'
        });

        const result = await response.text();

        if (result === 'success') {

            // ✅ STEP 1: SET ROLE
            let role = (username === "admin") ? "admin" : "student";
            localStorage.setItem("role", role);

            // ✅ STEP 2: HIDE LOGIN
            loginModal.classList.remove('active');

            setTimeout(() => {
                mainApp.classList.remove('hidden');
                mainApp.classList.add('show');

                // ✅ STEP 3: LOAD DATA
                loadDashboard();

                // ✅ STEP 4: HIDE ADMIN FEATURES
                if (role === "student") {
                    document.querySelectorAll(".admin-only").forEach(el => {
                        el.style.display = "none";
                    });
                }

                // ✅ STEP 5: SHOW ROLE IN UI
                let roleText = document.getElementById("roleText");
                if (roleText) {
                    roleText.innerText = role;
                }

            }, 300);

        } else {
            showToast('Invalid credentials! Please try again.', 'error');
        }

    } catch (error) {
        console.error('Login error:', error);
        showToast('Connection failed! Check your server.', 'error');
    } finally {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        btn.disabled = false;
    }
}
            // DASHBOARD
            async function loadDashboard() {
                try {
                    const stats = await fetch('/stats').then(r => r.json());
                    updateStats(stats);
                    await loadBooks();
                    createGallery();
                } catch (error) {
                    console.error('Dashboard load error:', error);
                    showToast('Failed to load dashboard data', 'error');
                }
            }

            function updateStats(stats) {
                document.getElementById('totalBooks').textContent = stats.total;
                document.getElementById('borrowedBooks').textContent = stats.borrowed;
                document.getElementById('availableBooks').textContent = stats.available;
                document.getElementById('overdueBooks').textContent = '12'; // Mock data
            }

            // BOOKS MANAGEMENT
            async function loadBooks(searchTerm = '') {
                try {
                    const url = searchTerm ? `/search?name=${searchTerm}` : '/books';
                    const response = await fetch(url);
                    books = await response.json();
                    renderBooksTable(books);
                    createGallery();
                } catch (error) {
                    console.error('Load books error:', error);
                    showToast('Failed to load books', 'error');
                }
            }

            function renderBooksTable(bookList) {
                const html = bookList.map(book => `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.name}</td>
                        <td>${book.author}</td>
                        <td>
                            <span class="status-badge ${book.borrowed ? 'status-borrowed' : 'status-available'}">
                                ${book.borrowed ? 'Borrowed' : 'Available'}
                            </span>
                        </td>
                        <td class="action-buttons">
                            ${!book.borrowed ?
                                `<button class="btn-small btn-borrow" onclick="borrowBook(${book.id})">
                                    <i class="fas fa-hand-holding"></i> Borrow
                                </button>` :
                                `<button class="btn-small btn-return" onclick="returnBook(${book.id})">
                                    <i class="fas fa-undo"></i> Return
                                </button>`
                            }
                            <button class="btn-small btn-delete admin-only" onclick="deleteBook(${book.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('');

                booksTableBody.innerHTML = html || `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 4rem; color: #94a3b8;">
                            <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                            No books found
                        </td>
                    </tr>
                `;
            }

            // BOOK ACTIONS
            async function borrowBook(id) {
                try {
                    const response = await fetch(`/borrow/${id}`);
                    const result = await response.text();
                    showToast(result, result.includes('✅') ? 'success' : 'error');
                    if (result.includes('✅')) {
                        await loadBooks();
                        loadStats();
                    }
                } catch (error) {
                    showToast('Failed to borrow book', 'error');
                }
            }

            async function returnBook(id) {
                try {
                    const response = await fetch(`/return/${id}`);
                    const result = await response.text();
                    showToast(result, result.includes('✅') ? 'success' : 'error');
                    if (result.includes('✅')) {
                        await loadBooks();
                        loadStats();
                    }
                } catch (error) {
                    showToast('Failed to return book', 'error');
                }
            }

            async function deleteBook(id) {
                if (!confirm('Are you sure you want to delete this book?')) return;

                try {
                    const response = await fetch(`/delete/${id}`, { method: 'DELETE' });
                    const result = await response.text();
                    showToast(result, result.includes('✅') ? 'success' : 'error');
                    if (result.includes('✅')) {
                        await loadBooks();
                        loadStats();
                    }
                } catch (error) {
                    showToast('Failed to delete book', 'error');
                }
            }

            async function handleAddBook(e) {
                e.preventDefault();
                const title = document.getElementById('bookTitle').value;
                const author = document.getElementById('bookAuthor').value;
                const genre = document.getElementById('bookGenre').value;

                try {
                    const response = await fetch(`/add?name=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
                    const result = await response.text();
                    showToast(result, 'success');
                    closeAddBookModal();
                    document.getElementById('addBookForm').reset();
                    await loadBooks();
                    loadStats();
                } catch (error) {
                    showToast('Failed to add book', 'error');
                }
            }

            // GALLERY
            function createGallery() {
                const html = books.slice(0, 12).map(book => `
                    <div class="book-card ${book.borrowed ? 'borrowed' : 'available'}" onclick="viewBookDetails(${book.id})">
                        <div class="book-status ${book.borrowed ? 'borrowed' : 'available'}"></div>
                        <h4>${book.name}</h4>
                        <p>by ${book.author}</p>
                        <div class="book-footer">
                            <span class="status ${book.borrowed ? 'borrowed' : 'available'}">
                                ${book.borrowed ? 'Borrowed' : 'Available'}
                            </span>
                        </div>
                    </div>
                `).join('');

                galleryGrid.innerHTML = html || `
                    <div class="empty-state">
                        <i class="fas fa-books"></i>
                        <h3>No books available</h3>
                        <p>Add some books to get started</p>
                        <button class="action-btn primary" onclick="showAddBookModal()">
                            Add First Book
                        </button>
                    </div>
                `;
            }

            function filterGallery(type) {
                currentFilter = type;
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                const filteredBooks = books.filter(book => {
                    if (type === 'all') return true;
                    if (type === 'available') return !book.borrowed;
                    if (type === 'borrowed') return book.borrowed;
                    return true;
                });

                renderGallery(filteredBooks);
            }

            function renderGallery(bookList) {
                galleryGrid.innerHTML = bookList.slice(0, 12).map(book => `
                    <div class="book-card ${book.borrowed ? 'borrowed' : 'available'}">
                        <h4>${book.name}</h4>
                        <p>by ${book.author}</p>
                    </div>
                `).join('');
            }

            // SEARCH & FILTER
            function globalSearch() {
                const term = document.getElementById('globalSearch').value;
                if (term.length > 2) {
                    loadBooks(term);
                } else if (!term) {
                    loadBooks();
                }
            }

            function filterBooks() {
                const term = document.getElementById('bookSearch').value;
                loadBooks(term);
            }

            // MODALS
            function showAddBookModal() {
                addBookModal.classList.add('active');
            }

            function closeAddBookModal() {
                addBookModal.classList.remove('active');
            }

            // NAVIGATION
            function switchSection(sectionId) {
                // Update nav active state
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                event.target.classList.add('active');

                // Switch content sections
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');

                // Load section data
                if (sectionId === 'books') loadBooks();
                if (sectionId === 'gallery') createGallery();
            }

            // UTILITIES
            async function loadStats() {
                try {
                    const stats = await fetch('/stats').then(r => r.json());
                    updateStats(stats);
                } catch (error) {
                    console.error('Stats error:', error);
                }
            }

            function togglePassword() {
                const passwordField = document.getElementById('password');
                const icon = document.querySelector('.toggle-password i');
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }

            function toggleTheme() {
                isDarkMode = !isDarkMode;
                document.body.classList.toggle('dark');
                const icon = document.querySelector('.theme-toggle i');
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
                localStorage.setItem('darkMode', isDarkMode);
            }

            function logout() {
                if (confirm('Are you sure you want to logout?')) {
                    mainApp.classList.remove('show');
                    mainApp.classList.add('hidden');
                    loginModal.classList.add('active');
                    document.getElementById('loginForm').reset();
                }
            }

            function exportData() {
                showToast('Export feature coming soon! 📊', 'info');
            }

            function viewBookDetails(id) {
                showToast(`Book details for ID: ${id} coming soon! 📖`, 'info');
            }

            // TOAST NOTIFICATIONS
            function showToast(message, type = 'info') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;

                document.getElementById('toastContainer').appendChild(toast);

                setTimeout(() => toast.classList.add('show'), 100);

                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 400);
                }, 4000);
            }

            // Close modals on outside click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('active');
                }
            });

            // Load theme preference
            window.addEventListener('load', () => {
                if (localStorage.getItem('darkMode') === 'true') {
                    toggleTheme();
                }
            });

            const quotes = [
                "Books are uniquely portable magic.",
                "A reader lives a thousand lives.",
                "Knowledge is power.",
                "Reading is dreaming with open eyes."
            ];

            function changeQuote() {
                const q = quotes[Math.floor(Math.random() * quotes.length)];
                document.querySelector(".quote-box p").innerText = q;
            }

            setInterval(changeQuote, 5000);

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'k':
                            e.preventDefault();
                            document.getElementById('globalSearch').focus();
                            break;
                        case 'n':
                            e.preventDefault();
                            showAddBookModal();
                            break;
                    }
                }
            });