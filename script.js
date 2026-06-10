const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-nav");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".sr-only").textContent = "Menü öffnen";
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.querySelector(".sr-only").textContent = open ? "Menü öffnen" : "Menü schließen";
    mobileMenu.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    if (open && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-item button").forEach((item) => item.setAttribute("aria-expanded", "false"));
    button.setAttribute("aria-expanded", String(!expanded));
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    status.textContent = "Vielen Dank. Wir melden uns innerhalb eines Werktages bei Ihnen.";
    form.reset();
  });
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const track = gallery.querySelector(".gallery-track");
  const slides = [...gallery.querySelectorAll(".gallery-slide")];
  const dotsContainer = gallery.querySelector(".gallery-dots");
  const previousButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  let currentIndex = 0;
  let touchStartX = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Bild ${index + 1} anzeigen`);
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.append(dot);
    return dot;
  });

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
      dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
    });
  };

  previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
  gallery.setAttribute("tabindex", "0");
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
  });
  gallery.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  gallery.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(currentIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  showSlide(0);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
