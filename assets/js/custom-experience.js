(function () {
  'use strict';

  var SUPABASE_URL = 'https://tbgrumrhqepmrdvbqiuy.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ3J1bXJocWVwbXJkdmJxaXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDQ3NDksImV4cCI6MjA5MTAyMDc0OX0.AN76JuaKzhtXAoH8IRuXA3N2-5FsPBAHQNpmuvXumcU';

  var sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  // fallback data in case Supabase is unavailable
  var FALLBACK = [
    {
      name: 'Monuments', slug: 'monuments',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=800&auto=format&fit=crop', alt_text: 'Batalha Monastery' },
        { image_url: 'https://images.unsplash.com/photo-1588286292171-7a1079b3ada6?q=80&w=800&auto=format&fit=crop', alt_text: 'Alcobaça Monastery' },
        { image_url: 'https://images.unsplash.com/photo-1603917236498-1a05e72e0d79?q=80&w=800&auto=format&fit=crop', alt_text: 'Convent of Christ Tomar' },
        { image_url: 'https://images.unsplash.com/photo-1564420228450-d1bca17a3605?q=80&w=800&auto=format&fit=crop', alt_text: 'University of Coimbra' }
      ],
      options: ['Batalha Monastery', 'Alcobaça Monastery', 'Convent of Christ (Tomar)', 'University of Coimbra', 'Leiria Castle']
    },
    {
      name: 'Cities & Areas', slug: 'cities',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1569959220744-ff553533f492?q=80&w=800&auto=format&fit=crop', alt_text: 'Coimbra historic center' },
        { image_url: 'https://images.unsplash.com/photo-1601224860498-e3f1e8a3c737?q=80&w=800&auto=format&fit=crop', alt_text: 'Aveiro canals' },
        { image_url: 'https://images.unsplash.com/photo-1597659840241-37e2b4f0a27f?q=80&w=800&auto=format&fit=crop', alt_text: 'Nazaré coastal view' },
        { image_url: 'https://images.unsplash.com/photo-1613063261829-96df686d4498?q=80&w=800&auto=format&fit=crop', alt_text: 'Óbidos medieval town' }
      ],
      options: ['Coimbra', 'Aveiro', 'Nazaré', 'Óbidos', 'Tomar', 'Fátima', 'Hidden villages']
    },
    {
      name: 'Gastronomy', slug: 'gastronomy',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop', alt_text: 'Fine dining experience' },
        { image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop', alt_text: 'Wine tasting' },
        { image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop', alt_text: 'Portuguese cuisine' },
        { image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop', alt_text: 'Food market' }
      ],
      options: ['Wine tasting', 'Traditional food', 'Fine dining', 'Food markets', 'Local sweets']
    },
    {
      name: 'Points of Interest', slug: 'points',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop', alt_text: 'Scenic Portuguese landscape' },
        { image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop', alt_text: 'Nature park' },
        { image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', alt_text: 'Coastal viewpoint' },
        { image_url: 'https://images.unsplash.com/photo-1504870712357-65ea720d6078?q=80&w=800&auto=format&fit=crop', alt_text: 'Cultural landmark' }
      ],
      options: ['Coastal views', 'Nature parks', 'Religious sites', 'Scenic viewpoints', 'Cultural landmarks']
    },
    {
      name: 'Activities', slug: 'activities',
      images: [
        { image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop', alt_text: 'Boat tour' },
        { image_url: 'https://images.unsplash.com/photo-1502680390548-bdbac40a5781?q=80&w=800&auto=format&fit=crop', alt_text: 'Surfing lessons' },
        { image_url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop', alt_text: 'Spa and wellness' },
        { image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', alt_text: 'Cooking class' }
      ],
      options: ['Boat tours', 'Surfing lessons', 'Horse riding', 'Spa & wellness', 'Cooking classes']
    }
  ];

  var container = document.getElementById('dynamicSections');
  var form = document.getElementById('customForm');
  var confirmation = document.getElementById('confirmation');

  // load sections from Supabase or fallback
  async function loadSections() {
    var sections = null;
    if (sb) {
      try {
        var res = await sb.from('sections').select('*').order('sort_order');
        if (res.data && res.data.length > 0) {
          var imgRes = await sb.from('section_images').select('*').order('sort_order');
          var optRes = await sb.from('section_options').select('*').order('sort_order');

          sections = res.data.map(function (s) {
            return {
              name: s.name,
              slug: s.slug,
              images: (imgRes.data || []).filter(function (i) { return i.section_id === s.id; }),
              options: (optRes.data || []).filter(function (o) { return o.section_id === s.id; })
            };
          });
        }
      } catch (e) {
        console.warn('Supabase unavailable, using fallback');
      }
    }

    if (!sections) sections = FALLBACK;
    renderSections(sections);
  }

  function renderSections(sections) {
    container.innerHTML = '';

    sections.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'ce-block';

      var title = '<h3 class="ce-block__title">' + escapeHtml(section.name) + '</h3>';

      // horizontal carousel
      var carousel = '';
      var images = section.images || [];
      if (images.length > 0) {
        var imgs = images.map(function (img) {
          var url = img.image_url || img;
          var alt = img.alt_text || section.name;
          return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(alt) + '" class="ce-carousel__img" loading="lazy">';
        }).join('');
        carousel = '<div class="ce-carousel"><div class="ce-carousel__track">' + imgs + '</div></div>';
      }

      // checkboxes
      var opts = section.options || [];
      var checkboxes = opts.map(function (opt) {
        var label = opt.label || opt;
        return '<label class="ce-checkbox">' +
          '<input type="checkbox" name="' + escapeHtml(section.slug) + '" value="' + escapeHtml(label) + '">' +
          '<span>' + escapeHtml(label) + '</span></label>';
      }).join('');

      block.innerHTML = title + carousel + '<div class="ce-checkbox-group">' + checkboxes + '</div>';
      container.appendChild(block);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // validation
  function showError(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('is-visible');
  }

  function hideError(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('is-visible');
  }

  // clear errors on input
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('is-invalid');
      var parent = el.closest('.ce-field, .ce-block--price');
      if (parent) {
        var err = parent.querySelector('.ce-field-error');
        if (err) err.classList.remove('is-visible');
      }
    });
  });

  function getChecked(name) {
    var vals = [];
    form.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
      vals.push(el.value);
    });
    return vals;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    // name
    var nameInput = form.elements['name'];
    if (!nameInput.value.trim()) {
      showError('nameError');
      nameInput.classList.add('is-invalid');
      valid = false;
    } else {
      hideError('nameError');
      nameInput.classList.remove('is-invalid');
    }

    // email
    var emailInput = form.elements['email'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      showError('emailError');
      emailInput.classList.add('is-invalid');
      valid = false;
    } else {
      hideError('emailError');
      emailInput.classList.remove('is-invalid');
    }

    // price checkbox
    var priceBox = document.getElementById('acceptedPrice');
    if (!priceBox.checked) {
      showError('priceError');
      valid = false;
    } else {
      hideError('priceError');
    }

    if (!valid) {
      var first = form.querySelector('.ce-field-error.is-visible');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // build message
    var peopleRadio = form.querySelector('input[name="people"]:checked');
    var dateFrom = form.elements['date_from'] ? form.elements['date_from'].value : '';
    var dateTo = form.elements['date_to'] ? form.elements['date_to'].value : '';
    var dates = '';
    if (dateFrom && dateTo) dates = dateFrom + ' to ' + dateTo;
    else if (dateFrom) dates = 'From ' + dateFrom;

    var lines = [
      'New Custom Experience Request',
      '',
      'Name: ' + nameInput.value.trim(),
      'Email: ' + emailInput.value.trim()
    ];

    var phone = (form.elements['phone'].value || '').trim();
    if (phone) lines.push('Phone: ' + phone);
    if (dates) lines.push('Dates: ' + dates);
    lines.push('People: ' + (peopleRadio ? peopleRadio.value : ''));

    // dynamic sections
    var allCheckboxNames = [];
    form.querySelectorAll('.ce-checkbox-group input[type="checkbox"]').forEach(function (cb) {
      if (allCheckboxNames.indexOf(cb.name) === -1) allCheckboxNames.push(cb.name);
    });

    allCheckboxNames.forEach(function (name) {
      var vals = getChecked(name);
      if (vals.length) lines.push(name.charAt(0).toUpperCase() + name.slice(1) + ': ' + vals.join(', '));
    });

    var notes = (form.elements['notes'].value || '').trim();
    if (notes) lines.push('Notes: ' + notes);

    var message = lines.join('\n');
    var waPhone = '351000000000';
    var url = 'https://wa.me/' + encodeURIComponent(waPhone) + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');

    form.style.display = 'none';
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // load on page ready
  loadSections();

})();
