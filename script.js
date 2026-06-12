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

document.querySelectorAll("[data-review-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".review-card")];
  const previousButton = carousel.querySelector(".review-prev");
  const nextButton = carousel.querySelector(".review-next");
  const currentPosition = carousel.querySelector(".review-position strong");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = 0;
  let autoplayTimer;
  let touchStartY = 0;

  const showReview = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    const previousIndex = (currentIndex - 1 + slides.length) % slides.length;
    const nextIndex = (currentIndex + 1) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-previous", slideIndex === previousIndex);
      slide.classList.toggle("is-current", slideIndex === currentIndex);
      slide.classList.toggle("is-next", slideIndex === nextIndex);
      slide.setAttribute("aria-hidden", slideIndex === currentIndex ? "false" : "true");
    });
    currentPosition.textContent = String(currentIndex + 1);
  };

  const stopAutoplay = () => window.clearInterval(autoplayTimer);
  const startAutoplay = () => {
    stopAutoplay();
    if (!reduceMotion && !document.hidden) {
      autoplayTimer = window.setInterval(() => showReview(currentIndex + 1), 12000);
    }
  };
  const changeReview = (step) => {
    showReview(currentIndex + step);
    startAutoplay();
  };

  previousButton.addEventListener("click", () => changeReview(-1));
  nextButton.addEventListener("click", () => changeReview(1));
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoplay();
  });
  carousel.addEventListener("touchstart", (event) => {
    touchStartY = event.changedTouches[0].clientY;
    stopAutoplay();
  }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(distance) > 45) showReview(currentIndex + (distance < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });
  document.addEventListener("visibilitychange", startAutoplay);

  showReview(0);
  startAutoplay();
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

const backToTopButton = document.createElement("button");
backToTopButton.type = "button";
backToTopButton.className = "back-to-top";
backToTopButton.setAttribute("aria-label", "Nach oben");
backToTopButton.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.append(backToTopButton);

const updateBackToTopVisibility = () => {
  backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
};

backToTopButton.addEventListener("click", () => {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
});
window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();
