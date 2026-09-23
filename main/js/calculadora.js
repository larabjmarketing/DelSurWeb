/* Del Sur Studio — calculadora de estrategia
   Para cambiar precios o servicios, edita DATA y REDES. */
(function () {
  var DATA = [
    { id: 'micro', name: 'Web', desc: 'Una página elegante con inicio, servicios, sobre el negocio y contacto. Bilingüe, con formulario y WhatsApp.', once: 500, month: 0 },
    { id: 'marca', name: 'Pack marca', desc: 'Logo, paleta de colores, tipografías y plantillas para tus redes.', once: 450, month: 0 },
    { id: 'seo', name: 'SEO local y ficha de Google', desc: 'Que te encuentren en el mapa y en las búsquedas de Estepona.', once: 350, month: 250 },
    { id: 'med', name: 'Medición', desc: 'Sabrás cuántos contactos llegan, por qué canal y a qué coste.', once: 200, month: 0 },
    { id: 'gads', name: 'Google Ads', desc: 'Campañas para aparecer justo cuando alguien busca lo que ofreces.', once: 200, month: 350 },
    { id: 'meta', name: 'Meta Ads', desc: 'Anuncios en Instagram y Facebook para reservas, visitas y contactos.', once: 150, month: 250 },
    { id: 'otros', name: 'YouTube, audio, DOOH y CTV', tag: 'Publicidad avanzada', desc: 'Presupuesto a medida según zona, soportes y duración. Se añade a tu plan como partida a medida y no suma al total.', custom: true, wide: true }
  ];
  var REDES = [
    { n: 0, label: 'Sin redes', month: 0 },
    { n: 4, label: '4 publicaciones', month: 200 },
    { n: 8, label: '8 publicaciones', month: 300 },
    { n: 12, label: '12 publicaciones', month: 450 }
  ];
  var PRESETS = {
    nuevo: { micro: true, marca: true, seo: true, med: true, gads: true },
    web: { seo: true, med: true, gads: true },
    publi: { med: true, gads: true, meta: true },
    vaciar: {}
  };
  var WHATSAPP = '34654943209';
  var PLAN_KEY = 'dss-plan';

  var state = { sel: Object.assign({}, PRESETS.nuevo), redes: 0, autoMed: false, preset: 'nuevo' };

  function store(fn) { try { return fn(); } catch (e) { return null; } }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }
  function price(s) {
    if (s.custom) return 'Presupuesto a medida';
    if (s.once && s.month) return money(s.once) + ' + ' + money(s.month) + '/mes';
    if (s.once) return money(s.once);
    return money(s.month) + '/mes';
  }
  function $(id) { return document.getElementById(id); }

  function toggle(id) {
    var sel = Object.assign({}, state.sel);
    var autoMed = state.autoMed;
    sel[id] = !sel[id];
    if (id === 'med') autoMed = false;
    if ((id === 'gads' || id === 'meta') && sel[id] && !sel.med) { sel.med = true; autoMed = true; }
    if (!sel.gads && !sel.meta && autoMed) { sel.med = false; autoMed = false; }
    state.sel = sel;
    state.autoMed = autoMed;
    state.preset = null;
    render();
  }
  function applyPreset(name) {
    if (!PRESETS[name]) return;
    state.sel = Object.assign({}, PRESETS[name]);
    state.redes = 0;
    state.autoMed = false;
    state.preset = name;
    render();
  }

  function build() {
    var grid = $('svc-grid');
    grid.innerHTML = DATA.map(function (s) {
      return '<div class="svc' + (s.wide ? ' svc--wide' : '') + '" data-service="' + s.id + '">' +
        (s.tag ? '<span class="tag">' + s.tag + '</span>' : '') +
        '<h2 class="h4">' + s.name + '</h2><p>' + s.desc + '</p>' +
        '<div class="svc__foot"><span class="svc__price">' + price(s) + '</span>' +
        '<button type="button" class="svc-btn" aria-pressed="false" aria-label="Añadir ' + s.name + '">Añadir</button></div></div>';
    }).join('');
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.svc-btn');
      if (btn) toggle(btn.closest('[data-service]').getAttribute('data-service'));
    });

    var redes = $('redes');
    redes.innerHTML = REDES.map(function (r) {
      return '<button type="button" data-redes="' + r.n + '" aria-pressed="false"><span>' + r.label + '</span><span>' +
        (r.month ? money(r.month) + '/mes' : '0 €') + '</span></button>';
    }).join('');
    redes.addEventListener('click', function (e) {
      var b = e.target.closest('[data-redes]');
      if (b) { state.redes = +b.getAttribute('data-redes'); state.preset = null; render(); }
    });

    document.querySelectorAll('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () { applyPreset(b.getAttribute('data-preset')); });
    });
  }

  function render() {
    DATA.forEach(function (s) {
      var card = document.querySelector('[data-service="' + s.id + '"]');
      var btn = card.querySelector('.svc-btn');
      var on = !!state.sel[s.id];
      card.classList.toggle('is-on', on);
      btn.textContent = on ? 'Quitar' : 'Añadir';
      btn.setAttribute('aria-pressed', on);
      btn.setAttribute('aria-label', (on ? 'Quitar ' : 'Añadir ') + s.name);
    });
    document.querySelectorAll('[data-redes]').forEach(function (b) {
      b.setAttribute('aria-pressed', +b.getAttribute('data-redes') === state.redes);
    });
    document.querySelectorAll('[data-preset]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-preset') === state.preset);
    });

    var lines = [], once = 0, month = 0;
    DATA.forEach(function (s) {
      if (!state.sel[s.id]) return;
      lines.push([s.name, s.custom ? 'A medida' : price(s)]);
      if (!s.custom) { once += s.once; month += s.month; }
    });
    var chosen = REDES.filter(function (r) { return r.n === state.redes; })[0];
    if (chosen && chosen.n > 0) {
      lines.push(['Redes, ' + chosen.n + ' publicaciones', money(chosen.month) + '/mes']);
      month += chosen.month;
    }

    $('plan-lines').innerHTML = lines.map(function (l) {
      return '<div><span>' + l[0] + '</span><span>' + l[1] + '</span></div>';
    }).join('');
    $('plan-empty').hidden = lines.length > 0;
    $('auto-med-note').hidden = !(state.autoMed && state.sel.med);
    $('once-total').textContent = money(once);
    $('month-total').textContent = money(month);
    $('first-year').textContent = lines.length
      ? 'Primer año estimado: ' + money(once + month * 12) + ' (pago único + 12 cuotas' + (state.sel.otros ? ', sin las partidas a medida' : '') + ').'
      : '';
    $('bar-total').textContent = money(once) + ' + ' + money(month) + '/mes';

    // Guardamos el plan para el formulario de contacto de la portada
    var plan = { lines: lines, once: money(once), month: money(month) + '/mes' };
    store(function () { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); });

    var text = 'Hola Lara, he calculado esta estrategia en la web de Del Sur Studio:\n\n' +
      lines.map(function (l) { return '- ' + l[0] + ': ' + l[1]; }).join('\n') +
      '\n\nTotal: ' + plan.once + ' pago único + ' + plan.month + '\n\n¿Podemos vernos para concretarla?';
    $('plan-wa').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
    $('plan-book').classList.toggle('btn--disabled', !lines.length);
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    // Permite enlazar una plantilla: calculadora.html?preset=nuevo
    var p = new URLSearchParams(location.search).get('preset');
    if (p && PRESETS[p]) applyPreset(p); else render();
  });
})();
