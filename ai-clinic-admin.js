// -----------------------------
// Local Storage Helpers
// -----------------------------
function saveToLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocal(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// -----------------------------
// Tabs Switching
// -----------------------------
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");

tabLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    tabLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    const target = link.dataset.tab;
    tabPanels.forEach(
      (panel) => (panel.style.display = panel.id === target ? "block" : "none"),
    );
  });
});

// -----------------------------
// Search Function
// -----------------------------
function searchTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const table = document.getElementById(tableId);
  const tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    const tdList = tr[i].getElementsByTagName("td");
    let txtValue = "";
    for (let j = 0; j < tdList.length; j++)
      txtValue += tdList[j].textContent.toLowerCase() + " ";
    tr[i].style.display = txtValue.includes(filter) ? "" : "none";
  }
}

["patient", "doctor", "appointment"].forEach((type) => {
  document
    .getElementById(`${type}Search`)
    ?.addEventListener("keyup", () =>
      searchTable(`${type}Search`, `${type}Table`),
    );
});

// -----------------------------
// Modals
// -----------------------------
function setupModal(buttonId, modalId) {
  const btn = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  if (!btn || !modal) return;

  btn.addEventListener("click", () => (modal.style.display = "block"));
  modal
    .querySelector(".close")
    ?.addEventListener("click", () => (modal.style.display = "none"));
}

setupModal("openAddPatientBtn", "patientModal");
setupModal("openAddDoctorBtn", "doctorModal");
setupModal("openAddAppointmentBtn", "appointmentModal");

// -----------------------------
// Load Existing Data from LocalStorage
// -----------------------------
let patients = loadFromLocal("patients");
let doctors = loadFromLocal("doctors");
let appointments = loadFromLocal("appointments");

