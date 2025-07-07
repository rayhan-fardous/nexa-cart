/**
 * @file userOrders.js
 * @description Manages all functionality for the user order history page.
 * It dynamically renders, filters, and paginates a user's specific orders.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE SIMULATION ---
  // In a real application, this data would come from a server API.
  // We are structuring it by user to simulate fetching orders for the logged-in user.
  const ordersDatabase = {
    "rayhan@example.com": [
      {
        id: "#NC-84321",
        date: "2025-07-01",
        status: "delivered",
        items: 3,
        total: 299.99,
      },
      {
        id: "#NC-84156",
        date: "2025-06-25",
        status: "shipped",
        items: 1,
        total: 89.5,
      },
      {
        id: "#NC-84098",
        date: "2025-06-22",
        status: "pending",
        items: 2,
        total: 45.0,
      },
      {
        id: "#NC-83991",
        date: "2025-06-15",
        status: "delivered",
        items: 1,
        total: 149.99,
      },
      {
        id: "#NC-83905",
        date: "2025-06-12",
        status: "cancelled",
        items: 4,
        total: 499.0,
      },
      {
        id: "#NC-83742",
        date: "2025-06-05",
        status: "delivered",
        items: 1,
        total: 24.5,
      },
      {
        id: "#NC-83611",
        date: "2025-05-28",
        status: "shipped",
        items: 5,
        total: 320.0,
      },
      {
        id: "#NC-83500",
        date: "2025-05-20",
        status: "delivered",
        items: 2,
        total: 75.25,
      },
      {
        id: "#NC-83450",
        date: "2025-05-18",
        status: "pending",
        items: 1,
        total: 19.99,
      },
      {
        id: "#NC-83301",
        date: "2025-05-10",
        status: "cancelled",
        items: 3,
        total: 180.7,
      },
      {
        id: "#NC-83250",
        date: "2025-05-02",
        status: "delivered",
        items: 2,
        total: 62.0,
      },
      {
        id: "#NC-83100",
        date: "2025-04-25",
        status: "shipped",
        items: 1,
        total: 99.95,
      },
    ],
    "anotheruser@example.com": [
      {
        id: "#NC-91111",
        date: "2025-07-03",
        status: "pending",
        items: 1,
        total: 50.0,
      },
      {
        id: "#NC-92222",
        date: "2025-06-20",
        status: "delivered",
        items: 2,
        total: 124.0,
      },
    ],
  };

  // --- STATE MANAGEMENT ---
  let currentPage = 1;
  const itemsPerPage = 5;
  let currentUserOrders = [];
  let filteredOrders = [];

  // --- DOM ELEMENT SELECTORS ---
  const searchInput = document.querySelector(".filter-section .search-input");
  const statusSelect = document.querySelector(".filter-section select");
  const startDateInput = document.querySelector(
    '.filter-section input[type="date"][aria-label="Start date"]'
  );
  const endDateInput = document.querySelector(
    '.filter-section input[type="date"][aria-label="End date"]'
  );
  const tableBody = document.querySelector(".orders-table tbody");
  const mobileOrderList = document.querySelector(".orders-list-mobile");
  const paginationContainer = document.querySelector(".pagination");
  const contentArea = document.querySelector(".dashboard-content");

  /**
   * Fetches orders for the current user from the simulated database.
   */
  const loadUserOrders = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && ordersDatabase[currentUser.email]) {
      currentUserOrders = ordersDatabase[currentUser.email];
      filteredOrders = [...currentUserOrders];
    } else {
      currentUserOrders = [];
      filteredOrders = [];
    }
  };

  /**
   * Renders the orders for the current page in both table and mobile card views.
   */
  const renderOrders = () => {
    // Ensure we are on the order history page before manipulating the DOM
    if (!tableBody || !mobileOrderList) return;

    // Clear existing content
    tableBody.innerHTML = "";
    mobileOrderList.innerHTML = "";

    if (filteredOrders.length === 0) {
      const noResultsHtml = `<td colspan="6" style="text-align:center; padding: 20px; color: #555;">No matching orders found.</td>`;
      tableBody.innerHTML = `<tr>${noResultsHtml}</tr>`;
      mobileOrderList.innerHTML = `<div style="text-align:center; padding: 20px; color: #555;">No matching orders found.</div>`;
      renderPagination(); // Clear pagination
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const ordersToShow = filteredOrders.slice(startIndex, endIndex);

    ordersToShow.forEach((order) => {
      const statusClass = `status-${order.status}`;
      const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Dynamically generate action links based on status
      let actionLinks = `<a href="#">View Details</a>`;
      if (order.status === "delivered")
        actionLinks += `<a href="#">Reorder</a>`;
      if (order.status === "shipped")
        actionLinks += `<a href="#">Track Order</a>`;
      if (order.status === "pending") actionLinks += `<a href="#">Cancel</a>`;

      // Render Desktop Table Row
      const tableRow = `
                <tr>
                    <td class="order-id">${order.id}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status-badge ${statusClass}">${
        order.status
      }</span></td>
                    <td>${order.items}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td class="action-links">${actionLinks}</td>
                </tr>
            `;
      tableBody.insertAdjacentHTML("beforeend", tableRow);

      // Render Mobile Card
      const mobileCard = `
                <div class="order-card">
                    <div class="card-header">
                        <span class="order-id">${order.id}</span>
                        <span class="status-badge ${statusClass}">${
        order.status
      }</span>
                    </div>
                    <div class="card-body">
                        <div><span class="label">Date</span>${formattedDate}</div>
                        <div><span class="label">Total</span>$${order.total.toFixed(
                          2
                        )}</div>
                        <div><span class="label">Items</span>${
                          order.items
                        }</div>
                    </div>
                    <div class="card-footer action-links">${actionLinks}</div>
                </div>
            `;
      mobileOrderList.insertAdjacentHTML("beforeend", mobileCard);
    });

    renderPagination();
  };

  /**
   * Renders the pagination controls based on the filtered orders.
   */
  const renderPagination = () => {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous button
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<a href="#" aria-label="Previous page" data-page="${
        currentPage - 1
      }">&laquo;</a>`
    );

    // Page number links
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? "active" : "";
      paginationContainer.insertAdjacentHTML(
        "beforeend",
        `<a href="#" class="${activeClass}" data-page="${i}">${i}</a>`
      );
    }

    // Next button
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<a href="#" aria-label="Next page" data-page="${
        currentPage + 1
      }">&raquo;</a>`
    );
  };

  /**
   * Applies all active filters to the order list.
   */
  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = statusSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    filteredOrders = currentUserOrders.filter((order) => {
      const orderDate = new Date(order.date);
      const searchMatch = order.id.toLowerCase().includes(searchTerm);
      const statusMatch = statusFilter ? order.status === statusFilter : true;
      const startDateMatch = startDate
        ? orderDate >= new Date(startDate)
        : true;
      const endDateMatch = endDate ? orderDate <= new Date(endDate) : true;

      return searchMatch && statusMatch && startDateMatch && endDateMatch;
    });

    currentPage = 1;
    renderOrders();
  };

  /**
   * Initializes the order history page functionality.
   */
  const initOrderHistory = () => {
    // Check if the necessary elements for this page exist before running the code
    if (
      contentArea &&
      contentArea.querySelector("h1")?.textContent.includes("All Orders")
    ) {
      loadUserOrders();
      renderOrders();

      // Attach event listeners
      searchInput.addEventListener("input", applyFilters);
      statusSelect.addEventListener("change", applyFilters);
      startDateInput.addEventListener("change", applyFilters);
      endDateInput.addEventListener("change", applyFilters);

      paginationContainer.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.closest("a");
        if (target) {
          const page = parseInt(target.dataset.page, 10);
          const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
          if (page > 0 && page <= totalPages) {
            currentPage = page;
            renderOrders();
          }
        }
      });
    }
  };

  // --- INITIALIZATION ---
  // This function will be called when the user clicks the "Order History" link.
  // We listen for a custom event that userDash.js will dispatch.
  document.body.addEventListener("contentLoaded", initOrderHistory);

  // Also run on initial page load in case the user lands directly on the order history view.
  initOrderHistory();
});
