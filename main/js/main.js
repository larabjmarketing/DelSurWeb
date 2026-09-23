/* Del Sur Studio — comportamiento común a todas las páginas */
(function () {
  var WHATSAPP = '34654943209';
  var EMAIL = 'larabj.marketing@gmail.com';
  var PLAN_KEY = 'dss-plan';
  // Supabase: la clave publicable es pública por diseño; la tabla solo permite insertar (RLS)
  var SUPABASE_URL = 'https://qtwlhpimrozszlawbxcr.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_LGb_ZXwGOj4ZGOzGn4GwTA_fcEPulYh';

  document.documentElement.classList.add('js');

  function store(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---------- Cabecera: sombra al hacer scroll + menú móvil ---------- */
  var header = document.querySelector('.header');
  var waFloat = document.querySelector('.wa-float');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuBtn = document.querySelector('.menu-btn');
  var mobileNav = document.getElementById('mobile-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Animaciones al entrar en pantalla ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Año del pie ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Filtro de casos ---------- */
  var filters = document.querySelectorAll('[data-filter]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      document.querySelectorAll('[data-sector]').forEach(function (c) {
        c.hidden = !(f === 'todo' || c.getAttribute('data-sector') === f);
      });
    });
  });

  /* ---------- Formulario de contacto por pasos ---------- */
  var form = document.getElementById('lead-form');
  if (!form) return;

  var steps = form.querySelectorAll('.form-step');
  var total = steps.length;
  var current = 0;
  var btnPrev = form.querySelector('[data-prev]');
  var btnNext = form.querySelector('[data-next]');
  var btnSend = form.querySelector('[data-send]');
  var errorEl = form.querySelector('.form-error');
  var stepLabel = form.querySelector('[data-step-label]');
  var pctLabel = form.querySelector('[data-step-pct]');
  var fill = form.querySelector('.progress__fill');
  var done = document.getElementById('lead-done');

  // Si la persona viene de la calculadora, se trae su estrategia
  var plan = store(function () { return JSON.parse(localStorage.getItem(PLAN_KEY)); });
  var planBox = document.getElementById('plan-from-calc');
  if (plan && plan.lines && plan.lines.length && planBox) {
    planBox.hidden = false;
    planBox.querySelector('[data-plan-summary]').textContent =
      plan.lines.map(function (l) { return l[0]; }).join(', ') + ' · ' + plan.once + ' + ' + plan.month;
  }

  function show(i) {
    current = i;
    steps.forEach(function (s, n) { s.hidden = n !== i; });
    var pct = Math.round(((i + 1) / total) * 100);
    stepLabel.textContent = 'Paso ' + (i + 1) + ' de ' + total;
    pctLabel.textContent = pct + '%';
    fill.style.width = pct + '%';
    btnPrev.hidden = i === 0;
    btnNext.hidden = i === total - 1;
    btnSend.hidden = i !== total - 1;
    errorEl.textContent = '';
  }

  function validate(i) {
    var s = steps[i];
    var radios = s.querySelectorAll('input[type="radio"]');
    if (radios.length && !s.querySelector('input[type="radio"]:checked')) return 'Elige una opción para continuar.';
    var boxes = s.querySelectorAll('input[type="checkbox"][data-required-group]');
    if (boxes.length && !s.querySelector('input[type="checkbox"][data-required-group]:checked')) return 'Elige al menos una opción.';
    var bad = null;
    s.querySelectorAll('input[required], textarea[required]').forEach(function (inp) {
      var ok = inp.type === 'checkbox' ? inp.checked : inp.checkValidity();
      inp.setAttribute('aria-invalid', !ok);
      if (!ok && !bad) bad = inp;
    });
    if (bad) {
      bad.focus();
      if (bad.type === 'checkbox') return 'Necesitamos tu consentimiento para poder contactarte.';
      if (bad.type === 'email') return 'Revisa el email.';
      if (bad.type === 'tel') return 'Revisa el teléfono (mínimo 9 cifras).';
      return 'Completa los campos obligatorios.';
    }
    return '';
  }

  btnNext.addEventListener('click', function () {
    var err = validate(current);
    if (err) { errorEl.textContent = err; return; }
    show(current + 1);
    var first = steps[current].querySelector('input, textarea');
    if (first) first.focus({ preventScroll: true });
  });
  btnPrev.addEventListener('click', function () { show(current - 1); });

  function values(name) {
    return Array.prototype.map.call(form.querySelectorAll('[name="' + name + '"]:checked'), function (i) { return i.value; });
  }

  function summary() {
    var d = new FormData(form);
    var lines = [
      'Hola Lara, quiero reservar la reunión inicial.',
      '',
      '• Situación: ' + values('situacion').join(', '),
      '• Tipo de negocio: ' + values('sector').join(', '),
      '• Me interesa: ' + (values('interes').join(', ') || 'Aún no lo sé'),
      '• Reunión: ' + values('formato').join(', '),
      '',
      'Nombre: ' + d.get('nombre'),
      'Negocio: ' + (d.get('negocio') || '-'),
      'Teléfono: ' + d.get('telefono'),
      'Email: ' + (d.get('email') || '-')
    ];
    if (d.get('mensaje')) lines.push('', 'Mensaje: ' + d.get('mensaje'));
    if (plan && plan.lines && plan.lines.length && d.get('incluir_plan')) {
      lines.push('', 'Estrategia de la calculadora:');
      plan.lines.forEach(function (l) { lines.push('  - ' + l[0] + ': ' + l[1]); });
      lines.push('  Total: ' + plan.once + ' pago único + ' + plan.month);
    }
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = validate(current);
    if (err) { errorEl.textContent = err; return; }
    var text = summary();
    var d = new FormData(form);

    function finish() {
      form.hidden = true;
      done.hidden = false;
      done.querySelector('[data-mailto]').href =
        'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Reunión inicial, Del Sur Studio') + '&body=' + encodeURIComponent(text);
      done.querySelector('[data-wa]').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Campo trampa: si un bot lo rellena, fingimos éxito sin guardar nada
    if (d.get('web_url')) { finish(); return; }

    function clean(v) { v = (v || '').trim(); return v ? v : null; }
    var lead = {
      situacion: values('situacion')[0],
      sectores: values('sector'),
      intereses: values('interes'),
      formato: values('formato')[0] || null,
      nombre: clean(d.get('nombre')),
      negocio: clean(d.get('negocio')),
      telefono: clean(d.get('telefono')),
      email: clean(d.get('email')),
      mensaje: clean(d.get('mensaje')),
      plan_calculadora: (plan && plan.lines && plan.lines.length && d.get('incluir_plan')) ? plan : null,
      acepta_privacidad: true,
      origen: location.pathname.split('/').pop() || 'index.html'
    };

    btnSend.disabled = true;
    btnSend.textContent = 'Enviando…';
    fetch(SUPABASE_URL + '/rest/v1/delsur_leads', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(lead)
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      finish();
    }).catch(function () {
      btnSend.disabled = false;
      btnSend.textContent = 'Enviar solicitud';
      errorEl.innerHTML = 'No se ha podido enviar. Inténtalo de nuevo o escríbenos por <a href="https://wa.me/' + WHATSAPP +
        '?text=' + encodeURIComponent(text) + '" target="_blank" rel="noopener">WhatsApp</a>.';
    });
  });

  show(0);
})();
