// State & Mock Data Storage
let currentRole = 'client';

let state = {
    profile: JSON.parse(localStorage.getItem('crm_profile')) || {
        name: "John Smith",
        email: "john@company.com",
        company: "Tech Solutions Inc.",
        phone: "+1 555-0101"
    },
    projects: JSON.parse(localStorage.getItem('crm_projects')) || [
        { id: 101, client_id: 1, name: "Website Redesign", status: "In Progress", progress: "75%" },
        { id: 102, client_id: 1, name: "Mobile App Development", status: "Planning", progress: "20%" }
    ],
    documents: JSON.parse(localStorage.getItem('crm_docs')) || [
        { id: 1, name: "Project_Proposal.pdf", type: "PDF", date: "2026-03-01", size: "2.4 MB" },
        { id: 2, name: "Design_Assets.zip", type: "ZIP", date: "2026-03-10", size: "15.8 MB" }
    ],
    tickets: JSON.parse(localStorage.getItem('crm_tickets')) || [
        { id: 1, subject: "Login issue on staging", priority: "High", status: "Open", date: "2026-03-15" }
    ],
    invoices: JSON.parse(localStorage.getItem('crm_invoices')) || [
        { id: "INV-001", amount: "$1,200.00", status: "Paid", due: "2026-02-28" },
        { id: "INV-002", amount: "$2,500.00", status: "Pending", due: "2026-03-30" }
    ],
    messages: JSON.parse(localStorage.getItem('crm_messages')) || [
        { sender: "admin", text: "Welcome to the client portal! Let us know if you need assistance." }
    ]
};

// Save State to Local Storage
function saveState() {
    localStorage.setItem('crm_profile', JSON.stringify(state.profile));
    localStorage.setItem('crm_projects', JSON.stringify(state.projects));
    localStorage.setItem('crm_docs', JSON.stringify(state.documents));
    localStorage.setItem('crm_tickets', JSON.stringify(state.tickets));
    localStorage.setItem('crm_invoices', JSON.stringify(state.invoices));
    localStorage.setItem('crm_messages', JSON.stringify(state.messages));
}

// Navigation Handler
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if(targetSection) targetSection.classList.add('active');
    
    document.getElementById('pageTitle').innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

// Role Switcher
function switchRole(role) {
    currentRole = role;
    const roleBadge = document.getElementById('currentRoleText');
    const adminLink = document.querySelector('.admin-only');
    const clientLinks = document.querySelectorAll('.client-only');

    if (role === 'admin') {
        roleBadge.innerText = "Admin Mode";
        adminLink.classList.remove('hidden');
        clientLinks.forEach(el => el.classList.add('hidden'));
        showSection('admin');
    } else {
        roleBadge.innerText = "Client Mode";
        adminLink.classList.add('hidden');
        clientLinks.forEach(el => el.classList.remove('hidden'));
        showSection('dashboard');
    }
}

// Render UI Components
function renderAll() {
    // Stats
    document.getElementById('statProjectsCount').innerText = state.projects.length;
    document.getElementById('statDocsCount').innerText = state.documents.length;
    document.getElementById('statTicketsCount').innerText = state.tickets.length;
    document.getElementById('statInvoicesCount').innerText = state.invoices.filter(i => i.status === 'Pending').length;

    // Profile
    document.getElementById('profName').value = state.profile.name;
    document.getElementById('profEmail').value = state.profile.email;
    document.getElementById('profCompany').value = state.profile.company;
    document.getElementById('profPhone').value = state.profile.phone;
    document.getElementById('userName').innerText = state.profile.name;

    // Projects
    const projBody = document.getElementById('projectsTableBody');
    projBody.innerHTML = state.projects.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.client_id}</td>
            <td><span class="badge">${p.status}</span></td>
            <td>${p.progress}</td>
        </tr>
    `).join('');

    // Documents
    const docsBody = document.getElementById('docsTableBody');
    docsBody.innerHTML = state.documents.map(d => `
        <tr>
            <td>${d.name}</td>
            <td>${d.type}</td>
            <td>${d.date}</td>
            <td>${d.size}</td>
            <td><button class="btn btn-outline" onclick="alert('Downloading ${d.name}')">Download</button></td>
        </tr>
    `).join('');

    // Tickets
    const tktBody = document.getElementById('ticketsTableBody');
    tktBody.innerHTML = state.tickets.map(t => `
        <tr>
            <td>${t.subject}</td>
            <td>${t.priority}</td>
            <td>${t.status}</td>
            <td>${t.date}</td>
        </tr>
    `).join('');

    // Invoices
    const invBody = document.getElementById('invoicesTableBody');
    invBody.innerHTML = state.invoices.map(i => `
        <tr>
            <td>${i.id}</td>
            <td>${i.amount}</td>
            <td>${i.status}</td>
            <td>${i.due}</td>
        </tr>
    `).join('');

    // Chat
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = state.messages.map(m => `
        <div class="chat-msg ${m.sender}">${m.text}</div>
    `).join('');
}

// Action Handlers
function saveProfile(e) {
    e.preventDefault();
    state.profile.name = document.getElementById('profName').value;
    state.profile.email = document.getElementById('profEmail').value;
    state.profile.company = document.getElementById('profCompany').value;
    state.profile.phone = document.getElementById('profPhone').value;
    saveState();
    renderAll();
    alert('Profile updated successfully!');
}

function openDocModal() { document.getElementById('docModal').classList.add('active'); }
function closeDocModal() { document.getElementById('docModal').classList.remove('active'); }

function uploadDocument(e) {
    e.preventDefault();
    const docName = document.getElementById('docName').value;
    const docType = document.getElementById('docType').value;
    state.documents.push({
        id: Date.now(),
        name: docName,
        type: docType,
        date: new Date().toISOString().split('T')[0],
        size: '1.2 MB'
    });
    saveState();
    renderAll();
    closeDocModal();
}

function openTicketModal() { document.getElementById('ticketModal').classList.add('active'); }
function closeTicketModal() { document.getElementById('ticketModal').classList.remove('active'); }

function createTicket(e) {
    e.preventDefault();
    const subject = document.getElementById('ticketSubject').value;
    const priority = document.getElementById('ticketPriority').value;
    state.tickets.push({
        id: Date.now(),
        subject: subject,
        priority: priority,
        status: 'Open',
        date: new Date().toISOString().split('T')[0]
    });
    saveState();
    renderAll();
    closeTicketModal();
}

function sendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('msgInput');
    if(!input.value.trim()) return;
    state.messages.push({ sender: currentRole, text: input.value });
    input.value = '';
    saveState();
    renderAll();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});