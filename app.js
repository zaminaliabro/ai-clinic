const form = document.getElementById("signupForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!firstName || !lastName || !email || !password || !role) {
    alert("Fill all fields!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  users.push({ firstName, lastName, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful!");
  window.location.href = "login.html";
});
