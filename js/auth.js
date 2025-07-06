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

  // --- CUSTOM GOOGLE SIGN-IN BUTTON TRIGGER ---
  const googleButtons = document.querySelectorAll(".google-signin-button");
  googleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        typeof google !== "undefined" &&
        google.accounts &&
        google.accounts.id
      ) {
        google.accounts.id.prompt();
      } else {
        console.error("Google Identity Services library not loaded yet.");
        alert(
          "Google Sign-In is not ready. Please wait a moment and try again."
        );
      }
    });
  });

  // --- REGISTRATION LOGIC WITH VALIDATION ---
  const signUpForm = document.querySelector(".sign-up form");
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = signUpForm.querySelector('input[type="text"]').value;
      const email = signUpForm.querySelector('input[type="email"]').value;
      const passwordInput = signUpForm.querySelector("#signupPassword");
      const confirmPasswordInput = signUpForm.querySelector("#confirmPassword");
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const confirmPasswordFeedback = signUpForm.querySelector(
        "#confirmPasswordFeedback"
      );

      if (password !== confirmPassword) {
        confirmPasswordFeedback.textContent = "Passwords do not match.";
        confirmPasswordInput.setCustomValidity("Invalid");
      } else {
        confirmPasswordFeedback.textContent = "Please confirm your password.";
        confirmPasswordInput.setCustomValidity("");
      }

      if (!signUpForm.checkValidity()) {
        e.stopPropagation();
      } else {
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
        signUpForm.classList.remove("was-validated");
      }
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
          signInForm.classList.remove("was-validated");
          return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        alert(`Welcome back, ${user.name}!`);
        window.location.href = "index.html";
      }

      signInForm.classList.add("was-validated");
    });
  }

  // --- DYNAMIC UI UPDATES BASED ON LOGIN STATE ---
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
