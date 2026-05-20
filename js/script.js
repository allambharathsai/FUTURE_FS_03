(function () {
  "use strict";

  const loader = document.getElementById("loader");
  const nav = document.getElementById("siteNav");
  const scrollTop = document.getElementById("scrollTop");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".menu-item");
  const counters = document.querySelectorAll(".counter");
  const reservationForm = document.getElementById("reservationForm");
  const formMessage = document.getElementById("formMessage");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  let countersPlayed = false;

  window.addEventListener("load", function () {
    setTimeout(function () {
      document.body.classList.add("loaded");
      if (loader) {
        loader.setAttribute("aria-hidden", "true");
      }
    }, 450);
  });

  if (window.AOS) {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  function handleScroll() {
    const scrolled = window.scrollY > 40;
    if (nav) nav.classList.toggle("scrolled", scrolled);
    if (scrollTop) scrollTop.classList.toggle("show", window.scrollY > 650);
    revealCounters();
    setActiveLink();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (scrollTop) {
    scrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      const menu = document.getElementById("mainMenu");
      if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  function setActiveLink() {
    const sections = document.querySelectorAll("main section[id]");
    const currentPosition = window.scrollY + 120;
    let currentId = "home";

    sections.forEach(function (section) {
      if (currentPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const category = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      menuItems.forEach(function (item) {
        const show = item.dataset.category === category;
        item.classList.toggle("d-none", !show);
        if (show) {
          item.animate(
            [
              { opacity: 0, transform: "translateY(16px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 320, easing: "ease-out", fill: "both" }
          );
        }
      });
    });
  });

  function revealCounters() {
    if (countersPlayed || !counters.length) return;
    const firstCounter = counters[0].getBoundingClientRect();
    if (firstCounter.top > window.innerHeight - 80) return;
    countersPlayed = true;

    counters.forEach(function (counter) {
      const target = Number(counter.dataset.target);
      const duration = 1600;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased).toLocaleString("en-IN");
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target.toLocaleString("en-IN");
        }
      }

      requestAnimationFrame(tick);
    });
  }

  if (reservationForm) {
    const dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.min = new Date().toISOString().split("T")[0];
    }

    reservationForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const fields = reservationForm.querySelectorAll("input[required], textarea[required]");
      let isValid = true;

      fields.forEach(function (field) {
        const invalid = !field.checkValidity();
        field.classList.toggle("is-invalid", invalid);
        if (invalid) isValid = false;
      });

      if (!isValid) {
        showFormMessage("Please fill all required details correctly.", "error");
        return;
      }

      const guestName = document.getElementById("fullName").value.trim();
      showFormMessage("Thank you, " + guestName + ". Your reservation request has been received.", "success");
      reservationForm.reset();
    });

    reservationForm.addEventListener("input", function (event) {
      if (event.target.classList.contains("is-invalid") && event.target.checkValidity()) {
        event.target.classList.remove("is-invalid");
      }
    });
  }

  function showFormMessage(message, type) {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.className = "form-message " + type;
  }

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = item.dataset.image;
      lightboxImage.alt = item.querySelector("img").alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLightbox();
  });

  window.addEventListener("scroll", function () {
    const heroBg = document.querySelector(".hero-bg");
    if (!heroBg || window.innerWidth < 768) return;
    heroBg.style.transform = "scale(1.08) translateY(" + window.scrollY * 0.08 + "px)";
  }, { passive: true });
})();
