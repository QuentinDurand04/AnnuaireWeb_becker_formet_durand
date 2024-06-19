document.addEventListener("DOMContentLoaded", () => {
    fetchEntries();
    setupEventListeners();
});

let allEntries = [];

function fetchEntries() {
    fetch('http://localhost:42064/api/entrees')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Log the fetched data
            if (Array.isArray(data.entres)) {
                allEntries = data.entres;
                populateDepartments(allEntries);
                displayEntries(allEntries, 'entries-list'); // Display initial entries in department view
            } else {
                console.error('API did not return an array of entries:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching entries:', error);
        });
}

function setupEventListeners() {
    document.getElementById('btn-department').addEventListener('click', () => {
        showView('department-view');
    });

    document.getElementById('btn-search').addEventListener('click', () => {
        showView('search-view');
        displayEntries(allEntries, 'search-entries-list'); // Display entries in search view
    });

    document.getElementById('department-select').addEventListener('change', (event) => {
        const selectedDepartment = event.target.value;
        const filteredEntries = selectedDepartment ?
            allEntries.filter(entry => entry.departements.includes(selectedDepartment)) :
            allEntries;
        displayEntries(filteredEntries, 'entries-list');
    });

    document.getElementById('name-search').addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredEntries = searchText ?
            allEntries.filter(entry =>
                entry.nom.toLowerCase().includes(searchText) ||
                entry.prenom.toLowerCase().includes(searchText)
            ) :
            allEntries;
        displayEntries(filteredEntries, 'search-entries-list');
    });

    document.getElementById('btn-back').addEventListener('click', () => {
        showView('department-view');
        displayEntries(allEntries, 'entries-list');
    });
}

function populateDepartments(entrees) {
    const departmentSelect = document.getElementById('department-select');
    const departments = new Set();

    entrees.forEach(entry => {
        entry.departements.forEach(department => {
            departments.add(department);
        });
    });

    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
    });
}

function displayEntries(entrees, listId) {
    const templateSource = document.getElementById('entries-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template({ entries: entrees });
    document.getElementById(listId).innerHTML = html;

    document.querySelectorAll(`#${listId} a`).forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const index = event.target.getAttribute('data-id');
            displayEntryDetail(allEntries[index]);
        });
    });
}

function displayEntryDetail(entry) {
    const templateSource = document.getElementById('entry-detail-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    const html = template(entry);
    const detailContainer = document.getElementById('entry-detail');
    detailContainer.innerHTML = html;

    showView('entry-detail');
}

function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
}