// -----------------------------
// Render Tables
// -----------------------------
function renderTableData() {
  const patientTable = document.getElementById("patientTable");
  const doctorTable = document.getElementById("doctorTable");
  const appointmentTable = document.getElementById("appointmentTable");

  patientTable.innerHTML = "";
  doctorTable.innerHTML = "";
  appointmentTable.innerHTML = "";

  // Patients
  patients.forEach((p, index) => {
    const row = patientTable.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.doctor}</td>
      <td>${p.date}</td>
      <td><button class="delete-patient-btn" data-index="${index}">Delete</button></td>
    `;
  });

  // Doctors
  doctors.forEach((d, index) => {
    const row = doctorTable.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${d.name}</td>
      <td>${d.specialty}</td>
      <td>${d.patients || 0}</td>
      <td><button class="delete-doctor-btn" data-index="${index}">Delete</button></td>
    `;
  });

  // Appointments
  appointments.forEach((a, index) => {
    const row = appointmentTable.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${a.patient}</td>
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td><span class="status ${a.status.toLowerCase()}">${a.status}</span></td>
      <td><button class="delete-appointment-btn" data-index="${index}">Delete</button></td>
    `;
  });

  // Delete Patients
  document.querySelectorAll(".delete-patient-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      const removedPatient = patients.splice(idx, 1)[0];
      saveToLocal("patients", patients);

      // Reduce doctor patient count
      const doctorIndex = doctors.findIndex(
        (d) => d.name === removedPatient.doctor,
      );
      if (doctorIndex !== -1 && doctors[doctorIndex].patients > 0) {
        doctors[doctorIndex].patients--;
        saveToLocal("doctors", doctors);
      }

      renderTableData();
    });
  });

  // Delete Doctors
  document.querySelectorAll(".delete-doctor-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      const removedDoctor = doctors.splice(idx, 1)[0];
      saveToLocal("doctors", doctors);

      // Optional: Remove all patients of this doctor
      patients = patients.filter((p) => p.doctor !== removedDoctor.name);
      saveToLocal("patients", patients);

      // Remove appointments for this doctor
      appointments = appointments.filter(
        (a) => a.doctor !== removedDoctor.name,
      );
      saveToLocal("appointments", appointments);

      renderTableData();
    });
  });

  // Delete Appointments
  document.querySelectorAll(".delete-appointment-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      appointments.splice(idx, 1);
      saveToLocal("appointments", appointments);
      renderTableData();
    });
  });

  updateCounters();
  updateStatusBadges();
}

// -----------------------------
// Save Patient
// -----------------------------
document.getElementById("savePatientBtn")?.addEventListener("click", () => {
  const name = document.getElementById("patientName").value;
  const age = document.getElementById("patientAge").value;
  const doctor = document.getElementById("patientDoctor").value;
  const date = document.getElementById("patientDate").value;

  if (!name || !age || !doctor || !date) return alert("Fill all fields");

  const patientData = { name, age, doctor, date };
  patients.push(patientData);
  saveToLocal("patients", patients);

  // Update doctor patient count
  const doctorIndex = doctors.findIndex((d) => d.name === doctor);
  if (doctorIndex !== -1) {
    doctors[doctorIndex].patients = (doctors[doctorIndex].patients || 0) + 1;
    saveToLocal("doctors", doctors);
  }

  document.getElementById("patientModal").style.display = "none";
  document.getElementById("patientName").value = "";
  document.getElementById("patientAge").value = "";
  document.getElementById("patientDoctor").value = "";
  document.getElementById("patientDate").value = "";

  renderTableData();
});

// -----------------------------
// Save Doctor
// -----------------------------
document.getElementById("saveDoctorBtn")?.addEventListener("click", () => {
  const name = document.getElementById("doctorName").value;
  const specialty = document.getElementById("doctorSpecialty").value;
  if (!name || !specialty) return alert("Fill all fields");

  const doctorData = { name, specialty, patients: 0 };
  doctors.push(doctorData);
  saveToLocal("doctors", doctors);

  document.getElementById("doctorModal").style.display = "none";
  document.getElementById("doctorName").value = "";
  document.getElementById("doctorSpecialty").value = "";

  renderTableData();
});

// -----------------------------
// Save Appointment
// -----------------------------
document.getElementById("saveAppointmentBtn")?.addEventListener("click", () => {
  const patient = document.getElementById("appointmentPatient").value;
  const doctor = document.getElementById("appointmentDoctor").value;
  const date = document.getElementById("appointmentDate").value;
  const status = document.getElementById("appointmentStatus").value;

  if (!patient || !doctor || !date) return alert("Fill all fields");

  const appointmentData = { patient, doctor, date, status };
  appointments.push(appointmentData);
  saveToLocal("appointments", appointments);

  document.getElementById("appointmentModal").style.display = "none";
  document.getElementById("appointmentPatient").value = "";
  document.getElementById("appointmentDoctor").value = "";
  document.getElementById("appointmentDate").value = "";
  document.getElementById("appointmentStatus").value = "Pending";

  renderTableData();
});

// -----------------------------
// Reports Upload
// -----------------------------
document.getElementById("uploadReportBtn")?.addEventListener("click", () => {
  const patientName = document.getElementById("reportPatientName").value;
  const fileInput = document.getElementById("reportFile");
  if (!patientName || !fileInput.files.length)
    return alert("Enter patient name and file");

  const li = document.createElement("li");
  li.textContent = `${patientName} - ${fileInput.files[0].name}`;
  document.getElementById("uploadedReports").appendChild(li);

  document.getElementById("reportPatientName").value = "";
  fileInput.value = "";
});

// -----------------------------
// Update Counters
// -----------------------------
function updateCounters() {
  document.getElementById("total-patients").textContent = patients.length;
  document.getElementById("total-doctors").textContent = doctors.length;
  document.getElementById("total-appointments").textContent =
    appointments.length;
  document.getElementById("reportPatients").textContent = patients.length;
  document.getElementById("reportDoctors").textContent = doctors.length;
  document.getElementById("reportAppointments").textContent =
    appointments.length;
}

// -----------------------------
// Update Appointment Status Badges
// -----------------------------
function updateStatusBadges() {
  const table = document.getElementById("appointmentTable");
  for (let i = 0; i < table.rows.length; i++) {
    const cell = table.rows[i].cells[4];
    const status = cell.textContent.trim().toLowerCase();
    cell.innerHTML = `<span class="status ${status}">${cell.textContent}</span>`;
  }
}

// -----------------------------
// Logout Functionality
// -----------------------------
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.href = "login.html";
});

// -----------------------------
// Initial Render
// -----------------------------
renderTableData();
