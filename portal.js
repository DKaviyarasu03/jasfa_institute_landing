(() => {
  'use strict';
  const accountEmail = 'Kavi@gmail.com';
  const sessionKey = 'jasfa.candidate';
  const profileKey = 'jasfa.profile.kavi';
  const readingKey = 'jasfa.reading.kavi';
  const page = document.body.dataset.page;
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { localStorage.setItem(key, value); }
  };
  const signedIn = storage.get(sessionKey) === accountEmail;
  const icon = (name) => {
    const paths = {home:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',book:'<path d="M12 5v16M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',exit:'<path d="M9 4H4v16h5m6-12 4 4-4 4m-6-4h10"/>',file:'<path d="M14 2H5v20h14V7ZM14 2v6h5M8 12h8m-8 4h6"/>'};
    return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  };
  const brand = `<a class="brand" href="index.html" aria-label="Jasfa Institute home"><span class="brand-icon" aria-hidden="true">☼</span><span>JASFA<small>INSTITUTE</small></span></a>`;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let profile = {name:'Kavi',phone:'',address:''};
  try { const saved = JSON.parse(storage.get(profileKey)); if (saved && typeof saved === 'object') for (const key of Object.keys(profile)) if (typeof saved[key] === 'string') profile[key] = saved[key]; } catch {}
  let savedPage = Math.min(204, Math.max(1, parseInt(storage.get(readingKey), 10) || 1));
  const name = escapeHTML(profile.name || 'Kavi');
  const firstName = escapeHTML((profile.name || 'Kavi').trim().split(/\s+/)[0]);
  const initials = escapeHTML((profile.name || 'Kavi').trim().split(/\s+/).slice(0,2).map(n => n[0]).join('').toUpperCase());
  const title = 'PV Solar Panel Installation Technician';
  const footer = `<footer class="portal-footer"><span>© ${new Date().getFullYear()} Jasfa Institute</span><span>Learn solar. Shape tomorrow.</span></footer>`;

  if (page === 'login') {
    if (signedIn && !new URLSearchParams(location.search).has('admin')) { location.replace('candidate-dashboard.html'); return; }
    const admin = new URLSearchParams(location.search).has('admin');
    document.getElementById('app').innerHTML = `<div class="login-layout"><aside class="login-story">${brand}<div class="story-copy"><div class="eyebrow" style="color:var(--lime)">Your next chapter starts here</div><h1>Build your skills.<br><span>Power your future.</span></h1><p>Your learning, resources and candidate profile. Together in one place.</p><div class="story-steps"><span>01 &nbsp; Sign in</span><span>02 &nbsp; Learn</span><span>03 &nbsp; Grow</span></div></div><small>Jasfa Institute · Candidate learning portal</small></aside><main class="login-main"><a class="back-link" href="index.html">← Back to institute website</a><div class="login-box"><div class="eyebrow">${admin ? 'Administration' : 'Candidate portal'}</div><h1>Welcome back.</h1><p>${admin ? 'Admin sign-in is unavailable in this preview.' : 'Sign in to continue your learning journey.'}</p>${admin ? '<a class="btn btn-primary" href="candidate-login.html">Go to candidate login →</a>' : `<form id="loginForm"><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" placeholder="Enter your email address" autocomplete="username" required autofocus></div><div class="field"><label for="password">Password</label><div class="password-wrap"><input id="password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required><button class="password-toggle" id="showPassword" type="button" aria-label="Show password" aria-pressed="false">Show</button></div></div><p class="error" id="loginError" role="alert"></p><button class="btn btn-primary" type="submit">Sign in to your portal <span aria-hidden="true">→</span></button></form>`}<div class="login-help">Need help accessing your account?<br><a class="text-link" href="mailto:info@jasfaedutech.org?subject=Candidate%20login%20support">Contact the institute ↗</a></div><p class="demo-note">Demo portal · Use your existing candidate credentials.</p></div></main></div>`;
    if (admin) return;
    document.getElementById('showPassword').addEventListener('click', event => {
      const input = document.getElementById('password'); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; event.currentTarget.textContent = show ? 'Hide' : 'Show'; event.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); event.currentTarget.setAttribute('aria-pressed', String(show));
    });
    const form = document.getElementById('loginForm');
    form.addEventListener('input', () => document.getElementById('loginError').textContent = '');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (form.email.value.trim().toLowerCase() !== accountEmail.toLowerCase() || form.password.value !== 'kavi@1234') { document.getElementById('loginError').textContent = 'Incorrect email or password. Please try again.'; return; }
      try { storage.set(sessionKey, accountEmail); } catch { document.getElementById('loginError').textContent = 'Please enable browser storage to sign in to the portal.'; return; }
      const next = new URLSearchParams(location.search).get('next');
      location.assign(['candidate-dashboard.html','candidate-learn.html','candidate-profile.html'].includes(next) ? next : 'candidate-dashboard.html');
    });
    return;
  }
  if (!signedIn) { location.replace(`candidate-login.html?next=${encodeURIComponent(location.pathname.split('/').pop())}`); return; }
  const labels = {dashboard:'Overview',learn:'My learning',profile:'My profile'};
  const sidebar = `<aside class="sidebar">${brand}<div class="sidebar-label">CANDIDATE WORKSPACE</div><nav class="side-nav" aria-label="Candidate navigation">${[['dashboard','home','Overview'],['learn','book','My learning'],['profile','user','My profile']].map(([key, symbol, label]) => `<a href="candidate-${key}.html" class="${page === key ? 'active' : ''}" ${page === key ? 'aria-current="page"' : ''}>${icon(symbol)}${label}</a>`).join('')}</nav><div class="sidebar-bottom"><div class="help-box"><strong>Here to help you grow.</strong><p>Questions about your learning or account?</p><a href="mailto:info@jasfaedutech.org?subject=Candidate%20portal%20support">Contact support ↗</a></div><button class="logout" id="logout" type="button">${icon('exit')} Log out</button></div></aside>`;
  const courseCard = `<article class="card course-card"><span class="badge">Learning resource available</span><h3>${title}</h3><p>Build your understanding of solar photovoltaic systems with your participant handbook.</p><div class="course-meta"><span>Participant handbook</span><span>204 pages</span><span>PDF resource</span></div><div class="card-footer"><span class="reading-info">${storage.get(readingKey) ? `Saved reading page: ${savedPage} of 204` : 'Ready when you are. Start your first page.'}</span><a class="btn btn-primary" href="candidate-learn.html">${storage.get(readingKey) ? 'Continue learning' : 'Start learning'} →</a></div></article>`;
  let content = '';
  if (page === 'dashboard') content = `<div class="page-heading"><div><div class="eyebrow">Your learning workspace</div><h1>Welcome back, ${firstName}.</h1><p>A little progress today. A brighter future tomorrow.</p></div><a class="btn" href="candidate-profile.html">${icon('user')} View profile</a></div><section class="welcome" aria-labelledby="welcomeTitle"><div class="welcome-copy"><div class="eyebrow">Learn with purpose</div><h2 id="welcomeTitle">Your future in solar energy starts with knowledge.</h2><p>Pick up your handbook, explore the fundamentals, and keep moving forward at your own pace.</p><a class="btn btn-lime" href="candidate-learn.html">Go to my learning <span aria-hidden="true">↗</span></a></div><div class="solar-art" aria-hidden="true"><div class="sun"></div><div class="array"></div></div></section><div class="stats"><div class="stat"><span class="stat-icon">${icon('book')}</span><div><strong>01</strong><small>Learning resource</small></div></div><div class="stat"><span class="stat-icon">${icon('file')}</span><div><strong>204</strong><small>Handbook pages</small></div></div><div class="stat"><span class="stat-icon">${icon('book')}</span><div><strong>${storage.get(readingKey) ? savedPage : '—'}</strong><small>Saved reading page</small></div></div></div><div class="content-grid"><section><div class="section-heading"><h2>My learning</h2><a class="text-link" href="candidate-learn.html">View resource →</a></div>${courseCard}</section><aside><div class="section-heading"><h2>Your essentials</h2></div><article class="card resource-card"><div class="resource-icon">${icon('user')}</div><h3>Make this space yours</h3><p>Keep your contact details up to date in your candidate profile.</p><a class="text-link" href="candidate-profile.html">Manage profile →</a></article><article class="card resource-card"><h3>Need a hand?</h3><p>Our institute team can help with your account and learning resources.</p><a class="text-link" href="mailto:info@jasfaedutech.org">Get in touch ↗</a></article></aside></div>`;
  if (page === 'learn') content = `<div class="page-heading"><div><div class="eyebrow">Your resource library</div><h1>My learning</h1><p>Your handbook. Your pace. Keep building your knowledge.</p></div><span class="badge">Reading access</span></div><section class="card" aria-label="Participant handbook"><div class="reader-bar"><div><h2>${title}</h2><p>Participant handbook · 204 pages</p></div><form class="bookmark-controls" id="readingForm"><label for="readingPage">Reading page</label><input id="readingPage" type="number" min="1" max="204" step="1" value="${savedPage}" required><button class="btn" type="submit">Save & open</button></form></div><div class="pdf-stage" id="pdfStage" aria-busy="true"><div class="pdf-loading" id="pdfLoading"><span class="pdf-spinner" id="pdfSpinner" aria-hidden="true"></span><div role="status" aria-live="polite"><h3 id="pdfLoadingTitle">Loading your handbook</h3><p id="pdfLoadingMessage">Please wait while we open your learning resource.</p></div><div class="pdf-loading-actions" id="pdfLoadingActions" hidden><button class="btn btn-primary" id="retryHandbook" type="button">Try again</button><button class="btn" id="showHandbook" type="button">Show reader</button></div></div><iframe class="pdf-viewer" id="handbookViewer" title="PV Solar Panel Installation Technician participant handbook"></iframe></div></section><p class="status" id="readingStatus" role="status"></p><p class="reader-note">Enter a page above to save your place on this browser. For help accessing the handbook, contact the institute.</p>`;
  if (page === 'profile') content = `<div class="page-heading"><div><div class="eyebrow">Your candidate account</div><h1>My profile</h1><p>Your details, all in one place.</p></div><span class="badge">Candidate</span></div><div class="profile-layout"><aside class="card profile-summary"><div class="avatar" data-initials>${initials}</div><h2 data-profile-name>${name}</h2><p class="muted">${accountEmail}</p><span class="badge">Candidate account</span><hr><div class="eyebrow">Learning program</div><p>${title}</p></aside><section class="card profile-form"><div class="form-header"><h2>Personal information</h2><p>Update your contact details below.</p></div><form id="profileForm"><div class="fields"><div class="field"><label for="fullName">Full name</label><input id="fullName" name="fullName" value="${escapeHTML(profile.name)}" required maxlength="80" autocomplete="name"></div><div class="field"><label for="profileEmail">Email address</label><input id="profileEmail" value="${accountEmail}" type="email" readonly autocomplete="email"><small>Contact the institute to change your sign-in email.</small></div><div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" value="${escapeHTML(profile.phone)}" placeholder="Add your phone number" maxlength="25" autocomplete="tel"></div><div class="field full"><label for="address">Address</label><textarea id="address" name="address" maxlength="500" placeholder="Add your address" autocomplete="street-address">${escapeHTML(profile.address)}</textarea></div></div><div class="form-actions"><span class="status" id="profileStatus" role="status">Profile changes are saved on this browser.</span><div><button class="btn" type="reset">Reset</button> <button class="btn btn-primary" type="submit">Save changes →</button></div></div></form></section></div>`;
  document.getElementById('app').innerHTML = `${sidebar}<div class="workspace"><header class="topbar"><div class="breadcrumbs">Candidate portal <span>/ &nbsp; ${labels[page]}</span></div><a class="account" href="candidate-profile.html" aria-label="View your profile"><span class="avatar" data-initials>${initials}</span><span class="account-text"><strong data-profile-name>${name}</strong><small>Candidate</small></span></a></header><main class="main-content">${content}${footer}</main></div>`;
  document.getElementById('logout').addEventListener('click', () => { try { localStorage.removeItem(sessionKey); } catch {} location.replace('candidate-login.html'); });
  // Recheck authentication when the browser restores a page from its back/forward cache.
  window.addEventListener('pageshow', () => { if (storage.get(sessionKey) !== accountEmail) location.replace('candidate-login.html'); });
  let openHandbook;
  if (page === 'learn') {
    const viewer = document.getElementById('handbookViewer');
    const stage = document.getElementById('pdfStage');
    const loading = document.getElementById('pdfLoading');
    const spinner = document.getElementById('pdfSpinner');
    const loadingTitle = document.getElementById('pdfLoadingTitle');
    const loadingMessage = document.getElementById('pdfLoadingMessage');
    const actions = document.getElementById('pdfLoadingActions');
    let loadingTimer;
    let readerOpened = false;
    const finishLoading = () => {
      readerOpened = true;
      clearTimeout(loadingTimer);
      loading.hidden = true;
      stage.setAttribute('aria-busy', 'false');
    };
    const showLoadingProblem = (failed) => {
      spinner.hidden = true;
      loadingTitle.textContent = failed ? 'Unable to open the handbook' : 'Your handbook is taking a little longer';
      loadingMessage.textContent = failed
        ? 'Please check your connection and try again.'
        : 'This is a large handbook. You can keep waiting, check the reader, or try again.';
      actions.hidden = false;
    };
    openHandbook = (retry = false) => {
      // Page jumps within an opened PDF may not emit another iframe load event.
      if (readerOpened && !retry) {
        viewer.src = `solar-panel-participant-handbook.pdf#page=${savedPage}&toolbar=0&navpanes=0`;
        return;
      }
      readerOpened = false;
      clearTimeout(loadingTimer);
      loading.hidden = false;
      spinner.hidden = false;
      actions.hidden = true;
      loadingTitle.textContent = 'Loading your handbook';
      loadingMessage.textContent = 'Please wait while we open your learning resource.';
      stage.setAttribute('aria-busy', 'true');
      loadingTimer = setTimeout(() => showLoadingProblem(false), 30000);
      // Register listeners before assigning src so cached documents also dismiss loading.
      const retryQuery = retry ? `?retry=${Date.now()}` : '';
      viewer.src = `solar-panel-participant-handbook.pdf${retryQuery}#page=${savedPage}&toolbar=0&navpanes=0`;
    };
    // Native PDF viewers expose iframe navigation, not individual page-render events.
    viewer.addEventListener('load', finishLoading);
    viewer.addEventListener('error', () => {
      clearTimeout(loadingTimer);
      showLoadingProblem(true);
    });
    document.getElementById('retryHandbook').addEventListener('click', () => openHandbook(true));
    document.getElementById('showHandbook').addEventListener('click', finishLoading);
    window.addEventListener('pagehide', () => clearTimeout(loadingTimer));
    openHandbook();
  }
  if (page === 'learn') {
    // Interface deterrents only: browser menus, extensions and direct file requests
    // cannot be secured by client-side JavaScript or PDF viewer parameters.
    const restrictReaderActions = event => {
      const key = (event.key || '').toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const inspectShortcut = key === 'f12' || (modifier && event.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) || (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key));
      if (inspectShortcut || (modifier && ['s', 'p', 'u'].includes(key))) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    document.addEventListener('contextmenu', event => event.preventDefault(), true);
    document.addEventListener('keydown', restrictReaderActions, true);
  }
  if (page === 'learn') document.getElementById('readingForm').addEventListener('submit', event => {
    event.preventDefault(); const input = document.getElementById('readingPage'); if (!input.reportValidity()) return;
    savedPage = Number(input.value);
    try { storage.set(readingKey, String(savedPage)); document.getElementById('readingStatus').textContent = `Your reading place is saved at page ${savedPage}.`; } catch { document.getElementById('readingStatus').textContent = 'Browser storage is unavailable. Your reading place could not be saved.'; }
    openHandbook();
  });
  if (page === 'profile') document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault(); const form = event.currentTarget; const updated = {name:form.fullName.value.trim(),phone:form.phone.value.trim(),address:form.address.value.trim()};
    if (!updated.name) { form.fullName.setCustomValidity('Please enter your name.'); form.fullName.reportValidity(); form.fullName.addEventListener('input', () => form.fullName.setCustomValidity(''), {once:true}); return; }
    try { storage.set(profileKey, JSON.stringify(updated)); } catch { document.getElementById('profileStatus').textContent = 'Your changes could not be saved. Please enable browser storage.'; return; }
    document.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = updated.name);
    document.querySelectorAll('[data-initials]').forEach(el => el.textContent = updated.name.split(/\s+/).slice(0,2).map(n => n[0]).join('').toUpperCase());
    for (const [field, value] of [['fullName',updated.name],['phone',updated.phone],['address',updated.address]]) { form[field].value = value; form[field].defaultValue = value; }
    document.getElementById('profileStatus').textContent = 'Your profile has been saved on this browser.';
  });
})();
