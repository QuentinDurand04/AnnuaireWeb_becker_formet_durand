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
                displayEntries(allEntries);
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
    });

    document.getElementById('department-select').addEventListener('change', (event) => {
        const selectedDepartment = event.target.value;
        const filteredEntries = selectedDepartment ?
            allEntries.filter(entry => entry.departements.includes(selectedDepartment)) :
            allEntries;
        displayEntries(filteredEntries);
    });

    document.getElementById('name-search').addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredEntries = searchText ?
            allEntries.filter(entry =>
                entry.nom.toLowerCase().includes(searchText) ||
                entry.prenom.toLowerCase().includes(searchText)
            ) :
            allEntries;
        displayEntries(filteredEntries);
    });

    document.getElementById('btn-back').addEventListener('click', () => {
        showView('department-view');
        displayEntries(allEntries);
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

function displayEntries(entrees) {
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = ''; // Clear existing entries

    entrees.forEach(entry => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${entry.prenom} ${entry.nom} - ${entry.departements.join(', ')}`;
        link.addEventListener('click', () => {
            displayEntryDetail(entry);
        });
        listItem.appendChild(link);
        entriesList.appendChild(listItem);
    });
}

function displayEntryDetail(entry) {
    document.getElementById('detail-name').textContent = `${entry.prenom} ${entry.nom}`;
    document.getElementById('detail-department').textContent = `Departments: ${entry.departements.join(', ')}`;

    // Email link
    const emailLink = document.getElementById('detail-email');
    emailLink.innerHTML = `<a href="mailto:${entry.links.email}" target="_blank">${entry.links.email}</a>`;

    // Image
    const imgContainer = document.getElementById('detail-image');
    imgContainer.innerHTML = ''; // Clear previous image
    const img = document.createElement('img');
    img.src = `http://localhost:42064/api/${entry.links.img}`;
    img.alt = `${entry.prenom} ${entry.nom}`;
    imgContainer.appendChild(img);

    showView('entry-detail');
}


function showView(viewId) {
    const views = ['department-view', 'search-view', 'entry-detail'];
    views.forEach(view => {
        document.getElementById(view).classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
}
