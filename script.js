// script.js

const showLoading = () => {
  document.getElementById("loadingSpinner").classList.remove("d-none");
  document.getElementById("businessCards").classList.add("d-none");
};

const hideLoading = () => {
  document.getElementById("loadingSpinner").classList.add("d-none");
  document.getElementById("businessCards").classList.remove("d-none");
};

const fetchData = async () => {
  showLoading();
  try {
    const response = await fetch("data.json"); // JSON file containing your data
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  } finally {
    hideLoading();
  }
};

const ITEMS_PER_PAGE = 6;
let currentPage = 1;

const renderCards = (businesses, page = 1) => {
  const container = document.getElementById("businessCards");
  container.innerHTML = ""; // Clear existing cards

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedBusinesses = businesses.slice(start, end);

  if (paginatedBusinesses.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="no-results">
          <i class="ri-error-warning-line"></i>
          <p>No businesses found.</p>
        </div>
      </div>`;
    return;
  }

  paginatedBusinesses.forEach((business) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <div class="category-wrapper">
            ${business.category
              .map((cat) => `<span class="highlight-category">${cat}</span>`)
              .join("")}
          </div>
          <h5 class="card-title">${business.name}</h5>
          <p class="card-text"><i class="ri-user-line"></i> ${
            business.owner
          }</p>
          ${
            business.description
              ? `<p class="card-text description">${business.description}</p>`
              : ""
          }
          <div class="contact-info">
            <a href="tel:${
              business.mobile
            }" class="contact-link" aria-label="Call ${business.mobile}">
              <i class="ri-phone-line"></i> ${business.mobile}
            </a>
            <a href="https://wa.me/${
              business.whatsapp
            }" class="contact-link" target="_blank" rel="noopener" aria-label="WhatsApp ${
      business.whatsapp
    }">
              <i class="ri-whatsapp-line"></i> ${business.whatsapp}
            </a>
            <p class="address">
              <i class="ri-map-pin-line"></i> ${business.address}
            </p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById("currentPage").textContent = page;
};

const populateCategories = (businesses) => {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [
    ...new Set(businesses.map((b) => b.category).flat()),
  ];

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
};

// Remove Occupation Filter Functions and References
// const populateOccupations = (businesses) => {
//   const occupationFilter = document.getElementById("occupationFilter");
//   const uniqueOccupations = [...new Set(businesses.map((b) => b.occupation))];

//   uniqueOccupations.forEach((occupation) => {
//     const option = document.createElement("option");
//     option.value = occupation;
//     option.textContent = occupation;
//     occupationFilter.appendChild(option);
//   });
// };

const applyFilter = (businesses) => {
  const categoryFilter = document.getElementById("categoryFilter");
  const searchInput = document.getElementById("searchInput");

  const filterBusinesses = () => {
    const selectedCategory = categoryFilter.value.toLowerCase();
    const searchQuery = searchInput.value.toLowerCase();

    const filteredBusinesses = businesses.filter((b) => {
      const categoryMatch = selectedCategory
        ? b.category.some((cat) => cat.toLowerCase().includes(selectedCategory))
        : true;
      const searchMatch =
        b.name.toLowerCase().includes(searchQuery) ||
        b.owner.toLowerCase().includes(searchQuery) ||
        b.address.toLowerCase().includes(searchQuery) ||
        b.category.join(" ").toLowerCase().includes(searchQuery);
      return categoryMatch && searchMatch;
    });
    currentPage = 1;
    renderCards(filteredBusinesses, currentPage);
    setupPagination(filteredBusinesses);
  };

  categoryFilter.addEventListener("change", filterBusinesses);
  searchInput.addEventListener("input", filterBusinesses);
};

const setupPagination = (businesses) => {
  const paginationContainer = document.getElementById("pagination");
  const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const updatePagination = () => {
    let paginationHTML = `
      <button class="btn btn-sm btn-outline-primary me-2" id="prevPage" ${
        currentPage === 1 ? "disabled" : ""
      }>
        <i class="ri-arrow-left-s-line"></i>
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        paginationHTML += `
          <button class="btn btn-sm ${
            i === currentPage ? "btn-primary" : "btn-outline-primary"
          } me-2 page-number">
            ${i}
          </button>
        `;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        paginationHTML += `<span class="mx-1">...</span>`;
      }
    }

    paginationHTML += `
      <button class="btn btn-sm btn-outline-primary" id="nextPage" ${
        currentPage === totalPages ? "disabled" : ""
      }>
        <i class="ri-arrow-right-s-line"></i>
      </button>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Add event listeners after updating the pagination HTML
    const addPaginationListeners = () => {
      const prevBtn = document.getElementById("prevPage");
      const nextBtn = document.getElementById("nextPage");
      const pageButtons = document.querySelectorAll(".page-number");

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            renderCards(businesses, currentPage);
            updatePagination();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderCards(businesses, currentPage);
            updatePagination();
          }
        });
      }

      pageButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const newPage = parseInt(e.target.textContent);
          if (newPage !== currentPage) {
            currentPage = newPage;
            renderCards(businesses, currentPage);
            updatePagination();
          }
        });
      });
    };

    addPaginationListeners();
  };

  updatePagination();
};

const init = async () => {
  document.documentElement.style.scrollBehavior = "smooth";
  const businesses = await fetchData();
  renderCards(businesses, currentPage);
  populateCategories(businesses);
  // populateOccupations(businesses); // Removed
  applyFilter(businesses);
  setupPagination(businesses);

  // Remove event listener for Request to Add button
  /*
  const requestAddBtn = document.getElementById("requestAddBtn");
  requestAddBtn.addEventListener("click", () => {
    // Define functionality for the button
    // Example: Open a modal or navigate to a request form
    alert("Request to Add button clicked.");
  });
  */
};

document.addEventListener("DOMContentLoaded", init);
