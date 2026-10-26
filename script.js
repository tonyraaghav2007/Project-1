/* ===== Grovix — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll ---------- */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));

  /* ---------- Logo scroll ---------- */
  const brands = [
    { icon: '☁️', name: 'Cloud' },
    { icon: '📊', name: 'Rise' },
    { icon: '🔗', name: 'Trace' },
    { icon: '🔊', name: 'Volume' },
    { icon: '🧩', name: 'Clues' },
    { icon: '📊', name: 'Rise' },
    { icon: '🔗', name: 'Trace' },
    { icon: '🧩', name: 'Clues' },
  ];

  const track = document.getElementById('logoTrack');
  if (track) {
    // render twice for seamless loop
    const html = brands.map(b => `<div class="logo-item">${b.icon} ${b.name}</div>`).join('');
    track.innerHTML = html + html;
  }

  /* ---------- Bar chart ---------- */
  function buildBars(containerId, barCount, maxH, barW) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    container.innerHTML = '';
    months.forEach((m, i) => {
      const group = document.createElement('div');
      group.className = 'bar-group';

      const h1 = Math.random() * maxH * 0.5 + maxH * 0.1;
      const h2 = Math.random() * maxH * 0.8 + maxH * 0.15;

      const b1 = document.createElement('div');
      b1.className = 'bar muted';
      b1.style.height = '0px';

      const b2 = document.createElement('div');
      b2.className = 'bar accent';
      b2.style.height = '0px';

      const lbl = document.createElement('div');
      lbl.className = 'bar-lbl';
      lbl.textContent = m;

      group.append(b1, b2, lbl);
      container.appendChild(group);

      requestAnimationFrame(() => {
        setTimeout(() => {
          b1.style.height = h1 + 'px';
          b2.style.height = h2 + 'px';
        }, i * 100);
      });
    });
  }

  buildBars('mainBars', 7, 120, 0);

  /* ---------- CTA mini bars ---------- */
  const ctaBars = document.getElementById('ctaBars');
  if (ctaBars) {
    const months2 = ['Dec', 'Jan', 'Feb', 'Mar'];
    months2.forEach((m, i) => {
      const grp = document.createElement('div');
      grp.className = 'bar-group';
      grp.style.flex = '1';

      const h1 = Math.random() * 40 + 10;
      const h2 = Math.random() * 60 + 15;

      const b1 = document.createElement('div');
      b1.className = 'bar muted';
      b1.style.height = h1 + 'px';

      const b2 = document.createElement('div');
      b2.className = 'bar accent';
      b2.style.height = h2 + 'px';

      const lbl = document.createElement('div');
      lbl.className = 'bar-lbl';
      lbl.textContent = m;

      grp.append(b1, b2, lbl);
      ctaBars.appendChild(grp);
    });
  }

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Parallax sparkles ---------- */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.sparkle-star').forEach((s, i) => {
      s.style.transform = `translateY(${Math.sin(y * 0.003 + i) * 8}px) rotate(${y * 0.02 * (i + 1)}deg)`;
    });
  });

});
