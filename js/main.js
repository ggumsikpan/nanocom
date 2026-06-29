/* ===== 나노컴(주) NANOCOM — main.js ===== */
(function () {
  'use strict';

  // --- Current year in footer ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Header shadow on scroll ---
  var header = document.getElementById('header');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  function closeMenu() {
    if (nav) nav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
  }
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // --- Scroll reveal ---
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // small stagger for siblings
          var delay = (el.dataset.delay) ? parseInt(el.dataset.delay, 10) : (i % 4) * 70;
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // --- Animated counters (hero stats) ---
  var counters = document.querySelectorAll('[data-count]');
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var dur = 1400, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); co.disconnect(); } });
      }, { threshold: 0.5 });
      co.observe(counters[0]);
    } else { runCounters(); }
  }

  // --- Inquiry form (front-end only demo) ---
  var form = document.getElementById('inquiryForm');
  var hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();
      if (!name || !phone || !message) {
        hint.textContent = '이름, 연락처, 문의 내용을 입력해 주세요.';
        hint.className = 'form__hint err';
        return;
      }
      hint.textContent = '문의가 접수되었습니다. 빠르게 연락드리겠습니다. (※ 실제 전송 연동 전입니다)';
      hint.className = 'form__hint ok';
      form.reset();
    });
  }
})();
