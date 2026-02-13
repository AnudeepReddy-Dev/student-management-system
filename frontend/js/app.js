
const API_URL = 'http://localhost:8080/api/students';

let editingStudentId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded! Initializing...');

    loadStudents();

    setupFormSubmit();
});

function loadStudents() {
    console.log('Loading students...');

    showLoading(true);

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            return response.json();
        })
        .then(students => {
            console.log('Students loaded:', students);

            showLoading(false);

            displayStudents(students);
        })
        .catch(error => {
            console.error('Error loading students:', error);
            showLoading(false);
            showAlert('Error loading students. Please check if backend is running.', 'danger');
        });
}

function displayStudents(students) {
    const tableBody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');

    tableBody.innerHTML = '';

    if (students.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');

    students.forEach(student => {
        const row = createStudentRow(student);
        tableBody.appendChild(row);
    });
}

function createStudentRow(student) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${student.id}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.phone || '-'}</td>
        <td>${student.course}</td>
        <td>${student.year}</td>
        <td>
            <button class="btn btn-sm btn-warning" onclick="editStudent(${student.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </td>
    `;

    return tr;
}


function setupFormSubmit() {
    const form = document.getElementById('studentForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const studentData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            course: document.getElementById('course').value,
            year: parseInt(document.getElementById('year').value)
        };

        if (editingStudentId) {
            updateStudent(editingStudentId, studentData);
        } else {
            addStudent(studentData);
        }
    });
}

function addStudent(studentData) {
    console.log('Adding student:', studentData);

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add student');
        }
        return response.json();
    })
    .then(newStudent => {
        console.log('Student added:', newStudent);

        showAlert('Student added successfully!', 'success');

        clearForm();

        loadStudents();
    })
    .catch(error => {
        console.error('Error adding student:', error);
        showAlert('Error adding student. Please try again.', 'danger');
    });
}

function editStudent(id) {
    console.log('Editing student:', id);

    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(student => {
            document.getElementById('firstName').value = student.firstName;
            document.getElementById('lastName').value = student.lastName;
            document.getElementById('email').value = student.email;
            document.getElementById('phone').value = student.phone || '';
            document.getElementById('course').value = student.course;
            document.getElementById('year').value = student.year;

            editingStudentId = id;

            document.getElementById('submitBtn').innerHTML =
                '<i class="fas fa-save"></i> Update Student';
            document.getElementById('submitBtn').classList.remove('btn-success');
            document.getElementById('submitBtn').classList.add('btn-warning');

            document.getElementById('cancelBtn').classList.remove('d-none');


            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error loading student:', error);
            showAlert('Error loading student details.', 'danger');
        });
}

function updateStudent(id, studentData) {
    console.log('Updating student:', id, studentData);

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update student');
        }
        return response.json();
    })
    .then(updatedStudent => {
        console.log('Student updated:', updatedStudent);

        showAlert('Student updated successfully!', 'success');
        clearForm();
        loadStudents();
    })
    .catch(error => {
        console.error('Error updating student:', error);
        showAlert('Error updating student. Please try again.', 'danger');
    });
}

function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    console.log('Deleting student:', id);

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        showAlert('Student deleted successfully!', 'success');
        loadStudents();
    })
    .catch(error => {
        console.error('Error deleting student:', error);
        showAlert('Error deleting student. Please try again.', 'danger');
    });
}

function searchStudents() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadStudents();
        return;
    }

    console.log('Searching for:', keyword);
    showLoading(true);

    fetch(`${API_URL}/search?keyword=${keyword}`)
        .then(response => response.json())
        .then(students => {
            showLoading(false);
            displayStudents(students);

            if (students.length === 0) {
                showAlert(`No students found matching "${keyword}"`, 'info');
            }
        })
        .catch(error => {
            console.error('Error searching students:', error);
            showLoading(false);
            showAlert('Error searching students.', 'danger');
        });
}

function clearForm() {
    document.getElementById('studentForm').reset();
    editingStudentId = null;

    document.getElementById('submitBtn').innerHTML =
        '<i class="fas fa-save"></i> Add Student';
    document.getElementById('submitBtn').classList.remove('btn-warning');
    document.getElementById('submitBtn').classList.add('btn-success');

    document.getElementById('cancelBtn').classList.add('d-none');
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

document.getElementById('cancelBtn').addEventListener('click', clearForm);

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchStudents();
    }
});