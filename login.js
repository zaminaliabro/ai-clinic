const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
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

  // ✅ save current user
  localStorage.setItem("currentUser", JSON.stringify(user));

  // ✅ PERFECT redirect
  if (user.role === "doctor") {
    window.location.href = "doctor.html";
  } else if (user.role === "patient") {
    window.location.href = "patient.html";
  } else if (user.role === "admin") {
    window.location.href = "admin.html";
  }
});
