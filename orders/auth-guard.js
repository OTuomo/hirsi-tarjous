/**
 * auth-guard.js — Okkosen Puutuote
 * - Tarkistaa kirjautumisen, ohjaa loginiin jos ei sessiota
 * - Korjaa automaattisesti kaikki Supabase fetch-kutsut käyttämään oikeaa tokenia
 * - Lisää uloskirjautumisnapin navigaatioon
 */

(function () {
  const SUPABASE_URL = 'https://iofjnoxvksbaqorqaydh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZmpub3h2a3NiYXFvcnFheWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjYzNjcsImV4cCI6MjA5MTQwMjM2N30.7aYtakimbUHcxyv6Jco2ggt4VdS2F68xydTbi9suAPo';

  // Luo tai käytä olemassa olevaa Supabase-instanssia
  if (!window._supabaseClient) {
    window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  const sb = window._supabaseClient;

  // Piilota sisältö kunnes auth tarkistettu
  document.documentElement.style.visibility = 'hidden';

  // ── Session-cache ──────────────────────────────────────────
  // Pidetään sessio muistissa — ei kutsuta getSession() joka REST-pyynnöllä
  let _cachedSession = null;

  // ── Fetch-korjaus ──────────────────────────────────────────
  // Ylikirjoitetaan window.fetch niin että Supabase-kutsut saavat aina oikean tokenin
  const _originalFetch = window.fetch.bind(window);
  window.fetch = async function (url, options = {}) {
    if (typeof url === 'string' && url.includes(SUPABASE_URL)) {
      if (_cachedSession) {
        options = options || {};
        options.headers = options.headers || {};
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${_cachedSession.access_token}`);
        } else {
          options.headers['Authorization'] = `Bearer ${_cachedSession.access_token}`;
        }
      }
    }
    return _originalFetch(url, options);
  };

  // ── Auth-tarkistus ja muutostenKuuntelu ────────────────────
  // onAuthStateChange käynnistyy heti INITIAL_SESSION-eventillä sivun latautuessa,
  // joten erillinen getSession()-kutsu ei ole tarpeen.
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      _cachedSession = null;
      window.location.replace('login.html');
      return;
    }
    if (event === 'INITIAL_SESSION') {
      if (!session) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        window.location.href = 'login.html?next=' + encodeURIComponent(currentPage);
        return;
      }
      _cachedSession = session;
      document.documentElement.style.visibility = '';
      window._currentUser = session.user;
      renderUserInfo(session.user);
      return;
    }
    // SIGNED_IN tai TOKEN_REFRESHED — päivitetään cache, ei muuta toimintaa
    if (session) {
      _cachedSession = session;
      window._currentUser = session.user;
    }
  });

  // ── Uloskirjautumisnappi ───────────────────────────────────
  function renderUserInfo(user) {
    const tryRender = () => {
      if (document.getElementById('auth-user-info')) return;
      // Lisätään .header-right:n sisään jos löytyy, muuten headerin loppuun
      const headerRight = document.querySelector('.header-right');
      const nav = headerRight || document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('header');
      if (!nav) return;

      const div = document.createElement('div');
      div.id = 'auth-user-info';
      div.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        ${!headerRight ? 'margin-left: auto;' : ''}
        font-size: 0.8rem;
        color: #a09070;
        font-family: 'IBM Plex Sans', sans-serif;
      `;

      const email = document.createElement('span');
      email.textContent = user.email;
      email.style.cssText = 'max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Kirjaudu ulos';
      logoutBtn.style.cssText = `
        background: transparent;
        border: 1px solid #3a3520;
        border-radius: 3px;
        padding: 0.3rem 0.7rem;
        font-size: 0.75rem;
        color: #a09070;
        cursor: pointer;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: border-color 0.15s, color 0.15s;
      `;
      logoutBtn.onmouseover = () => { logoutBtn.style.borderColor = '#d97706'; logoutBtn.style.color = '#d97706'; };
      logoutBtn.onmouseout  = () => { logoutBtn.style.borderColor = '#3a3520'; logoutBtn.style.color = '#a09070'; };
      logoutBtn.onclick = async () => {
        try {
          await sb.auth.signOut({ scope: 'local' });
        } catch (e) {
          // Tyhjennetään sessio manuaalisesti jos signOut epäonnistuu
          Object.keys(localStorage)
            .filter(k => k.startsWith('sb-'))
            .forEach(k => localStorage.removeItem(k));
        }
        window.location.replace('login.html');
      };

      div.appendChild(email);
      div.appendChild(logoutBtn);
      nav.appendChild(div);  // nav on joko .header-right tai header
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryRender);
    } else {
      tryRender();
    }
  }

  // Julkiset helperit
  window.getAuthSession = () => sb.auth.getSession();
  window.authSignOut = () => sb.auth.signOut();
})();
