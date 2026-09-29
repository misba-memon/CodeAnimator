document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".algorithm-section");
  const cards = document.querySelectorAll(".card[data-algo]");
  const searchInput = document.getElementById("search");
  const searchButton = document.querySelector("button");
  const notification = document.getElementById("notification");
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeMobile = document.querySelector(".close-mobile");
  // Mobile search (inside mobile menu)
  const mobileSearchInput = document.getElementById("mobile-search");
  const mobileSearchButton = document.querySelector(".mobile-search button");
  hamburger.addEventListener("click", () => {
    if (window.innerWidth <= 768) { // only for mobile
      mobileMenu.classList.add("active");
    }
  });  
  // Hamburger click opens sliding mobile menu
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    hamburger.style.display = "none";
  });

  // Close button in mobile menu
  closeMobile.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    hamburger.style.display = "block"; // show hamburger again
  });

  // Optional: hide desktop search on mobile
  const desktopSearch = document.querySelector(".desktop-search");
  function handleResize() {
    if (window.innerWidth <= 768) {
      desktopSearch.style.display = "none";
    } else {
      desktopSearch.style.display = "flex";
    }
  }
  window.addEventListener("resize", handleResize);
  handleResize();

  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }

  // ====== Search Button Click ======
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    let foundAny = false;

    if (query === "") {
      showNotification("Please enter an algorithm name!");
      return;
    }

    sections.forEach((section) => {
      let foundInSection = false;
      const items = section.querySelectorAll(".algo-item");

      items.forEach((item) => {
        const card = item.querySelector(".card");
        const algoName = card.getAttribute("data-algo").toLowerCase();

        if (algoName.includes(query)) {
          item.style.display = "flex"; // show matching card
          foundInSection = true;
          foundAny = true;
        } else {
          item.style.display = "none"; // hide non-matching card
        }
      });

      // Show section only if it has matching cards
      section.style.display = foundInSection ? "flex" : "none";

      // Center cards under heading
      const cardContainer = section.querySelector(".card-container");
      if (cardContainer) {
        cardContainer.style.justifyContent = "center";
      }
    });

    if (!foundAny) {
      showNotification("No algorithm found!");
    }
  });
  //mobile search button
  mobileSearchButton.addEventListener("click", () => {
    const query = mobileSearchInput.value.toLowerCase().trim();
    let foundAny = false;

    if (query === "") {
      showNotification("Please enter an algorithm name!");
      return;
    }

    sections.forEach((section) => {
      let foundInSection = false;
      const items = section.querySelectorAll(".algo-item");

      items.forEach((item) => {
        const card = item.querySelector(".card");
        const algoName = card.getAttribute("data-algo").toLowerCase();

        if (algoName.includes(query)) {
          item.style.display = "flex"; // show matching card
          foundInSection = true;
          foundAny = true;
        } else {
          item.style.display = "none"; // hide non-matching card
        }
      });

      // Show section only if it has matching cards
      section.style.display = foundInSection ? "flex" : "none";

      // Center cards under heading
      const cardContainer = section.querySelector(".card-container");
      if (cardContainer) {
        cardContainer.style.justifyContent = "center";
      }
    });

    if (!foundAny) {
      showNotification("No algorithm found!");
    }
    if (window.innerWidth <= 768) {
      mobileMenu.classList.remove("active");
      hamburger.style.display = "block";
    }
  });

  // ====== Card Click Logic ======
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const isLoggedIn = localStorage.getItem("userEmail");

      if (isLoggedIn) {
        const algoName = card.getAttribute("data-algo");
        window.location.href = `algo-detail.html?algo=${encodeURIComponent(algoName)}`;
      } else {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("login-popup").style.display = "block";
      }
    });
  });
}); 