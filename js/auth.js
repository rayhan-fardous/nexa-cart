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
        signUpForm.classList.add("was-validated");
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
    });
  }

  // --- LOGIN LOGIC WITH VALIDATION ---
  const signInForm = document.querySelector(".sign-in form");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signInForm.classList.add("was-validated");

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
        window.location.href = "index.html";
      }
    });
  }

  // --- FORGOT PASSWORD LOGIC ---
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();

      const email = prompt(
        "Please enter the email for the account you want to recover:"
      );
      if (!email) {
        return; // Exit if the user cancels the prompt
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userToUpdate = users.find((u) => u.email === email);

      if (!userToUpdate) {
        alert("No user found with that email address.");
        return;
      }

      // Do not allow password reset for Google-authenticated users
      if (userToUpdate.isGoogleUser) {
        alert(
          "Password reset is not available for accounts signed in with Google."
        );
        return;
      }

      const newPassword = prompt(
        "Enter your new password (must be at least 8 characters):"
      );
      if (!newPassword || newPassword.length < 8) {
        alert("Invalid password. Password must be at least 8 characters long.");
        return;
      }

      const confirmNewPassword = prompt("Please confirm your new password:");
      if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      // Update the user's password
      userToUpdate.password = newPassword;

      // Save the updated users array back to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      alert(
        "Password reset successfully! You can now sign in with your new password."
      );
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
      window.location.href = "/index.html";
    }
  }

  const logoutButtons = document.querySelectorAll(".logout-button");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");

      window.location.href = "/index.html";
    });
  });
});
