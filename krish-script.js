/* ─────────────────────────────────────────
   Krish Kids – script.js
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── 2. CONTACT FORM SUBMIT ── */
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields ✏️', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showToast('Please enter a valid email address 📧', 'error');
        return;
      }

      sendBtn.textContent = 'Message Sent! 🎉';
      sendBtn.style.background = '#4CAF50';
      sendBtn.disabled = true;
      showToast('Thanks! We\'ll get back to you soon 💛', 'success');
    });
  }


  /* ── 3. NAV ACTIVE LINK HIGHLIGHT on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));


  /* ── 4. SMOOTH NAV SHADOW on scroll ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,.10)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });


  /* ── 5. CATEGORY CARD CLICK RIPPLE ── */
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(0,0,0,.08);
        width:60px; height:60px;
        left:${e.clientX - rect.left - 30}px;
        top:${e.clientY - rect.top - 30}px;
        transform:scale(0);
        animation:rippleAnim .5s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* inject ripple keyframes once */
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `@keyframes rippleAnim { to { transform:scale(6); opacity:0; } }`;
    document.head.appendChild(s);
  }


  /* ── 6. COUNTER ANIMATION for stats ── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  /* ── HELPERS ── */

  function animateCounter(el) {
    const text   = el.textContent;
    const suffix = text.replace(/[0-9]/g, '');   // e.g. "+" or "%"
    const target = parseInt(text);
    if (isNaN(target)) return;

    const duration = 1200;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(msg, type = 'success') {
    const existing = document.querySelector('.krish-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'krish-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: ${type === 'success' ? '#4CAF50' : '#FF6B6B'};
      color: #fff;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      font-size: .95rem;
      padding: 14px 28px;
      border-radius: 99px;
      box-shadow: 0 8px 30px rgba(0,0,0,.2);
      z-index: 9999;
      opacity: 0;
      transition: opacity .3s, transform .3s;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

});
