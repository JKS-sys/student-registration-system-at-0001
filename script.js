// Helper functions for validation
function validateName(name) {
  return /^[A-Za-z ]+$/.test(name.trim());
}
function validateID(id) {
  return /^\d+$/.test(id) && id.trim() !== "";
}
function validateEmail(email) {
  // Basic email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validateContact(contact) {
  return /^\d{10,}$/.test(contact.trim());
}

// Load and Save students from Local Storage
function loadStudents() {
  const students = localStorage.getItem("students");
  return students ? JSON.parse(students) : [];
}
function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// --- DOM References ---
const registrationForm = document.getElementById("registrationForm");
const formError = document.getElementById("formError");
const studentsTbody = document.getElementById("studentsTbody");
const tableContainer = document.getElementById("tableContainer");

let editingIndex = null; // Track if we are editing a row

// --- Render Students Table ---
function renderStudents() {
  const students = loadStudents();
  studentsTbody.innerHTML = "";
  if (students.length === 0) {
    studentsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:gray;">No records found.</td></tr>`;
  } else {
    students.forEach((student, idx) => {
      // Render each student row
      studentsTbody.innerHTML += `
        <tr>
          <td>${student.name}</td>
          <td>${student.id}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td>
            <button class="action-btn edit-btn" onclick="editStudent(${idx})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteStudent(${idx})">Delete</button>
          </td>
        </tr>
      `;
    });
  }
  // Dynamically add vertical scrollbar if > 5 students
  tableContainer.style.maxHeight = loadStudents().length > 5 ? "350px" : "auto";
}

// --- Add or Edit Student ---
registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  formError.textContent = ""; // Clear any old errors

  const name = document.getElementById("studentName").value.trim();
  const id = document.getElementById("studentID").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const contact = document.getElementById("contactNo").value.trim();

  // Validation
  if (!validateName(name)) {
    formError.textContent = "Name: Only alphabets and spaces allowed.";
    return;
  }
  if (!validateID(id)) {
    formError.textContent = "Student ID: Only numbers allowed.";
    return;
  }
  if (!validateEmail(email)) {
    formError.textContent = "Email format invalid.";
    return;
  }
  if (!validateContact(contact)) {
    formError.textContent = "Contact Number: Minimum 10 digits, numbers only.";
    return;
  }
  // Ensure non-empty and no empty row
  if (!name || !id || !email || !contact) {
    formError.textContent = "All fields are mandatory.";
    return;
  }

  let students = loadStudents();
  // For add or edit
  if (editingIndex !== null) {
    // Edit existing student
    students[editingIndex] = { name, id, email, contact };
    editingIndex = null;
    registrationForm.reset();
    document.getElementById("submitBtn").textContent = "Register";
  } else {
    // Add student. Check for duplicate ID
    if (students.some((stu) => stu.id === id)) {
      formError.textContent = "Student ID must be unique.";
      return;
    }
    students.push({ name, id, email, contact });
    registrationForm.reset();
  }
  saveStudents(students);
  renderStudents();
});

// --- Edit Student ---
function editStudent(idx) {
  const students = loadStudents();
  const stu = students[idx];
  document.getElementById("studentName").value = stu.name;
  document.getElementById("studentID").value = stu.id;
  document.getElementById("studentEmail").value = stu.email;
  document.getElementById("contactNo").value = stu.contact;
  editingIndex = idx;
  document.getElementById("submitBtn").textContent = "Update";
}

// --- Delete Student ---
function deleteStudent(idx) {
  if (!confirm("Are you sure to delete this student record?")) return;
  const students = loadStudents();
  students.splice(idx, 1);
  saveStudents(students);
  renderStudents();
  registrationForm.reset();
  editingIndex = null;
  document.getElementById("submitBtn").textContent = "Register";
}

// Assign to window so HTML inline handler works:
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

// --- Initial Render ---
window.onload = renderStudents;
