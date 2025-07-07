// --- DYNAMIC UI UPDATES BASED ON LOGIN STATE ---
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navLoginIcon = document.querySelector(".nav-icons .login-icon");
  const navProfileDropdown = document.querySelector(
    ".nav-icons .profile-dropdown"
  );

  

document.addEventListener("DOMContentLoaded", () => {
  // 1. GET ELEMENTS
  const contentArea = document.querySelector(".dashboard-content");
  const links = {
    dashboard: document.getElementById("dashboard-link"),
    profile: document.getElementById("profile-link"),
    // Add other links here later (e.g., orders: document.getElementById('orders-link'))
  };
  const allSidebarLinks = document.querySelectorAll(".dashboard-sidebar a");

  // STORE INITIAL CONTENT
  const initialDashboardHTML = contentArea.innerHTML;

  // CONTENT LOADING FUNCTION 
  const loadContent = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Content not found");
      const newContent = await response.text();
      contentArea.innerHTML = newContent;
    } catch (error) {
      contentArea.innerHTML = `<p class="error">Error loading content. Please try again later.</p>`;
      console.error("Failed to load content:", error);
    }
  };

  // HELPER FUNCTION FOR ACTIVE STATE 
  const setActiveLink = (activeLink) => {
    allSidebarLinks.forEach((link) => link.classList.remove("active"));
    if (activeLink) {
      activeLink.classList.add("active");
    }
  };

  // EVENT LISTENERS
  links.dashboard.addEventListener("click", (e) => {
    e.preventDefault();
    contentArea.innerHTML = initialDashboardHTML; // Restore original content
    setActiveLink(links.dashboard);
  });

  links.profile.addEventListener("click", (e) => {
    e.preventDefault();
    // Load the content from our new partial file
    loadContent("/user/_userProfileContent.html");
    setActiveLink(links.profile);
  });


});
