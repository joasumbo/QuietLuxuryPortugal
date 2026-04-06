(function () {
  'use strict';

  var SUPABASE_URL = 'https://tbgrumrhqepmrdvbqiuy.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ3J1bXJocWVwbXJkdmJxaXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDQ3NDksImV4cCI6MjA5MTAyMDc0OX0.AN76JuaKzhtXAoH8IRuXA3N2-5FsPBAHQNpmuvXumcU';
  var ADMIN_EMAIL = 'admin@quietluxuryportugal.com';

  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  var loginView = document.getElementById('loginView');
  var dashView = document.getElementById('dashView');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');
  var adminEmail = document.getElementById('adminEmail');
  var logoutBtn = document.getElementById('logoutBtn');
  var sectionsContainer = document.getElementById('sectionsContainer');

  // check if already logged in
  sb.auth.getSession().then(function (res) {
    if (res.data.session) {
      showDash(res.data.session.user);
    }
  });

  // login
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    loginError.hidden = true;

    var user = document.getElementById('loginUser').value.trim();
    var pass = document.getElementById('loginPass').value;

    // map username to email
    var email = user === 'admin' ? ADMIN_EMAIL : user;
    if (email.indexOf('@') === -1) email = email + '@quietluxuryportugal.com';

    var res = await sb.auth.signInWithPassword({ email: email, password: pass });
    if (res.error) {
      loginError.textContent = res.error.message || 'Invalid credentials.';
      loginError.hidden = false;
      return;
    }

    showDash(res.data.user);
  });

  // logout
  logoutBtn.addEventListener('click', async function () {
    await sb.auth.signOut();
    loginView.hidden = false;
    dashView.hidden = true;
  });

  function showDash(user) {
    loginView.hidden = true;
    dashView.hidden = false;
    adminEmail.textContent = user.email;
    loadSections();
  }

  // load all sections with images and options
  async function loadSections() {
    sectionsContainer.innerHTML = '<p style="color: var(--gray-light)">Loading...</p>';

    var secRes = await sb.from('sections').select('*').order('sort_order');
    var imgRes = await sb.from('section_images').select('*').order('sort_order');
    var optRes = await sb.from('section_options').select('*').order('sort_order');

    if (secRes.error) {
      sectionsContainer.innerHTML = '<p class="admin-error">Error: ' + secRes.error.message + '</p>';
      return;
    }

    var sections = secRes.data || [];
    var images = imgRes.data || [];
    var options = optRes.data || [];

    sectionsContainer.innerHTML = '';

    sections.forEach(function (sec) {
      var secImages = images.filter(function (i) { return i.section_id === sec.id; });
      var secOptions = options.filter(function (o) { return o.section_id === sec.id; });
      sectionsContainer.appendChild(buildSectionCard(sec, secImages, secOptions));
    });
  }

  function buildSectionCard(section, images, options) {
    var card = document.createElement('div');
    card.className = 'admin-section';
    card.dataset.id = section.id;

    // header (click to toggle)
    var header = document.createElement('div');
    header.className = 'admin-section__header';
    header.innerHTML =
      '<span class="admin-section__name">' + esc(section.name) + '</span>' +
      '<span class="admin-section__toggle">&#9660;</span>';
    header.addEventListener('click', function () {
      card.classList.toggle('is-open');
    });

    // body
    var body = document.createElement('div');
    body.className = 'admin-section__body';

    // images sub
    var imgSub = document.createElement('div');
    imgSub.className = 'admin-sub';
    imgSub.innerHTML = '<div class="admin-sub__title">Images</div>';

    var imgList = document.createElement('div');
    imgList.className = 'admin-sub__list';
    images.forEach(function (img) {
      imgList.appendChild(buildImageItem(img, imgList));
    });
    imgSub.appendChild(imgList);

    // add image
    var addImgRow = document.createElement('div');
    addImgRow.className = 'admin-add-row';
    addImgRow.innerHTML =
      '<input type="url" placeholder="Image URL" class="admin-add-url">' +
      '<input type="text" placeholder="Alt text" class="admin-add-alt">' +
      '<button class="admin-btn admin-btn--gold admin-btn--small" type="button">Add</button>';

    addImgRow.querySelector('button').addEventListener('click', async function () {
      var urlInput = addImgRow.querySelector('.admin-add-url');
      var altInput = addImgRow.querySelector('.admin-add-alt');
      var url = urlInput.value.trim();
      if (!url) return;

      var order = images.length;
      var res = await sb.from('section_images').insert({
        section_id: section.id,
        image_url: url,
        alt_text: altInput.value.trim(),
        sort_order: order
      }).select();

      if (res.data && res.data[0]) {
        images.push(res.data[0]);
        imgList.appendChild(buildImageItem(res.data[0], imgList));
        urlInput.value = '';
        altInput.value = '';
      }
    });

    imgSub.appendChild(addImgRow);
    body.appendChild(imgSub);

    // options sub
    var optSub = document.createElement('div');
    optSub.className = 'admin-sub';
    optSub.innerHTML = '<div class="admin-sub__title">Options</div>';

    var optList = document.createElement('div');
    optList.className = 'admin-sub__list';
    options.forEach(function (opt) {
      optList.appendChild(buildOptionItem(opt, optList));
    });
    optSub.appendChild(optList);

    // add option
    var addOptRow = document.createElement('div');
    addOptRow.className = 'admin-add-row';
    addOptRow.innerHTML =
      '<input type="text" placeholder="Option label">' +
      '<button class="admin-btn admin-btn--gold admin-btn--small" type="button">Add</button>';

    addOptRow.querySelector('button').addEventListener('click', async function () {
      var input = addOptRow.querySelector('input');
      var label = input.value.trim();
      if (!label) return;

      var order = options.length;
      var res = await sb.from('section_options').insert({
        section_id: section.id,
        label: label,
        sort_order: order
      }).select();

      if (res.data && res.data[0]) {
        options.push(res.data[0]);
        optList.appendChild(buildOptionItem(res.data[0], optList));
        input.value = '';
      }
    });

    optSub.appendChild(addOptRow);
    body.appendChild(optSub);

    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  function buildImageItem(img, list) {
    var item = document.createElement('div');
    item.className = 'admin-sub__item';
    item.innerHTML =
      '<img src="' + esc(img.image_url) + '" alt="" class="admin-sub__item-img" onerror="this.style.display=\'none\'">' +
      '<span class="admin-sub__item-text">' + esc(img.image_url) + '</span>';

    var del = document.createElement('button');
    del.className = 'admin-btn admin-btn--danger';
    del.textContent = 'Remove';
    del.addEventListener('click', async function () {
      var res = await sb.from('section_images').delete().eq('id', img.id);
      if (!res.error) item.remove();
    });
    item.appendChild(del);

    return item;
  }

  function buildOptionItem(opt, list) {
    var item = document.createElement('div');
    item.className = 'admin-sub__item';
    item.innerHTML = '<span class="admin-sub__item-text">' + esc(opt.label) + '</span>';

    var del = document.createElement('button');
    del.className = 'admin-btn admin-btn--danger';
    del.textContent = 'Remove';
    del.addEventListener('click', async function () {
      var res = await sb.from('section_options').delete().eq('id', opt.id);
      if (!res.error) item.remove();
    });
    item.appendChild(del);

    return item;
  }

  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

})();
