/* ==========================================================================
   Piyush — Private Tutor · Site behaviour
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var CONFIG = Object.assign(
    {
      tutorName: 'Piyush',
      phone: '',
      whatsapp: '',
      email: '',
      formEndpoint: '',
      location: 'Thane, Maharashtra',
      photo: '',
      showPlaceholders: true,
    },
    window.SITE_CONFIG || {}
  );

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var clean = function (v) { return String(v == null ? '' : v).trim(); };
  var digitsOf = function (v) { return clean(v).replace(/\D/g, ''); };

  var waDigits = digitsOf(CONFIG.whatsapp);
  var emailAddr = clean(CONFIG.email);
  var phoneText = clean(CONFIG.phone);
  var endpoint = clean(CONFIG.formEndpoint);

  /* ---------- Toast ---------- */
  var toastEl = $('.toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
      setTimeout(function () { toastEl.hidden = true; }, 400);
    }, 4200);
  }

  /* ---------- Config → page ---------- */
  function formatWhatsApp(d) {
    if (!d) return '';
    if (d.length === 12 && d.indexOf('91') === 0) return '+91 ' + d.slice(2, 7) + ' ' + d.slice(7);
    return '+' + d;
  }

  var placeholderLabels = {
    phone: 'Add phone number',
    whatsapp: 'Add WhatsApp number',
    email: 'Add email address',
    location: 'Add location',
  };

  var values = {
    phone: phoneText,
    whatsapp: formatWhatsApp(waDigits),
    email: emailAddr,
    location: clean(CONFIG.location),
  };

  $$('[data-config-text]').forEach(function (el) {
    var key = el.getAttribute('data-config-text');
    var val = values[key];
    if (val) {
      el.textContent = val;
    } else if (CONFIG.showPlaceholders) {
      el.textContent = placeholderLabels[key] || 'To be added';
      el.classList.add('is-placeholder');
    } else {
      var row = el.closest('[data-contact]');
      if (row) row.hidden = true;
    }
  });

  $$('[data-config-link]').forEach(function (el) {
    var key = el.getAttribute('data-config-link');
    if (key === 'phone' && phoneText) {
      el.href = 'tel:' + (phoneText.charAt(0) === '+' ? '+' : '') + digitsOf(phoneText);
    } else if (key === 'email' && emailAddr) {
      el.href = 'mailto:' + emailAddr;
    } else {
      // Not configured: send visitors to the enquiry form instead of a dead link.
      el.href = '#contact';
      el.addEventListener('click', function () {
        toast('These contact details are being added soon — please use the enquiry form.');
      });
    }
  });

  // WhatsApp CTAs
  var defaultWaText = 'Hello ' + CONFIG.tutorName + ', I would like to enquire about tuition.';
  function waUrl(text) {
    return 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(text || defaultWaText);
  }
  $$('[data-whatsapp]').forEach(function (el) {
    if (waDigits) {
      el.href = waUrl();
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.href = '#contact';
      el.addEventListener('click', function () {
        toast('WhatsApp enquiries are coming soon — please use the enquiry form for now.');
      });
      if (!CONFIG.showPlaceholders && !el.closest('[data-contact]')) el.hidden = true;
    }
  });

  // Photo
  var photo = clean(CONFIG.photo);
  $$('[data-photo-slot]').forEach(function (slot) {
    if (!photo) return;
    var img = new Image();
    img.alt = CONFIG.tutorName + ', private tutor';
    img.decoding = 'async';
    img.loading = slot.classList.contains('portrait') ? 'lazy' : 'eager';
    img.onload = function () {
      $$('.avatar-monogram, .portrait-fallback, [data-placeholder-hint]', slot).forEach(function (n) { n.remove(); });
    };
    img.onerror = function () { img.remove(); };
    img.src = photo;
    slot.prepend(img);
  });
  if (!CONFIG.showPlaceholders) {
    $$('[data-placeholder-hint]').forEach(function (n) { n.remove(); });
  }

  // Year
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header + navigation ---------- */
  var header = $('.site-header');
  var nav = $('#site-nav');
  var toggle = $('.nav-toggle');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  // Scroll state + mobile CTA
  var mobileCta = $('.mobile-cta');
  var hero = $('.hero');
  var contact = $('#contact');
  var contactInView = false;
  if ('IntersectionObserver' in window && contact) {
    new IntersectionObserver(function (entries) {
      contactInView = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.05 }).observe(contact);
  }
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (mobileCta) {
      var show = y > (hero ? hero.offsetHeight * 0.55 : 400) && !contactInView;
      mobileCta.classList.toggle('is-visible', show);
      mobileCta.inert = !show;
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }
  }, { passive: true });
  onScroll();

  // Active section in nav
  var navLinks = $$('.nav-list a');
  var linkFor = {};
  navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = linkFor[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Hero parallax ---------- */
  var visual = $('[data-parallax]');
  if (visual && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var layers = $$('[data-depth]', visual);
    var raf;
    hero.addEventListener('pointermove', function (e) {
      var r = visual.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute('data-depth')) || 10;
          l.style.transform = 'translate3d(' + (x * d).toFixed(2) + 'px,' + (y * d).toFixed(2) + 'px,0) rotate(var(--rot, 0deg))';
        });
      });
    });
    hero.addEventListener('pointerleave', function () {
      layers.forEach(function (l) { l.style.transform = ''; });
    });
  }

  /* ---------- Worksheet preview ---------- */
  var builder = $('#builder');
  if (builder) {
    var state = { board: 'IGCSE', subject: 'Mathematics', level: 'Core' };

    var boards = {
      IB: { tag: 'IB · MYP', format: 'Criterion-based tasks with an inquiry focus and real-world context.', mid: ['Criterion-style task', 'Investigate a pattern and explain your reasoning'] },
      IGCSE: { tag: 'IGCSE', format: 'Exam-style questions using command words, tagged by Core and Extended tier.', mid: ['Exam-style questions', 'Command words: calculate, show, explain'] },
      Cambridge: { tag: 'Cambridge', format: 'Stage-appropriate questions that build the skills assessed at each Cambridge stage.', mid: ['Stage-based practice', 'Skills-focused questions for the current stage'] },
      CBSE: { tag: 'CBSE', format: 'NCERT-aligned, chapter-wise practice with competency-based and case-study questions.', mid: ['Competency-based questions', 'Case-study and NCERT-aligned items'] },
      ICSE: { tag: 'ICSE', format: 'Detailed, application-focused questions with emphasis on precise working and presentation.', mid: ['Structured questions', 'Section-wise practice with full working'] },
    };

    var subjects = {
      Mathematics: { a: ['Concept check', 'Key facts, definitions and methods'], c: ['Problem solving', 'Word problems and multi-step reasoning'] },
      Science: { a: ['Concept check', 'Definitions, diagrams and key ideas'], c: ['Apply & explain', 'Numericals, experiments and reasoning'] },
      'CS / ICT': { a: ['Concept check', 'Key terms and how things work'], c: ['Hands-on task', 'Write, trace or debug a short program'] },
    };

    var levels = {
      Foundation: { label: 'Foundations', counts: ['Worked example + 8 Qs', '4 Qs', '2 guided Qs'], note: ' Starts with a worked example and builds up step by step.' },
      Core: { label: 'Core', counts: ['5 Qs', '6 Qs', '3 Qs'], note: '' },
      Stretch: { label: 'Extension', counts: ['3 Qs', '6 Qs', '4 challenge Qs'], note: ' Includes extension questions beyond the usual difficulty.' },
    };

    var out = {
      tag: $('[data-ws="tag"]', builder),
      title: $('[data-ws="title"]', builder),
      format: $('[data-ws="format"]', builder),
      sections: $('[data-ws="sections"]', builder),
    };

    var render = function () {
      var b = boards[state.board], s = subjects[state.subject], l = levels[state.level];
      out.tag.textContent = b.tag;
      out.title.textContent = state.subject + ' · ' + l.label + ' practice set';
      out.format.textContent = b.format + l.note;
      var rows = [s.a, b.mid, s.c];
      out.sections.innerHTML = '';
      rows.forEach(function (row, i) {
        var li = document.createElement('li');
        li.innerHTML =
          '<span class="ws-sec-letter">' + 'ABC'.charAt(i) + '</span>' +
          '<span class="ws-sec-text"><strong></strong><span></span></span>' +
          '<span class="ws-sec-count"></span>';
        li.querySelector('strong').textContent = row[0];
        li.querySelector('.ws-sec-text span').textContent = row[1];
        li.querySelector('.ws-sec-count').textContent = l.counts[i];
        out.sections.appendChild(li);
      });
    };

    $$('[data-builder]', builder).forEach(function (group) {
      var key = group.getAttribute('data-builder');
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-value]');
        if (!btn) return;
        state[key] = btn.getAttribute('data-value');
        $$('button', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        render();
      });
    });
    render();
  }

  /* ---------- FAQ accordion ---------- */
  $$('.acc-trigger').forEach(function (btn, i) {
    var item = btn.closest('.acc-item');
    var set = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
    };
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (i === 0) set(true);
  });

  /* ---------- Enquiry form ---------- */
  var form = $('#enquiry-form');
  var success = $('#form-success');
  var statusEl = $('.form-status', form);
  var submitBtn = $('.btn-submit', form);
  var shell = $('.contact-shell');
  var attempted = false;

  function highlightForm() {
    if (!shell) return;
    shell.classList.remove('is-highlight');
    void shell.offsetWidth;
    shell.classList.add('is-highlight');
  }

  // Prefill from CTAs across the page
  function prefill(name, value, single) {
    if (!success.hidden) resetForm();
    $$('input[name="' + name + '"]', form).forEach(function (input) {
      if (input.value === value) input.checked = true;
      else if (single) input.checked = false;
    });
    if (attempted) validate();
  }
  $$('[data-prefill-subject]').forEach(function (el) {
    el.addEventListener('click', function () { prefill('subjects', el.getAttribute('data-prefill-subject')); highlightForm(); });
  });
  $$('[data-prefill-board]').forEach(function (el) {
    el.addEventListener('click', function () { prefill('board', el.getAttribute('data-prefill-board'), true); highlightForm(); });
  });
  $$('[data-prefill-mode]').forEach(function (el) {
    el.addEventListener('click', function () { prefill('mode', el.getAttribute('data-prefill-mode'), true); highlightForm(); });
  });
  $$('a[href="#contact"]').forEach(function (a) {
    if (!a.hasAttribute('data-prefill-subject') && !a.hasAttribute('data-prefill-board') && !a.hasAttribute('data-prefill-mode')) {
      a.addEventListener('click', highlightForm);
    }
  });

  // Character counter
  var msg = $('#f-message');
  var counter = $('[data-counter]', form);
  msg.addEventListener('input', function () { counter.textContent = msg.value.length; });

  function normalisePhone(raw) {
    raw = clean(raw);
    var d = digitsOf(raw);
    var intl = raw.charAt(0) === '+' && raw.indexOf('+91') !== 0;
    if (intl) return d.length >= 8 && d.length <= 15 ? '+' + d : null;
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    else if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? '+91 ' + d.slice(0, 5) + ' ' + d.slice(5) : null;
  }

  function getData() {
    var fd = new FormData(form);
    return {
      name: clean(fd.get('name')),
      phone: clean(fd.get('phone')),
      studentClass: clean(fd.get('studentClass')),
      board: clean(fd.get('board')),
      subjects: fd.getAll('subjects'),
      mode: clean(fd.get('mode')),
      message: clean(fd.get('message')),
      company: clean(fd.get('company')),
    };
  }

  var fields = {
    name: { el: '#f-name', err: '#e-name' },
    phone: { el: '#f-phone', err: '#e-phone' },
    studentClass: { el: '#f-class', err: '#e-class' },
    board: { el: 'input[name="board"]', err: '#e-board' },
    subjects: { el: 'input[name="subjects"]', err: '#e-subject' },
    mode: { el: 'input[name="mode"]', err: '#e-mode' },
  };

  function setError(key, message) {
    var f = fields[key];
    var input = $(f.el, form);
    var field = input.closest('.field');
    var err = $(f.err, form);
    field.classList.toggle('has-error', !!message);
    err.textContent = message || '';
    $$(f.el, form).forEach(function (i) {
      if (message) i.setAttribute('aria-invalid', 'true');
      else i.removeAttribute('aria-invalid');
    });
  }

  function validate() {
    var d = getData();
    var errors = {};
    if (d.name.length < 2) errors.name = 'Please enter your name.';
    if (!d.phone) errors.phone = 'Please enter a contact number.';
    else if (!normalisePhone(d.phone)) errors.phone = 'Please enter a valid 10-digit mobile number (or include the country code).';
    if (!d.studentClass) errors.studentClass = 'Please select the student’s class.';
    if (!d.board) errors.board = 'Please choose a board or curriculum.';
    if (!d.subjects.length) errors.subjects = 'Please select at least one subject.';
    if (!d.mode) errors.mode = 'Please choose online, in-person or either.';
    Object.keys(fields).forEach(function (k) { setError(k, errors[k]); });
    return errors;
  }

  form.addEventListener('input', function () { if (attempted) validate(); });
  form.addEventListener('change', function () { if (attempted) validate(); });
  $('#f-phone').addEventListener('blur', function () {
    var v = clean(this.value);
    if (v && !normalisePhone(v)) setError('phone', 'Please enter a valid 10-digit mobile number (or include the country code).');
  });

  function showStatus(message, isError) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', !!isError);
  }

  function buildMessage(d) {
    return [
      'Hello ' + CONFIG.tutorName + ', I would like to enquire about tuition.',
      '',
      'Name: ' + d.name,
      'Contact number: ' + (normalisePhone(d.phone) || d.phone),
      'Class: ' + d.studentClass,
      'Board: ' + d.board,
      'Subject(s): ' + d.subjects.join(', '),
      'Mode: ' + d.mode,
      d.message ? 'Message: ' + d.message : '',
    ].filter(function (line, i) { return line !== '' || i === 1; }).join('\n');
  }

  function showSuccess(title, text) {
    $('[data-success-title]', success).textContent = title;
    $('[data-success-text]', success).textContent = text;
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    var top = shell.getBoundingClientRect().top + window.scrollY - (header.offsetHeight + 16);
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function resetForm() {
    form.reset();
    counter.textContent = '0';
    attempted = false;
    Object.keys(fields).forEach(function (k) { setError(k, ''); });
    statusEl.hidden = true;
    success.hidden = true;
    form.hidden = false;
  }
  $('[data-reset-form]', success).addEventListener('click', function () {
    resetForm();
    $('#f-name').focus();
  });

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    $('.btn-label', submitBtn).textContent = on ? 'Sending…' : 'Send Enquiry';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    attempted = true;
    statusEl.hidden = true;

    var errors = validate();
    var keys = Object.keys(errors);
    if (keys.length) {
      showStatus('Please check the highlighted field' + (keys.length > 1 ? 's' : '') + ' above.', true);
      var first = $(fields[keys[0]].el, form);
      first.focus({ preventScroll: true });
      first.closest('.field').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    var d = getData();
    if (d.company) { // Honeypot tripped: quietly pretend success.
      showSuccess('Thank you — your enquiry has been sent.', 'Piyush will be in touch soon.');
      return;
    }

    var text = buildMessage(d);

    if (endpoint) {
      setLoading(true);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: d.name,
          phone: normalisePhone(d.phone) || d.phone,
          studentClass: d.studentClass,
          board: d.board,
          subjects: d.subjects.join(', '),
          mode: d.mode,
          message: d.message,
          _subject: 'New tuition enquiry — ' + d.name + ' (' + d.studentClass + ', ' + d.board + ')',
        }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed: ' + res.status);
          showSuccess(
            'Thank you, ' + d.name.split(' ')[0] + ' — your enquiry has been sent.',
            'Piyush will get back to you soon to arrange a free consultation.'
          );
        })
        .catch(function () {
          showStatus(
            'Sorry — the enquiry couldn’t be sent just now. Please try again' +
              (waDigits ? ', or message on WhatsApp instead.' : ' in a moment.'),
            true
          );
        })
        .then(function () { setLoading(false); });
      return;
    }

    if (waDigits) {
      var win = window.open(waUrl(text), '_blank', 'noopener');
      if (!win) window.location.href = waUrl(text);
      showSuccess(
        'Almost done — just press send in WhatsApp.',
        'Your enquiry has been written out in WhatsApp. Once you send it, Piyush will get back to you to arrange a free consultation.'
      );
      return;
    }

    if (emailAddr) {
      window.location.href =
        'mailto:' + emailAddr +
        '?subject=' + encodeURIComponent('Tuition enquiry — ' + d.studentClass + ', ' + d.board) +
        '&body=' + encodeURIComponent(text);
      showSuccess(
        'Almost done — just press send in your email app.',
        'Your enquiry has been written into a new email. Once you send it, Piyush will get back to you to arrange a free consultation.'
      );
      return;
    }

    showStatus(
      'Online enquiries aren’t connected yet. (Site owner: add a formEndpoint, whatsapp or email in config.js to start receiving enquiries.)',
      true
    );
  });
})();
