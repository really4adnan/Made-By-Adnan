/* =====================================================================
   Made By Adnan — interactions
   ===================================================================== */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- header + scroll progress ---------------- */
  const header = document.getElementById('header');
  const progress = document.getElementById('scroll-progress');
  const glowA = document.querySelector('.bg-glow-a');
  const glowB = document.querySelector('.bg-glow-b');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle('sticky', y > 40);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    if (!prefersReduced) {
      if (glowA) glowA.style.translate = '0 ' + y * 0.12 + 'px';
      if (glowB) glowB.style.translate = '0 ' + y * -0.07 + 'px';
    }

    setActiveNav(y);
  }

  /* ---------------- active nav link ---------------- */
  const navLinks = Array.from(document.querySelectorAll('.navbar a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  function setActiveNav(y) {
    let current = 'home';
    for (const sec of sections) {
      if (y >= sec.offsetTop - 160) current = sec.id;
    }
    navLinks.forEach((link) => {
      const target = link.getAttribute('href').slice(1);
      link.classList.toggle('active', target === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  const menuBtn = document.getElementById('menu-btn');
  const navbar = document.getElementById('navbar');

  function closeMenu() {
    if (!menuBtn || !navbar) return;
    navbar.classList.remove('active');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && navbar) {
    menuBtn.addEventListener('click', () => {
      const open = navbar.classList.toggle('active');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (!navbar.classList.contains('active')) return;
      if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------------- typing effect ---------------- */
  const words = [
    'Frontend Developer',
    'UI / UX Designer',
    'Brand Designer',
    'Hackathon Builder',
    'Creative Technologist',
  ];
  const typingElem = document.querySelector('.typing-text');

  if (typingElem) {
    if (prefersReduced) {
      typingElem.textContent = 'Frontend Developer';
    } else {
      let wordIdx = 0;
      let charIdx = 0;
      let deleting = false;

      (function tick() {
        const word = words[wordIdx];

        if (deleting) {
          charIdx--;
        } else {
          charIdx++;
        }
        typingElem.textContent = word.slice(0, charIdx);

        let delay = deleting ? 45 : 95;

        if (!deleting && charIdx === word.length) {
          delay = 1700;
          deleting = true;
        } else if (deleting && charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          delay = 350;
        }

        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
          el.classList.add('in');
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------- animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------------- skill card pointer glow ---------------- */
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.skill-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------------- heading word reveal ---------------- */
  document.querySelectorAll('.heading').forEach((heading) => {
    let idx = 0;

    function split(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part.trim()) {
              frag.appendChild(document.createTextNode(part));
              return;
            }
            const word = document.createElement('span');
            const inner = document.createElement('span');
            word.className = 'word';
            inner.textContent = part;
            inner.style.transitionDelay = Math.min(idx++ * 32, 320) + 'ms';
            word.appendChild(inner);
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          if (child.classList.contains('accent')) {
            const word = document.createElement('span');
            word.className = 'word';
            child.style.transitionDelay = Math.min(idx++ * 32, 320) + 'ms';
            child.replaceWith(word);
            word.appendChild(child);
          } else {
            split(child);
          }
        }
      });
    }

    split(heading);
  });

  /* ---------------- hero depth + work card tilt ---------------- */
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (!prefersReduced && finePointer) {
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual) {
      const layers = [
        ['.portrait-frame', 9],
        ['.float-stat', 22],
        ['.float-kaizen', 15],
      ]
        .map(([sel, depth]) => [heroVisual.querySelector(sel), depth])
        .filter(([el]) => el);

      heroVisual.addEventListener('pointermove', (e) => {
        const r = heroVisual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(([el, depth]) => {
          el.style.translate = (x * depth).toFixed(1) + 'px ' + (y * depth).toFixed(1) + 'px';
        });
      });

      heroVisual.addEventListener('pointerleave', () => {
        layers.forEach(([el]) => { el.style.translate = '0 0'; });
      });
    }

    document.querySelectorAll('.work-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------- contact form ---------------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const subject = (data.get('subject') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !subject || !message) {
        if (note) {
          note.textContent = 'Please fill in every field with a valid email address.';
          note.className = 'form-note err';
        }
        return;
      }

      const body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message;

      const href =
        'mailto:really4adnan@gmail.com' +
        '?subject=' + encodeURIComponent(subject + ' — ' + name) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (note) {
        note.textContent = 'Opening your email client — I usually reply within 24 hours.';
        note.className = 'form-note ok';
      }

      form.reset();
    });
  }

  /* ---------------- footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- smooth anchor offset (older browsers) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });
})();
