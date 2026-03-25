(function () {
  'use strict';

  // nav scroll effect
  var nav = document.getElementById('nav');
  var scrollThreshold = 80;

  function handleNavScroll() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  // mobile menu toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  // close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  // highlight active nav link based on scroll position
  var sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    var scrollPos = window.scrollY + 200;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = navLinks.querySelector('a[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // scroll animations via IntersectionObserver
  var animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // parallax on scroll
  var parallaxElements = document.querySelectorAll('.parallax-bg img');

  var isMobile = window.innerWidth <= 768;

  function handleParallax() {
    if (isMobile) return;
    var scrollY = window.scrollY;
    parallaxElements.forEach(function (img) {
      var parent = img.closest('section') || img.closest('.hero');
      if (!parent) return;
      var rect = parent.getBoundingClientRect();
      var parentTop = rect.top + scrollY;
      var parentHeight = rect.height;

      // only apply when the section is in view
      if (scrollY + window.innerHeight > parentTop && scrollY < parentTop + parentHeight) {
        var offset = (scrollY - parentTop) * 0.25;
        img.style.transform = 'translate3d(0, ' + offset + 'px, 0) scale(1.1)';
      }
    });
  }

  // update isMobile on resize
  window.addEventListener('resize', function () {
    isMobile = window.innerWidth <= 768;
  });

  // hide scroll hint after first scroll
  var scrollHint = document.querySelector('.hero__scroll-hint');
  var hintHidden = false;

  function handleScrollHint() {
    if (!hintHidden && window.scrollY > 100 && scrollHint) {
      scrollHint.style.transition = 'opacity 0.6s ease';
      scrollHint.style.opacity = '0';
      hintHidden = true;
    }
  }

  // throttled scroll handler using rAF
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavScroll();
        highlightNav();
        handleParallax();
        handleScrollHint();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // run once on load
  handleNavScroll();
  highlightNav();
  handleParallax();

  // contact form -> WhatsApp redirect
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var dates = form.elements['dates'].value.trim();

      if (!name || !email || !dates) return;

      var message = 'Hello, I would like to request a Quiet Luxury Portugal experience.\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Preferred dates: ' + dates;

      var phone = '351000000000';
      var url = 'https://wa.me/' + encodeURIComponent(phone) + '?text=' + encodeURIComponent(message);

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav ? nav.offsetHeight : 0;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

})();
