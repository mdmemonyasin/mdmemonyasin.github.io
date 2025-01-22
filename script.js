// script.js

const fetchData = async () => {
  try {
    const response = await fetch("data.json"); // JSON file containing your data
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const renderCards = (businesses) => {
  const container = document.getElementById("businessCards");
  container.innerHTML = ""; // Clear existing cards

  businesses.forEach((business) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${business.name}</h5>
                    <p class="card-text">Owner: ${business.owner}</p>
                    <p class="card-text">Type: ${business.type}</p>
                    <p class="card-text">Address: ${business.address}</p>
                    <p class="card-text">Mobile: <a href="tel:${business.mobile}">${business.mobile}</a></p>
                    <p class="card-text">WhatsApp: <a href="https://wa.me/${business.whatsapp}" target="_blank">${business.whatsapp}</a></p>
                    <p class="card-text">Category: ${business.category}</p>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
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

const populateOccupations = (businesses) => {
  const occupationFilter = document.getElementById("occupationFilter");
  const uniqueOccupations = [...new Set(businesses.map((b) => b.occupation))];

  uniqueOccupations.forEach((occupation) => {
    const option = document.createElement("option");
    option.value = occupation;
    option.textContent = occupation;
    occupationFilter.appendChild(option);
  });
};

const applyFilter = (businesses) => {
  const categoryFilter = document.getElementById("categoryFilter");
  const occupationFilter = document.getElementById("occupationFilter");

  const filterBusinesses = () => {
    const selectedCategory = categoryFilter.value;
    const selectedOccupation = occupationFilter.value;
    const filteredBusinesses = businesses.filter((b) => {
      const categoryMatch = selectedCategory
        ? b.category.includes(selectedCategory)
        : true;
      const occupationMatch = selectedOccupation
        ? b.occupation === selectedOccupation
        : true;
      return categoryMatch && occupationMatch;
    });
    renderCards(filteredBusinesses);
  };

  categoryFilter.addEventListener("change", filterBusinesses);
  occupationFilter.addEventListener("change", filterBusinesses);
};

const init = async () => {
  const businesses = await fetchData();
  renderCards(businesses);
  populateCategories(businesses);
  populateOccupations(businesses);
  applyFilter(businesses);
};

document.addEventListener("DOMContentLoaded", init);
