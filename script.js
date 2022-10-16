'use strict';

///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

const imgTargets = document.querySelectorAll('img[data-src]');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

// -- Modal Window --
const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// -- Scroll to --
btnScrollTo.addEventListener('click', function (e) {
  const sectionOneCoordinats = section1.getBoundingClientRect();

  // console.log(sectionOneCoordinats);
  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// -- Page Navigation --
// document.querySelectorAll('.nav__link').forEach(function (element) {
//   element.addEventListener('click', function (e) {
//     e.preventDefault();
//     const sectionID = this.getAttribute('href');
//     document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const sectionID = e.target.getAttribute('href');
    document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
  }
});

// -- Tabbed Component --
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  // Guard clause
  if (!clicked) return;

  // Removing active classes
  tabs.forEach(elementTabs =>
    elementTabs.classList.remove('operations__tab--active')
  );
  tabsContent.forEach(elementContent =>
    elementContent.classList.remove('operations__content--active')
  );

  // Adding active classes to element by clicking
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// -- Menu Fade Animation --
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// -- Sticky Navigation --
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   this.window.scrollY > initialCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// -- Sticky navigation: Intersection Observer API --
// Get height nav element
const navHeight = nav.getBoundingClientRect().height;

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(entry => {
      !entry.isIntersecting
        ? nav.classList.add('sticky')
        : nav.classList.remove('sticky');
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
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// -- Lazy Load Images --
const loadImg = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 1,
    // rootMargin: '-300px',
  }
);

imgTargets.forEach(img => {
  loadImg.observe(img);
});

// -- Slider --
function slider() {
  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((slide, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (curSlide) {
    document.querySelectorAll('.dots__dot').forEach((dot, i) => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
      .classList.add('dots__dot--active');
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

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;

      goToSlide(slide);
      activateDot(slide);
    }
  });
}

slider();

// -- -- --  "Lectures"  -- --  -- //

// -- Selecting, Creating, and Deleting Elements --
/*
const header = document.querySelector('.header');

// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

console.log(document.querySelector('.header'));
console.log(document.querySelectorAll('.section'));

console.log(document.getElementById('section--1'));
console.log(document.getElementsByClassName('btn'));
console.log(document.getElementsByTagName('button'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');

// message.textContent =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // add as the first child
header.append(message); // add as the last child
// header.before(message); // add before the header
// header.after(message); // add after the header

// Deleting elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // new way
    message.remove();
    // old way
    // message.parentElement.removeChild(message);
  });
*/

// -- Styles, Attributes and Classes --
/*
// Styles
message.style.backgroundColor = 'darkblue';
message.style.width = '120%';

console.log(message.style.backgroundColor);
console.log(message.style.color);

console.log(getComputedStyle(message));
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 35 + 'px';

document.documentElement.style.setProperty('--color-primary', 'pink');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'hello';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.getAttribute('src'));
console.log(logo.src);

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data atributtes
console.log(logo.dataset.versionNumber);

logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use
logo.clasName = 'jonas';
*/

// Types of Events and Event Handlers
/*
const heading1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };
*/

// -- Event Propagation: Bubbling and Capturing --

// -- Event Propagation in Practice --
/*
const generateRGBColor = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomRGBAColor = () =>
  `rgb(${generateRGBColor(0, 255)},${generateRGBColor(
    0,
    255
  )},${generateRGBColor(0, 255)})`;

document
  .querySelector('.nav__link')
  .addEventListener('click', function (e) {
    this.style.backgroundColor = randomRGBAColor();
    console.log('Link', e.target, e.currentTarget);

    // Stop propagation
    e.stopPropagation();
  });

document
  .querySelector('.nav__links')
  .addEventListener('click', function (e) {
    this.style.backgroundColor = randomRGBAColor();
    console.log('Container', e.target, e.currentTarget);
  });

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomRGBAColor();
  console.log('Nav', e.target, e.currentTarget);
});
*/

// -- DOM Traversing --
/*
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'darkviolet';
h1.lastElementChild.style.color = 'darkorange';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.backgroundColor = 'var(--color-tertiary-darker)';

h1.closest('h1').style.background = 'darkblue';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(element =>
  element !== h1
    ? (element.style.transform = 'scale(0.5)')
    : (element.style.transform = 'scale(1)')
);
*/
