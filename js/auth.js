document.addEventListener("DOMContentLoaded", () => {
  // --- LOGIN/REGISTRATION FORM TOGGLE ---
  const container = document.getElementById("container");
  if (container) {
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    if (registerBtn) {
      registerBtn.addEventListener("click", () =>
        container.classList.add("active")
      );
    }
    if (loginBtn) {
      loginBtn.addEventListener("click", () =>
        container.classList.remove("active")
      );
    }
  }

  // --- REGISTRATION LOGIC ---
  const signUpForm = document.querySelector(".sign-up form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = signUpForm.querySelector('input[type="text"]').value;
      const email = signUpForm.querySelector('input[type="email"]').value;
      const password = signUpForm.querySelector('input[type="password"]').value;

      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.find((user) => user.email === email);

      if (userExists) {
        alert("User with this email already exists!");
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Please sign in.");
      container.classList.remove("active");
      signUpForm.reset();
    });
  }

  // --- LOGIN LOGIC ---
  const signInForm = document.querySelector(".sign-in form");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signInForm.querySelector('input[type="email"]').value;
      const password = signInForm.querySelector('input[type="password"]').value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === email);

      if (!user || user.password !== password) {
        alert("Incorrect email or password. Please try again.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      alert(`Welcome back, ${user.name}!`);
      window.location.href = "index.html";
    });
  }

  // --- DYNAMIC UI MANAGEMENT BASED ON AUTH STATE ---
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navLoginIcon = document.querySelector(".nav-icons .login-icon");
  const navProfileDropdown = document.querySelector(
    ".nav-icons .profile-dropdown"
  );

  if (navLoginIcon && navProfileDropdown) {
    if (currentUser) {
      navLoginIcon.style.display = "none";
      navProfileDropdown.style.display = "inline-block";
      navProfileDropdown.querySelector(".profile-name").textContent =
        currentUser.name.split(" ")[0];
    } else {
      navLoginIcon.style.display = "inline-block";
      navProfileDropdown.style.display = "none";
    }
  }

  // --- CORRECTED: PROFILE DROPDOWN CLICK LOGIC ---
  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn && navProfileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      // Toggle the active state when the button is clicked
      navProfileDropdown.classList.toggle("active");
    });
  }

  // Close dropdown if clicking anywhere else on the page
  document.addEventListener("click", (e) => {
    // Check if the dropdown exists and is active
    if (navProfileDropdown && navProfileDropdown.classList.contains("active")) {
      // If the click was outside the dropdown container, close it
      if (!e.target.closest(".profile-dropdown")) {
        navProfileDropdown.classList.remove("active");
      }
    }
  });

  // --- DASHBOARD PAGE LOGIC ---
  const dashboardContent = document.querySelector(".dashboard-content");
  if (dashboardContent) {
    if (currentUser) {
      const welcomeMessage = dashboardContent.querySelector("h1");
      if (welcomeMessage)
        welcomeMessage.textContent = `Welcome Back, ${currentUser.name}!`;
      const profileName = document.querySelector(".sidebar-profile h3");
      const profileEmail = document.querySelector(".sidebar-profile p");
      if (profileName) profileName.textContent = currentUser.name;
      if (profileEmail) profileEmail.textContent = currentUser.email;
    } else {
      alert("You must be logged in to view this page.");
      window.location.href = "login.html";
    }
  }

  // --- LOGOUT LOGIC ---
  const logoutButtons = document.querySelectorAll(".logout-button");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  });
});
