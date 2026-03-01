const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  // 🔥 AUTO redirect by saved role
  if (user.role === "doctor") {
    window.location.href = "doctor.html";
  } else if (user.role === "patient") {
    window.location.href = "patient.html";
  } else {
    window.location.href = "admin.html";
  }
});
