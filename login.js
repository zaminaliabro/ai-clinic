const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const selectedRole = document.getElementById("role").value;

  if (!email || !password || !selectedRole) {
    alert("Fill all fields!");
    return;
  }

  // ✅ pehle users lao
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // ✅ phir user find karo
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  // 🔴 role mismatch check
  if (user.role !== selectedRole) {
    alert("You selected wrong role!");
    return;
  }

  // ✅ save current user
  localStorage.setItem("currentUser", JSON.stringify(user));

  // ✅ PERFECT redirect
  switch (user.role) {
    case "doctor":
      window.location.href = "doctor.html";
      break;

    case "patient":
      window.location.href = "patient.html";
      break;

    case "admin":
      window.location.href = "admin.html";
      break;

    default:
      alert("Unknown role");
  }
});
