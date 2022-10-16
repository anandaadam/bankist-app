"use strict";

// Get All Element
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const section2 = document.querySelector("#section--2");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

const allSections = document.querySelectorAll(".section");

const imgTargets = document.querySelectorAll("img[data-src]");

const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const slides = document.querySelectorAll(".slide");
const dotContainer = document.querySelector(".dots");

// -- Modal Window --
const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// -- Scroll to --
btnScrollTo.addEventListener("click", function (e) {
  const sectionOneCoordinats = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: "smooth" });
});

// -- Page Navigation --
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const sectionID = e.target.getAttribute("href");
    document.querySelector(sectionID).scrollIntoView({ behavior: "smooth" });
  }
});

// -- Tabbed Component --
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // Guard clause
  if (!clicked) return;

  // Removing active classes
  tabs.forEach((elementTabs) =>
    elementTabs.classList.remove("operations__tab--active")
  );
  tabsContent.forEach((elementContent) =>
    elementContent.classList.remove("operations__content--active")
  );

  // Adding active classes to element by clicking
  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// -- Menu Fade Animation --
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector(".nav__logo");

    siblings.forEach((sibling) => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// -- Sticky Navigation --
const navHeight = nav.getBoundingClientRect().height;
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      !entry.isIntersecting
        ? nav.classList.add("sticky")
        : nav.classList.remove("sticky");
    });
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);
observer.observe(header);

// -- Reveal Sections --
const sectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// -- Lazy Load Images --
const loadImg = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 1,
  }
);

imgTargets.forEach((img) => {
  loadImg.observe(img);
});

// -- Slider --
function slider() {
  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((slide, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (curSlide) {
    document.querySelectorAll(".dots__dot").forEach((dot, i) => {
      dot.classList.remove("dots__dot--active");
    });
    document
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    });
  };

  const initSlider = function () {
    createDots();
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  initSlider();

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;

      goToSlide(slide);
      activateDot(slide);
    }
  });
}

slider();
