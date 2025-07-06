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

  // --- REGISTRATION LOGIC WITH VALIDATION ---
  const signUpForm = document.querySelector(".sign-up form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Always prevent default submission

      const name = signUpForm.querySelector('input[type="text"]').value;
      const email = signUpForm.querySelector('input[type="email"]').value;
      const passwordInput = signUpForm.querySelector("#signupPassword");
      const confirmPasswordInput = signUpForm.querySelector("#confirmPassword");
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const confirmPasswordFeedback = signUpForm.querySelector(
        "#confirmPasswordFeedback"
      );

      // Custom validation check: Do passwords match?
      if (password !== confirmPassword) {
        confirmPasswordFeedback.textContent = "Passwords do not match.";
        // This is a Bootstrap method to show an input as invalid
        confirmPasswordInput.setCustomValidity("Invalid");
      } else {
        confirmPasswordFeedback.textContent = "Please confirm your password.";
        // If they match, reset the custom validity
        confirmPasswordInput.setCustomValidity("");
      }

      if (!signUpForm.checkValidity()) {
        e.stopPropagation(); // Stop other events
      } else {
        // If the form is valid, proceed with registration
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
        signUpForm.classList.remove("was-validated"); // Reset validation state
      }

      // Add was-validated class to show feedback messages
      signUpForm.classList.add("was-validated");
    });
  }

  // --- LOGIN LOGIC WITH VALIDATION ---
  const signInForm = document.querySelector(".sign-in form");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!signInForm.checkValidity()) {
        e.stopPropagation();
      } else {
        const email = signInForm.querySelector('input[type="email"]').value;
        const password = signInForm.querySelector(
          'input[type="password"]'
        ).value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === email);

        if (!user || user.password !== password) {
          alert("Incorrect email or password. Please try again.");
          signInForm.classList.remove("was-validated"); // Reset validation state on error
          return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        alert(`Welcome back, ${user.name}!`);
        window.location.href = "index.html";
      }

      signInForm.classList.add("was-validated");
    });
  }

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

  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn && navProfileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      navProfileDropdown.classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (navProfileDropdown && navProfileDropdown.classList.contains("active")) {
      if (!e.target.closest(".profile-dropdown")) {
        navProfileDropdown.classList.remove("active");
      }
    }
  });

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
