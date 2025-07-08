document.addEventListener("DOMContentLoaded", () => {
  // GET ELEMENTS
  const contentArea = document.querySelector(".dashboard-content");
  const links = {
    dashboard: document.getElementById("dashboard-link"),
    profile: document.getElementById("profile-link"),
    orders: document.getElementById("orders-link"),
  };
  const allSidebarLinks = document.querySelectorAll(".dashboard-sidebar a");

  // STORE INITIAL CONTENT
  const initialDashboardHTML = contentArea.innerHTML;

  const loadContent = async (url, callback) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Content not found at ${url}`);
      const newContent = await response.text();
      contentArea.innerHTML = newContent;

      if (callback) {
        callback();
      }
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
    contentArea.innerHTML = initialDashboardHTML;
    setActiveLink(links.dashboard);
  });

  links.profile.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink(links.profile);
    loadContent("/user/_userProfileSetting.html", () => {
      initializeProfileForm();
      initializeAddressForm();
    });
  });

  links.orders.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink(links.orders);
    loadContent("/user/_userOrderHistory.html");
  });
});
