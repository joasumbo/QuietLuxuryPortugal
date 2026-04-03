(function () {
  'use strict';

  var form = document.getElementById('customForm');
  var confirmation = document.getElementById('confirmation');
  if (!form) return;

  // nav scroll
  var nav = document.getElementById('nav');
  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  handleNavScroll();

  // mobile menu
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  // validation helpers
  function showError(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('is-visible');
  }

  function hideError(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('is-visible');
  }

  function markInvalid(input) {
    input.classList.add('is-invalid');
  }

  function clearInvalid(input) {
    input.classList.remove('is-invalid');
  }

  // clear errors on input
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      clearInvalid(el);
      var errorId = el.closest('.ce-field, .ce-block--price');
      if (errorId) {
        var errorEl = errorId.querySelector('.ce-field-error');
        if (errorEl) errorEl.classList.remove('is-visible');
      }
    });
  });

  // collect checked values
  function getChecked(name) {
    var checked = [];
    form.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
      checked.push(el.value);
    });
    return checked;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    // validate price checkbox
    var priceBox = document.getElementById('acceptedPrice');
    if (!priceBox.checked) {
      showError('priceError');
      valid = false;
    } else {
      hideError('priceError');
    }

    // validate name
    var nameInput = form.elements['name'];
    if (!nameInput.value.trim()) {
      showError('nameError');
      markInvalid(nameInput);
      valid = false;
    } else {
      hideError('nameError');
      clearInvalid(nameInput);
    }

    // validate email
    var emailInput = form.elements['email'];
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError('emailError');
      markInvalid(emailInput);
      valid = false;
    } else {
      hideError('emailError');
      clearInvalid(emailInput);
    }

    if (!valid) {
      var firstError = form.querySelector('.ce-field-error.is-visible, .ce-block--price .ce-field-error.is-visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // build data
    var peopleRadio = form.querySelector('input[name="people"]:checked');
    var data = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: (form.elements['phone'].value || '').trim(),
      dates: (form.elements['dates'].value || '').trim(),
      people: peopleRadio ? peopleRadio.value : '',
      monuments: getChecked('monuments'),
      cities: getChecked('cities'),
      gastronomy: getChecked('gastronomy'),
      points: getChecked('points'),
      activities: getChecked('activities'),
      notes: (form.elements['notes'].value || '').trim(),
      accepted_price: true
    };

    // send via WhatsApp
    var lines = [
      'New Custom Experience Request',
      '',
      'Name: ' + data.name,
      'Email: ' + data.email
    ];
    if (data.phone) lines.push('Phone: ' + data.phone);
    if (data.dates) lines.push('Dates: ' + data.dates);
    lines.push('People: ' + data.people);

    if (data.monuments.length) lines.push('Monuments: ' + data.monuments.join(', '));
    if (data.cities.length) lines.push('Cities: ' + data.cities.join(', '));
    if (data.gastronomy.length) lines.push('Gastronomy: ' + data.gastronomy.join(', '));
    if (data.points.length) lines.push('Points: ' + data.points.join(', '));
    if (data.activities.length) lines.push('Activities: ' + data.activities.join(', '));
    if (data.notes) lines.push('Notes: ' + data.notes);

    var message = lines.join('\n');
    var phone = '351000000000';
    var url = 'https://wa.me/' + encodeURIComponent(phone) + '?text=' + encodeURIComponent(message);

    window.open(url, '_blank', 'noopener,noreferrer');

    // show confirmation
    form.style.display = 'none';
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

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
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})();
