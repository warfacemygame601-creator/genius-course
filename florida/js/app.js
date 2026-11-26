/* FLORIDA | brand bags — логіка магазину (без фреймворків) */
(function () {
  'use strict';

  var D = window.FLORIDA;
  var DIRECT = 'https://ig.me/m/brand_bags213';
  var SITE = 'FLORIDA | brand bags';
  var CUT = { 'adidas-backpack': [392, 560], 'aldo-bowler': [493, 560], 'aldo-quilted-shopper': [500, 436], 'jc-bucket-backpack': [500, 526], 'jc-heart-shopper': [495, 560], 'jc-velour-baguette': [500, 284], 'jc-watch-set': [500, 250], 'karl-choupette-bag': [469, 560], 'karl-slippers': [500, 419], 'mk-cap': [500, 380], 'nautica-hobo': [470, 560], 'nautica-tote': [499, 516], 'puma-puffy-shopper': [500, 545], 'rb-puffy-shopper': [500, 490], 'rb-puffy-tote': [500, 362], 'rb-sneakers': [500, 467], 'sm-croc-wallet': [499, 378], 'sm-suede-backpack': [500, 463], 'th-monogram-tote': [500, 399], 'th-travel-tote': [500, 401] };
  var STORES = [
    { city: 'Хуст', address: 'м. Хуст, вул. Львівська, 159', q: 'Хуст, вулиця Львівська, 159' },
    { city: 'Тячів', address: 'м. Тячів, вул. Кошута, 26', q: 'Тячів, вулиця Кошута, 26' }
  ];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Утиліти ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }
  function goods(n) { return n + ' ' + plural(n, 'товар', 'товари', 'товарів'); }
  function icon(name, size) {
    size = size || 20;
    var p = {
      heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
      left: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.5" fill="none"/>',
      right: '<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" fill="none"/>',
      close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="7" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="17" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>',
      bag: '<path d="M5 8h14l-1.2 12H6.2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" stroke-width="1.5" fill="none"/>',
      send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/>'
    }[name];
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';
  }
  function img(src, alt, opt) {
    opt = opt || {};
    var w = opt.w || 640, h = opt.h || 800;
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '"' +
      (opt.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"' +
      (opt.cls ? ' class="' + opt.cls + '"' : '') + '>';
  }
  function cutImg(id, alt, cls, eager) {
    var s = CUT[id] || [500, 500];
    return img('img/' + id + '-cut.webp', alt, { w: s[0], h: s[1], cls: cls, eager: eager });
  }

  /* ---------- Дані ---------- */
  var P = D.PRODUCTS;
  D.BRANDS.forEach(function (b) { b.items = P.filter(function (p) { return p.brand === b.name; }); });
  function brandOf(p) { return D.BRANDS.filter(function (b) { return b.name === p.brand; })[0] || { slug: slugify(p.brand), name: p.brand }; }
  function brandBySlug(s) { return D.BRANDS.filter(function (b) { return b.slug === s; })[0]; }
  function cat(slug) { return D.CATEGORIES.filter(function (c) { return c.slug === slug; })[0]; }
  function sub(c, slug) { return c && c.subs.filter(function (s) { return s.slug === slug; })[0]; }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function countCat(c, s) { return P.filter(function (p) { return p.category === c && (!s || p.subcategory === s); }).length; }
  function variantsOf(p) { return p.variants && p.variants.length ? p.variants : [{ color: p.color, colorFamily: p.colorFamily, images: p.images }]; }
  function families(p) { return variantsOf(p).map(function (v) { return v.colorFamily; }); }
  function catLink(p) { return '#' + p.category + (p.subcategory ? '-' + p.subcategory : ''); }
  function catName(p) { var c = cat(p.category), s = sub(c, p.subcategory); return (c ? c.name : '') + (s ? ' · ' + s.name : ''); }

  /* ---------- Сховище ---------- */
  function load(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* приватний режим */ } }
  var cart = load('florida_cart', []).filter(function (l) { var p = byId(l.id); return p && !p.sold; });
  var favs = load('florida_favs', []).filter(byId);

  function cartQty() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function setBadge(el, n) {
    el.textContent = n; el.hidden = !n;
    el.classList.remove('pop'); void el.offsetWidth; if (n) el.classList.add('pop');
  }
  function syncBadges() {
    setBadge($('#cartCount'), cartQty());
    setBadge($('#favCount'), favs.length);
    $('#cartCount').parentNode.setAttribute('aria-label', 'Кошик' + (cartQty() ? ': ' + goods(cartQty()) : ''));
    $('#favCount').parentNode.setAttribute('aria-label', 'Обране' + (favs.length ? ': ' + goods(favs.length) : ''));
  }
  function addToCart(id, vi, size) {
    size = size || '';
    var l = cart.filter(function (x) { return x.id === id && x.v === vi && (x.s || '') === size; })[0];
    if (l) l.qty++; else cart.push({ id: id, v: vi, s: size, qty: 1 });
    save('florida_cart', cart); syncBadges();
    toast('Додано в кошик', '#cart', 'Перейти');
  }
  function toggleFav(id) {
    var i = favs.indexOf(id);
    if (i > -1) favs.splice(i, 1); else favs.push(id);
    save('florida_favs', favs); syncBadges();
    $$('[data-fav="' + id + '"]').forEach(function (b) {
      var on = favs.indexOf(id) > -1;
      b.setAttribute('aria-pressed', on);
      if (b.dataset.label) b.querySelector('span').textContent = on ? 'В обраному' : 'В обране';
    });
    toast(i > -1 ? 'Видалено з обраного' : 'Додано в обране', '#favorites', 'Обране');
    if (route.name === 'favorites') render();
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(text, href, label) {
    var t = $('#toast');
    t.innerHTML = '<span>' + esc(text) + '</span>' + (href ? '<a href="' + href + '">' + esc(label) + '</a>' : '');
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Шторки ---------- */
  var openDrawerEl = null, lastFocus = null;
  function openDrawer(id, trigger) {
    var d = document.getElementById(id); if (!d) return;
    if (openDrawerEl) closeDrawer(true);
    lastFocus = trigger || document.activeElement;
    d.hidden = false; void d.offsetWidth; d.classList.add('open');
    document.body.classList.add('locked');
    openDrawerEl = d;
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    var f = d.querySelector('input, .drawer__panel button, .drawer__panel a');
    setTimeout(function () { if (f) f.focus(); }, 60);
  }
  function closeDrawer(instant) {
    var d = openDrawerEl; if (!d) return;
    d.classList.remove('open');
    document.body.classList.remove('locked');
    $$('[aria-controls="' + d.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    openDrawerEl = null;
    if (instant || reduceMotion) d.hidden = true; else setTimeout(function () { if (!d.classList.contains('open')) d.hidden = true; }, 350);
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }
  function trapFocus(e, root) {
    var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]', root).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Мегаменю / меню / футер ---------- */
  function buildNav() {
    var mega = D.CATEGORIES.map(function (c) {
      return '<div class="mega__col"><h3><a href="#' + c.slug + '">' + esc(c.name) + '</a></h3><ul>' +
        c.subs.map(function (s) { return '<li><a href="#' + c.slug + '-' + s.slug + '">' + esc(s.name) + '</a></li>'; }).join('') +
        (c.subs.length ? '' : '<li><a href="#' + c.slug + '">Усі ' + esc(c.name.toLowerCase()) + '</a></li>') + '</ul></div>';
    }).join('');
    var nNew = P.filter(function (p) { return p.isNew; }).length;
    mega += '<a class="mega__promo" href="#new"><div><span class="small" style="color:#121212">' + goods(nNew) + '</span><h3>Новинки сезону</h3></div>' +
      '<span class="link">Дивитися ' + icon('arrow', 16) + '</span>' + cutImg('jc-bucket-backpack', '', '', false) + '</a>' +
      '<div class="mega__col"><h3><a href="#catalog">Весь каталог</a></h3><ul><li><a href="#brands">Усі бренди</a></li><li><a href="#gifts-certificates">Сертифікати</a></li></ul></div>';
    $('#megaInner').innerHTML = mega;

    $('#mobileNav').innerHTML = '<a href="#catalog">Весь каталог</a>' + D.CATEGORIES.map(function (c) {
      if (!c.subs.length) return '<a href="#' + c.slug + '">' + esc(c.name) + '<small class="muted">' + countCat(c.slug) + '</small></a>';
      return '<details><summary>' + esc(c.name) + '</summary><ul><li><a href="#' + c.slug + '">Усі ' + esc(c.name.toLowerCase()) + ' <small>' + countCat(c.slug) + '</small></a></li>' +
        c.subs.map(function (s) { return '<li><a href="#' + c.slug + '-' + s.slug + '">' + esc(s.name) + ' <small>' + countCat(c.slug, s.slug) + '</small></a></li>'; }).join('') + '</ul></details>';
    }).join('') + '<a href="#new">Новинки</a><a href="#brands">Бренди</a><a href="#gifts-certificates">Сертифікати</a><a href="#about">Про нас</a><a href="#delivery">Доставка й оплата</a><a href="#contacts">Контакти</a>' +
      '<a class="btn btn--accent" href="' + DIRECT + '" target="_blank" rel="noopener">' + icon('send', 18) + ' Написати в Direct</a>';

    $('#footerCats').innerHTML = D.CATEGORIES.map(function (c) { return '<li><a href="#' + c.slug + '">' + esc(c.name) + '</a></li>'; }).join('') + '<li><a href="#new">Новинки</a></li>';
    $('#year').textContent = new Date().getFullYear();
  }
  var megaBtn, megaEl, megaTimer;
  function setMega(open) {
    megaBtn.setAttribute('aria-expanded', open);
    clearTimeout(megaTimer);
    if (open) { megaEl.hidden = false; void megaEl.offsetWidth; megaEl.classList.add('open'); }
    else { megaEl.classList.remove('open'); megaTimer = setTimeout(function () { megaEl.hidden = true; }, reduceMotion ? 0 : 250); }
  }

  /* ---------- Картка товару ---------- */
  function card(p) {
    var v = variantsOf(p), main = p.images[0], alt = p.images[1];
    var sizes = p.sizes && p.sizes.length ? '<div class="card__sizes">Розміри: ' + esc(p.sizes.join(', ')) + '</div>' : '';
    var isFav = favs.indexOf(p.id) > -1;
    return '<article class="card' + (p.sold ? ' is-sold' : '') + '">' +
      '<a class="card__media" href="#product/' + p.id + '" tabindex="-1" aria-hidden="true">' +
      img(main, '', { cls: 'main' + (alt ? ' has-alt' : '') }) + (alt ? img(alt, '', { cls: 'alt' }) : '') + '</a>' +
      (p.sold ? '<span class="tag tag--sold">Продано</span>' : p.isNew ? '<span class="tag">Новинка</span>' : '') +
      '<button class="fav-btn" type="button" data-fav="' + p.id + '" aria-pressed="' + isFav + '" aria-label="В обране: ' + esc(p.brand + ' ' + p.name) + '">' + icon('heart', 20) + '</button>' +
      '<div class="card__body"><div class="card__brand">' + esc(p.brand) + '</div>' +
      '<h3 class="card__name"><a href="#product/' + p.id + '">' + esc(p.name) + '</a></h3>' +
      '<div class="card__price">' + (p.sold ? 'Продано' : 'Ціна за запитом') + '</div>' + (p.sold ? '' : sizes) +
      (v.length > 1 ? '<div class="card__dots" aria-label="Кольори: ' + esc(v.map(function (x) { return x.color; }).join(', ')) + '">' + v.map(function (x) { return '<span class="dot" style="background:' + D.COLORS[x.colorFamily].hex + '"></span>'; }).join('') + '</div>' : '') +
      '</div></article>';
  }
  function emptyState(title, text, btn) {
    return '<div class="empty"><div class="empty__icon">' + icon('bag', 26) + '</div><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p>' + btn + '</div>';
  }

  /* ---------- Маршрути ---------- */
  var route = { name: '' };
  function parse() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, '')).replace(/\/$/, '');
    if (!h) return { name: 'home' };
    var parts = h.split('/');
    if (parts[0] === 'product' && parts[1]) return { name: 'product', id: parts[1], v: parseInt(parts[2] || '0', 10) || 0 };
    if (parts[0] === 'brand' && parts[1]) return { name: 'catalog', brand: parts[1] };
    if (['catalog', 'new', 'brands', 'cart', 'favorites', 'about', 'delivery', 'contacts'].indexOf(h) > -1) {
      if (h === 'catalog') return { name: 'catalog' };
      if (h === 'new') return { name: 'catalog', isNew: true };
      return { name: h };
    }
    var m = h.match(/^([a-z]+)(?:-([a-z]+))?$/);
    if (m && cat(m[1]) && (!m[2] || sub(cat(m[1]), m[2]))) return { name: 'catalog', cat: m[1], sub: m[2] || '' };
    return { name: '404' };
  }
  function setMeta(title, desc) {
    document.title = title ? title + ' — ' + SITE : SITE + ' — брендові сумки та аксесуари зі США';
    var d = desc || 'FLORIDA — бутик оригінальних брендових сумок, аксесуарів і взуття зі США. Магазини в Хусті та Тячеві.';
    $('meta[name="description"]').setAttribute('content', d);
    $('meta[property="og:title"]').setAttribute('content', document.title);
    $('meta[property="og:description"]').setAttribute('content', d);
  }
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="Хлібні крихти"><a href="#">Головна</a>' + list.map(function (c, i) {
      return '<span aria-hidden="true">/</span>' + (c[1] && i < list.length - 1 ? '<a href="' + c[1] + '">' + esc(c[0]) + '</a>' : '<span aria-current="page">' + esc(c[0]) + '</span>');
    }).join('') + '</nav>';
  }

  var pageCleanup = null;
  function render() {
    var prev = route;
    route = parse();
    if (pageCleanup) { pageCleanup(); pageCleanup = null; }
    var app = $('#app');
    var views = { home: home, catalog: catalog, product: product, brands: brands, cart: cartPage, favorites: favorites, about: about, delivery: delivery, contacts: contacts, '404': notFound };
    app.innerHTML = '';
    (views[route.name] || notFound)(app);
    app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
    if (!(prev.name === route.name && route.name === 'product' && prev.id === route.id)) window.scrollTo(0, 0);
    setupReveal(app);
    $$('.nav__link[href]').forEach(function (a) {
      var on = a.getAttribute('href') === location.hash || (a.getAttribute('href') === '#new' && route.isNew);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (megaEl && !megaEl.hidden) setMega(false);
  }

  var io = null;
  function setupReveal(root) {
    var els = $$('.reveal', root);
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    if (!io) io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Головна ---------- */
  function home(app) {
    setMeta('', '');
    var news = P.filter(function (p) { return p.isNew; });
    var brandsWith = D.BRANDS.filter(function (b) { return b.slug !== 'florida'; });
    var marq = brandsWith.map(function (b) { return '<a href="' + (b.items.length ? '#brand/' + b.slug : '#brands') + '">' + esc(b.name) + '</a>'; }).join('');
    app.innerHTML =
      '<section class="hero"><div class="wrap hero__grid">' +
      '<div><p class="eyebrow">Хуст · Тячів · Instagram</p><h1>Брендові сумки та аксесуари зі США</h1>' +
      '<p>Оригінальні Tommy Hilfiger, Juicy Couture, Steve Madden, ALDO, Nautica та інші бренди. Приміряйте в магазині або замовляйте в Direct.</p>' +
      '<div class="hero__actions"><a class="btn" href="#catalog">Перейти в каталог</a><a class="btn btn--ghost" href="#new">Новинки</a></div></div>' +
      '<div class="hero__stage" role="img" aria-label="Вітрина: рюкзак Juicy Couture, тоут Tommy Hilfiger і шопер ALDO">' +
      '<span class="hero__disc"></span>' +
      cutImg('th-monogram-tote', '', 'hero__bag hero__bag--l', true) +
      cutImg('jc-bucket-backpack', '', 'hero__bag hero__bag--c', true) +
      cutImg('aldo-quilted-shopper', '', 'hero__bag hero__bag--r', true) +
      '</div></div></section>' +

      '<section class="marquee" aria-label="Бренди в магазині"><div class="marquee__track">' + marq + '<span aria-hidden="true" style="display:contents">' + marq.replace(/<a /g, '<a tabindex="-1" ') + '</span></div></section>' +

      '<section class="section"><div class="wrap"><div class="section__head reveal"><div><h2 class="section__title">Категорії</h2><p class="section__sub">Сумки, рюкзаки, гаманці, аксесуари й взуття — усе з бирками брендів.</p></div><a class="link" href="#catalog">Весь каталог ' + icon('arrow', 16) + '</a></div>' +
      '<div class="cats">' + D.CATEGORIES.map(function (c, i) {
        var im = c.slug === 'gifts' ? img(c.img, '', { cls: 'cover' }) : cutImg(c.img.replace('img/', '').replace('-cut.webp', ''), '');
        return '<a class="cat reveal" style="transition-delay:' + (i * 60) + 'ms" href="#' + c.slug + '"><div class="cat__img">' + im + '</div><div class="cat__meta"><span class="cat__name">' + esc(c.name) + '</span><span class="cat__count">' + goods(countCat(c.slug)) + '</span></div></a>';
      }).join('') + '</div></div></section>' +

      '<section class="section" style="padding-top:0"><div class="wrap"><div class="section__head reveal"><div><h2 class="section__title">Новинки</h2><p class="section__sub">Свіжі надходження з останніх поставок.</p></div>' +
      '<div class="rail-nav"><button class="round-btn" type="button" id="railPrev" aria-label="Попередні новинки">' + icon('left') + '</button><button class="round-btn" type="button" id="railNext" aria-label="Наступні новинки">' + icon('right') + '</button></div></div>' +
      '<div class="rail" id="rail" tabindex="0" aria-label="Стрічка новинок">' + news.map(card).join('') + '</div></div></section>' +

      '<section class="section" style="padding-top:0"><div class="wrap split">' +
      '<div class="split__img reveal">' + img('img/store-door.jpg', 'Вхід у магазин FLORIDA з жовтою вивіскою') + '</div>' +
      '<div class="reveal"><p class="eyebrow">Наші магазини</p><h2>Приходьте приміряти</h2><p class="muted">Подивіться фактуру, фурнітуру й розмір наживо. Ми допоможемо підібрати сумку під ваш образ.</p>' +
      '<div class="stores">' + STORES.map(function (s) { return '<div class="store-line"><div><b>' + s.city + '</b><span class="muted">' + s.address.replace('м. ' + s.city + ', ', '') + '</span></div><a class="link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.q) + '" target="_blank" rel="noopener">Маршрут</a></div>'; }).join('') + '</div>' +
      '<a class="btn btn--ghost" href="#contacts">Усі контакти</a></div></div></section>' +

      '<section class="section" style="padding-top:0"><div class="wrap"><div class="cert reveal"><div class="cert__text"><h2>Подарунковий сертифікат FLORIDA</h2><p>Коли не знаєте, яку сумку обрати, — подаруйте можливість вибору. Номінал і оформлення узгодимо в Direct.</p><a class="btn" href="#product/gift-certificate">Детальніше</a></div>' +
      '<div class="cert__img">' + img('img/cert.jpg', 'Подарунковий сертифікат FLORIDA у святковому пакуванні') + '</div></div></div></section>' +

      '<section class="section" style="padding-top:0"><div class="wrap"><div class="section__head reveal"><h2 class="section__title">Чому FLORIDA</h2></div><div class="why">' +
      [['Оригінали зі США', 'Привозимо речі брендів зі США — з фірмовими бирками та фурнітурою.'],
       ['Два магазини', 'Приміряйте в Хусті або Тячеві й оберіть наживо.'],
       ['Консультація в Direct', 'Підкажемо ціну, наявність і підберемо модель під ваш запит.'],
       ['Подарункові сертифікати', 'Красиве оформлення та вибір для того, кому даруєте.']].map(function (w, i) {
        return '<div class="why__item reveal" style="transition-delay:' + (i * 70) + 'ms"><div class="why__num">' + (i + 1) + '</div><h3>' + w[0] + '</h3><p>' + w[1] + '</p></div>';
      }).join('') + '</div></div></section>' +

      '<section class="section" style="padding-top:0"><div class="wrap"><div class="section__head reveal"><div><h2 class="section__title">Ми в Instagram</h2><p class="section__sub">@brand_bags213 — новинки, огляди та образи щотижня.</p></div><a class="link" href="https://www.instagram.com/brand_bags213/" target="_blank" rel="noopener">Підписатися ' + icon('arrow', 16) + '</a></div>' +
      '<div class="insta">' + [['store-hall', 'Торговий зал FLORIDA з полицями сумок'], ['cert', 'Подарунковий сертифікат FLORIDA'], ['ig-hust', 'Афіша відкриття магазину в Хусті'], ['store-door', 'Вхід у магазин FLORIDA'], ['ig-tyachiv', 'Локація магазину в Тячеві'], ['ig-soon', 'Жовтий пакет FLORIDA з чорною стрічкою']].map(function (x, i) {
        return '<a class="reveal" style="transition-delay:' + (i * 50) + 'ms" href="https://www.instagram.com/brand_bags213/" target="_blank" rel="noopener">' + img('img/' + x[0] + '.jpg', x[1]) + '</a>';
      }).join('') + '</div></div></section>';

    var rail = $('#rail'), prevB = $('#railPrev'), nextB = $('#railNext');
    function upd() { prevB.disabled = rail.scrollLeft < 4; nextB.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4; }
    function step(dir) { var c = rail.firstElementChild; rail.scrollBy({ left: dir * (c ? c.getBoundingClientRect().width + 14 : 300), behavior: reduceMotion ? 'auto' : 'smooth' }); }
    prevB.onclick = function () { step(-1); }; nextB.onclick = function () { step(1); };
    rail.addEventListener('scroll', upd, { passive: true }); upd();
    window.addEventListener('resize', upd);
    pageCleanup = function () { window.removeEventListener('resize', upd); };
  }

  /* ---------- Каталог ---------- */
  var F = null;
  function catalog(app) {
    var b = route.brand ? brandBySlug(route.brand) : null;
    if (route.brand && !b) return notFound(app);
    var c = cat(route.cat), s = sub(c, route.sub);
    F = { cat: route.cat || '', sub: route.sub || '', brands: b ? [b.name] : [], colors: [], isNew: !!route.isNew, inStock: false, sort: 'new' };
    var title = s ? s.name : c ? c.name : b ? b.name : route.isNew ? 'Новинки' : 'Каталог';
    var cr = [['Каталог', '#catalog']];
    if (c) cr.push([c.name, '#' + c.slug]);
    if (s) cr.push([s.name, '']);
    if (b) cr = [['Бренди', '#brands'], [b.name, '']];
    if (route.isNew) cr.push(['Новинки', '']);
    if (!c && !b && !route.isNew) cr = [['Каталог', '']];
    var lead = b ? b.about : c ? 'Оригінальні ' + (s ? s.name.toLowerCase() : c.name.toLowerCase()) + ' від брендів зі США. Ціну й наявність уточнюйте в Direct.' : route.isNew ? 'Останні надходження в магазини FLORIDA.' : 'Сумки, рюкзаки, гаманці, аксесуари та взуття від брендів зі США.';
    setMeta(title, lead);

    var chips = '';
    if (c && c.subs.length) {
      chips = '<div class="chips chips--scroll" style="margin-top:22px" aria-label="Підкатегорії"><a class="chip" href="#' + c.slug + '"' + (!s ? ' aria-current="page"' : '') + '>Усі <small>' + countCat(c.slug) + '</small></a>' +
        c.subs.map(function (x) { return '<a class="chip" href="#' + c.slug + '-' + x.slug + '"' + (s && s.slug === x.slug ? ' aria-current="page"' : '') + '>' + esc(x.name) + ' <small>' + countCat(c.slug, x.slug) + '</small></a>'; }).join('') + '</div>';
    } else if (!c) {
      chips = '<div class="chips chips--scroll" style="margin-top:22px" aria-label="Категорії">' + D.CATEGORIES.map(function (x) { return '<a class="chip" href="#' + x.slug + '">' + esc(x.name) + ' <small>' + countCat(x.slug) + '</small></a>'; }).join('') + '</div>';
    }

    app.innerHTML = '<div class="wrap">' + crumbs(cr) + '<h1 class="page-title">' + esc(title) + '</h1><p class="page-lead">' + esc(lead) + '</p>' + chips +
      '<div class="catalog"><aside class="filters" id="filtersDesk" aria-label="Фільтри"></aside>' +
      '<div><div class="toolbar"><span class="toolbar__count" id="fCount" aria-live="polite"></span><div class="toolbar__right">' +
      '<button class="btn btn--ghost filters-btn" type="button" data-open="filterDrawer" aria-controls="filterDrawer" aria-expanded="false">' + icon('filter', 18) + ' Фільтри</button>' +
      '<label class="sr" for="fSort">Сортування</label><div class="select"><select id="fSort"><option value="new">Спершу новинки</option><option value="name">Назва А–Я</option><option value="brand">Бренд</option></select></div></div></div>' +
      '<div class="pills" id="fPills"></div><div class="grid" id="fGrid"></div></div></div></div>' +
      '<div class="drawer drawer--right" id="filterDrawer" role="dialog" aria-modal="true" aria-label="Фільтри" hidden><div class="drawer__backdrop" data-close></div><div class="drawer__panel">' +
      '<div class="drawer__head"><span class="drawer__title">Фільтри</span><button class="icon-btn" type="button" data-close aria-label="Закрити фільтри">' + icon('close', 22) + '</button></div>' +
      '<div class="drawer__body" id="filtersMob"></div><div class="drawer__foot"><button class="btn btn--ghost" type="button" data-reset>Скинути</button><button class="btn" type="button" data-close id="fShow">Показати</button></div></div></div>';

    $('#fSort').addEventListener('change', function () { F.sort = this.value; updateCatalog(); });
    app.addEventListener('change', onFilterChange);
    app.addEventListener('click', onFilterClick);
    updateCatalog();
  }
  function baseList(ignore) {
    return P.filter(function (p) {
      if (F.cat && p.category !== F.cat) return false;
      if (F.sub && p.subcategory !== F.sub) return false;
      if (ignore !== 'brand' && F.brands.length && F.brands.indexOf(p.brand) < 0) return false;
      if (ignore !== 'color' && F.colors.length && !families(p).some(function (f) { return F.colors.indexOf(f) > -1; })) return false;
      if (ignore !== 'new' && F.isNew && !p.isNew) return false;
      if (F.inStock && p.sold) return false;
      return true;
    });
  }
  function filtersHtml(pre) {
    var forBrand = baseList('brand'), forColor = baseList('color');
    var catCounts = D.CATEGORIES.map(function (c) { return '<a class="fopt" href="#' + c.slug + '"' + (F.cat === c.slug ? ' aria-current="page" style="font-weight:600"' : '') + '>' + esc(c.name) + '<small>' + countCat(c.slug) + '</small></a>'; }).join('');
    var brandNames = D.BRANDS.filter(function (b) { return b.items.length; }).map(function (b) { return b.name; });
    var brandsH = brandNames.map(function (n) {
      var cnt = forBrand.filter(function (p) { return p.brand === n; }).length, on = F.brands.indexOf(n) > -1;
      if (!cnt && !on) return '';
      return '<label class="fopt' + (cnt ? '' : ' is-off') + '"><input type="checkbox" data-f="brand" value="' + esc(n) + '"' + (on ? ' checked' : '') + '>' + esc(n) + '<small>' + cnt + '</small></label>';
    }).join('');
    var colorsH = Object.keys(D.COLORS).map(function (k) {
      var cnt = forColor.filter(function (p) { return families(p).indexOf(k) > -1; }).length, on = F.colors.indexOf(k) > -1;
      if (!cnt && !on) return '';
      return '<button type="button" class="swatch" data-f="color" data-v="' + k + '" aria-pressed="' + on + '" aria-label="' + D.COLORS[k].name + ' (' + cnt + ')" title="' + D.COLORS[k].name + '"><span style="background:' + D.COLORS[k].hex + '"></span></button>';
    }).join('');
    return '<div class="fgroup"><h3>Категорія</h3><a class="fopt" href="#catalog"' + (!F.cat ? ' style="font-weight:600"' : '') + '>Усі категорії<small>' + P.length + '</small></a>' + catCounts + '</div>' +
      '<div class="fgroup"><h3>Бренд</h3>' + (brandsH || '<p class="small">Немає брендів для цього вибору</p>') + '</div>' +
      '<div class="fgroup"><h3>Колір</h3><div class="swatches">' + colorsH + '</div></div>' +
      '<div class="fgroup"><label class="toggle" for="' + pre + 'New"><span>Лише новинки</span><input type="checkbox" id="' + pre + 'New" data-f="new"' + (F.isNew ? ' checked' : '') + '><span class="toggle__ui" aria-hidden="true"></span></label>' +
      '<label class="toggle" for="' + pre + 'Stock"><span>Лише в наявності</span><input type="checkbox" id="' + pre + 'Stock" data-f="stock"' + (F.inStock ? ' checked' : '') + '><span class="toggle__ui" aria-hidden="true"></span></label></div>' +
      '<div class="fgroup" style="border:0"><button class="btn btn--ghost btn--block" type="button" data-reset>Скинути все</button></div>';
  }
  function sorted(list) {
    var l = list.slice();
    if (F.sort === 'name') l.sort(function (a, b) { return a.name.localeCompare(b.name, 'uk'); });
    else if (F.sort === 'brand') l.sort(function (a, b) { return a.brand.localeCompare(b.brand, 'en', { sensitivity: 'base' }) || a.name.localeCompare(b.name, 'uk'); });
    else l.sort(function (a, b) { return (b.isNew - a.isNew) || a.code.localeCompare(b.code); });
    l.sort(function (a, b) { return (!!a.sold) - (!!b.sold); });
    return l;
  }
  function updateCatalog() {
    var list = sorted(baseList());
    var fd = $('#filtersDesk'), fm = $('#filtersMob');
    var a = document.activeElement, key = a && a.dataset && a.dataset.f ? fkey(a) : null, inMob = key && fm.contains(a);
    fd.innerHTML = filtersHtml('d'); fm.innerHTML = filtersHtml('m');
    if (key) { var el = $$('[data-f]', inMob ? fm : fd).filter(function (x) { return fkey(x) === key; })[0]; if (el) el.focus(); }
    $('#fCount').textContent = 'Знайдено: ' + goods(list.length);
    $('#fShow').textContent = 'Показати ' + list.length;
    var pills = [];
    var c = cat(F.cat);
    F.brands.forEach(function (n) { pills.push(['brand', n, n]); });
    F.colors.forEach(function (k) { pills.push(['color', k, D.COLORS[k].name]); });
    if (F.isNew) pills.push(['new', '1', 'Лише новинки']);
    if (F.inStock) pills.push(['stock', '1', 'Лише в наявності']);
    $('#fPills').innerHTML = pills.map(function (x) { return '<span class="pill">' + esc(x[2]) + '<button type="button" data-rm="' + x[0] + '" data-v="' + esc(x[1]) + '" aria-label="Прибрати фільтр ' + esc(x[2]) + '">' + icon('close', 14) + '</button></span>'; }).join('') +
      (pills.length > 1 ? '<button class="link" type="button" data-reset style="border:0;background:none">Скинути все</button>' : '');
    $('#fGrid').innerHTML = list.length ? list.map(card).join('') : '';
    if (!list.length) $('#fGrid').innerHTML = '<div style="grid-column:1/-1">' + emptyState('Нічого не знайдено', 'Спробуйте змінити або скинути фільтри' + (c ? ' в категорії «' + c.name + '»' : '') + '.', '<button class="btn" type="button" data-reset>Скинути фільтри</button>') + '</div>';
  }
  function fkey(x) { return x.dataset.f + '|' + (x.dataset.f === 'brand' ? x.value : x.dataset.v || ''); }
  function onFilterChange(e) {
    var t = e.target; if (!t.dataset || !t.dataset.f) return;
    if (t.dataset.f === 'brand') { var i = F.brands.indexOf(t.value); if (t.checked && i < 0) F.brands.push(t.value); if (!t.checked && i > -1) F.brands.splice(i, 1); }
    if (t.dataset.f === 'new') F.isNew = t.checked;
    if (t.dataset.f === 'stock') F.inStock = t.checked;
    updateCatalog();
  }
  function onFilterClick(e) {
    var t = e.target.closest('[data-f="color"], [data-rm], [data-reset]'); if (!t) return;
    if (t.dataset.f === 'color') { var k = t.dataset.v, i = F.colors.indexOf(k); if (i > -1) F.colors.splice(i, 1); else F.colors.push(k); }
    if (t.dataset.rm) {
      var v = t.dataset.v;
      if (t.dataset.rm === 'brand') F.brands = F.brands.filter(function (x) { return x !== v; });
      if (t.dataset.rm === 'color') F.colors = F.colors.filter(function (x) { return x !== v; });
      if (t.dataset.rm === 'new') F.isNew = false;
      if (t.dataset.rm === 'stock') F.inStock = false;
    }
    if (t.hasAttribute('data-reset')) {
      F.brands = []; F.colors = []; F.isNew = false; F.inStock = false;
      if (route.brand || route.isNew || F.cat) { closeDrawer(true); location.hash = '#catalog'; return; }
    }
    updateCatalog();
  }

  /* ---------- Сторінка товару ---------- */
  var G = null;
  function product(app) {
    var p = byId(route.id);
    if (!p) return notFound(app);
    var vs = variantsOf(p), vi = Math.min(route.v, vs.length - 1);
    var b = brandOf(p), c = cat(p.category), s = sub(c, p.subcategory);
    setMeta(p.brand + ' — ' + p.name, p.brand + ' — ' + p.name + ', колір ' + vs[vi].color + '. ' + p.description + ' Ціна за запитом.');
    var isFav = favs.indexOf(p.id) > -1;
    var similar = P.filter(function (x) { return x.id !== p.id && x.category === p.category && x.brand !== p.brand; })
      .sort(function (a, b2) { return (b2.subcategory === p.subcategory) - (a.subcategory === p.subcategory); }).slice(0, 4);
    var more = P.filter(function (x) { return x.id !== p.id && x.brand === p.brand; }).slice(0, 4);
    var cr = [['Каталог', '#catalog'], [c.name, '#' + c.slug]];
    if (s) cr.push([s.name, '#' + c.slug + '-' + s.slug]);
    cr.push([p.name, '']);

    app.innerHTML = '<div class="wrap">' + crumbs(cr) + '<div class="product">' +
      '<div class="gallery" id="gallery"></div>' +
      '<div class="pinfo"><a class="pinfo__brand" href="#brand/' + b.slug + '">' + esc(p.brand) + '</a>' +
      (p.isNew ? ' <span class="notice" style="margin-left:8px">Новинка</span>' : '') +
      '<h1>' + esc(p.name) + '</h1><div class="pinfo__price">Ціна за запитом</div><p class="pinfo__note">Уточнюйте в Direct — відповімо щодо ціни та наявності.</p>' +
      '<p class="pinfo__label">Колір: <span id="pColor">' + esc(vs[vi].color) + '</span></p>' +
      '<div class="variants" role="group" aria-label="Колір">' + vs.map(function (v, i) {
        return '<button type="button" class="variant" data-vi="' + i + '" aria-pressed="' + (i === vi) + '"><span class="dot" style="background:' + D.COLORS[v.colorFamily].hex + '"></span>' + esc(v.color) + '</button>';
      }).join('') + '</div>' +
      (p.sizes && p.sizes.length && !p.sold ? '<p class="pinfo__label" id="sizeLbl">Розмір: <span id="pSize">оберіть розмір</span></p><div class="variants sizes" role="group" aria-labelledby="sizeLbl">' +
        p.sizes.map(function (z) { return '<button type="button" class="variant size" data-size="' + esc(z) + '" aria-pressed="false">' + esc(z) + '</button>'; }).join('') +
        '</div><p class="field__err" id="sizeErr" aria-live="polite"></p>' + (p.sizeNote ? '<p class="small">' + esc(p.sizeNote) + '</p>' : '') : '') +
      (p.sold ? '<div class="avail avail--sold"><span class="avail__dot" aria-hidden="true"></span><div><b style="font-weight:500">Цю модель уже продано</b><br><span class="muted">Більшість речей у нас в єдиному екземплярі. Напишіть у Direct — підберемо схожу.</span></div></div>' : '') +
      '<div class="pinfo__actions"><button class="btn" type="button" id="pAdd"' + (p.sold ? ' disabled' : '') + '>' + icon('bag', 18) + (p.sold ? ' Продано' : ' Додати в кошик') + '</button>' +
      '<button class="btn btn--ghost" type="button" data-fav="' + p.id + '" data-label="1" aria-pressed="' + isFav + '">' + icon('heart', 18) + '<span>' + (isFav ? 'В обраному' : 'В обране') + '</span></button>' +
      '<a class="btn btn--accent btn--direct" id="pDirect" href="' + DIRECT + '" target="_blank" rel="noopener">' + icon('send', 18) + (p.sold ? ' Запитати про схожу' : ' Замовити в Direct') + '</a></div>' +
      '<p class="small" style="margin-top:8px">Натискаючи «Замовити в Direct», ми скопіюємо текст запиту — просто вставте його в повідомлення.</p>' +
      (p.sold ? '' : '<div class="avail"><span class="avail__dot" aria-hidden="true"></span><div><b style="font-weight:500">Наявність у магазинах</b><br><span class="muted">Хуст, вул. Львівська, 159 · Тячів, вул. Кошута, 26. Перед візитом уточніть наявність моделі в Direct.</span></div></div>') +
      '<div class="acc">' +
      accItem('desc', 'Опис', '<p>' + esc(p.description) + '</p>', true) +
      accItem('spec', 'Характеристики', '<dl class="specs"><dt>Бренд</dt><dd><a href="#brand/' + b.slug + '" style="text-decoration:underline">' + esc(p.brand) + '</a></dd><dt>Категорія</dt><dd>' + esc(catName(p)) + '</dd><dt>Колір</dt><dd id="pColor2">' + esc(vs[vi].color) + '</dd><dt>Код товару</dt><dd>' + esc(p.code) + '</dd></dl>') +
      accItem('ship', 'Доставка й оплата', '<span class="notice">Зразок — звірити з власником</span><p>Самовивіз з магазинів у Хусті та Тячеві або доставка Новою поштою по Україні. Спосіб оплати узгоджуємо в Direct під час підтвердження замовлення. <a href="#delivery" style="text-decoration:underline">Детальніше</a></p>') +
      '</div></div></div>' +
      (similar.length ? '<section class="section" style="padding-top:24px"><div class="section__head"><h2 class="section__title">Схожі товари</h2></div><div class="grid grid--4">' + similar.map(card).join('') + '</div></section>' : '') +
      (more.length ? '<section class="section" style="padding-top:0"><div class="section__head"><h2 class="section__title">Ще від ' + esc(p.brand) + '</h2><a class="link" href="#brand/' + b.slug + '">Усі товари бренду ' + icon('arrow', 16) + '</a></div><div class="grid grid--4">' + more.map(card).join('') + '</div></section>' : '') +
      '</div>';

    G = { p: p, vi: vi, idx: 0 };
    renderGallery();
    $$('.variant[data-vi]', app).forEach(function (btn) {
      btn.addEventListener('click', function () {
        G.vi = +btn.dataset.vi; G.idx = 0;
        $$('.variant[data-vi]', app).forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
        $('#pColor').textContent = $('#pColor2').textContent = vs[G.vi].color;
        history.replaceState(null, '', '#product/' + p.id + (G.vi ? '/' + G.vi : ''));
        renderGallery();
      });
    });
    G.size = '';
    $$('.size', app).forEach(function (btn) {
      btn.addEventListener('click', function () {
        G.size = btn.dataset.size;
        $$('.size', app).forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
        $('#pSize').textContent = G.size; $('#sizeErr').textContent = '';
      });
    });
    $('#pAdd').addEventListener('click', function () {
      if (p.sold) return;
      if (p.sizes && p.sizes.length && !G.size) { $('#sizeErr').textContent = 'Оберіть розмір'; var f = $('.size', app); if (f) f.focus(); return; }
      addToCart(p.id, G.vi, G.size);
    });
    $('#pDirect').addEventListener('click', function () {
      copyText('Вітаю! Цікавить ' + p.brand + ' — ' + p.name + ' (' + vs[G.vi].color + (G.size ? ', розмір ' + G.size : '') + '), код ' + p.code + '. ' + (p.sold ? 'Бачу, що її вже продано. Чи є щось схоже?' : 'Підкажіть, будь ласка, ціну та наявність.'));
    });
    $$('.acc__btn', app).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open);
        document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('open', open);
      });
    });
    function onKey(e) {
      if (openDrawerEl || !$('#lightbox').hidden) return;
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') { go(-1); } else if (e.key === 'ArrowRight') { go(1); }
    }
    document.addEventListener('keydown', onKey);
    pageCleanup = function () { document.removeEventListener('keydown', onKey); };
  }
  function accItem(id, title, body, open) {
    return '<div class="acc__item"><h2 style="font-size:inherit"><button class="acc__btn" type="button" aria-expanded="' + !!open + '" aria-controls="acc-' + id + '" id="accb-' + id + '">' + title + '<span aria-hidden="true">+</span></button></h2>' +
      '<div class="acc__panel' + (open ? ' open' : '') + '" id="acc-' + id + '" role="region" aria-labelledby="accb-' + id + '"><div><div class="acc__inner">' + body + '</div></div></div></div>';
  }
  function curImages() { return variantsOf(G.p)[G.vi].images; }
  function renderGallery() {
    var ims = curImages(), p = G.p, color = variantsOf(p)[G.vi].color;
    var el = $('#gallery');
    el.innerHTML = '<div class="gallery__main" id="gMain" aria-roledescription="галерея" aria-label="Фото товару">' +
      '<div class="gallery__track" id="gTrack">' + ims.map(function (src, i) {
        return '<button type="button" data-zoom="' + i + '" aria-label="Збільшити фото ' + (i + 1) + '"' + (i ? ' tabindex="-1"' : '') + '>' + img(src, p.brand + ' ' + p.name + ', ' + color + ', фото ' + (i + 1), { eager: i === 0 }) + '</button>';
      }).join('') + '</div>' +
      (ims.length > 1 ? '<button class="gallery__arrow gallery__arrow--prev" type="button" id="gPrev" aria-label="Попереднє фото">' + icon('left') + '</button><button class="gallery__arrow gallery__arrow--next" type="button" id="gNext" aria-label="Наступне фото">' + icon('right') + '</button>' : '') +
      '<span class="gallery__count" id="gCount" aria-live="polite"></span></div>' +
      (ims.length > 1 ? '<div class="thumbs" role="group" aria-label="Мініатюри">' + ims.map(function (src, i) {
        return '<button type="button" data-thumb="' + i + '" aria-label="Фото ' + (i + 1) + '">' + img(src, '', { w: 128, h: 160 }) + '</button>';
      }).join('') + '</div>' : '');
    if (ims.length > 1) {
      $('#gPrev').onclick = function () { go(-1); };
      $('#gNext').onclick = function () { go(1); };
    }
    $$('[data-thumb]', el).forEach(function (t) { t.onclick = function () { show(+t.dataset.thumb); }; });
    $$('[data-zoom]', el).forEach(function (t) { t.onclick = function () { openLightbox(ims, +t.dataset.zoom, t); }; });
    var main = $('#gMain'), sx = null, sy = null;
    main.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      sx = null;
    }, { passive: true });
    show(0);
  }
  function show(i) {
    var ims = curImages();
    G.idx = Math.max(0, Math.min(ims.length - 1, i));
    $('#gTrack').style.transform = 'translateX(' + (-100 * G.idx) + '%)';
    $('#gCount').textContent = (G.idx + 1) + ' / ' + ims.length;
    $$('[data-thumb]').forEach(function (t) { t.setAttribute('aria-current', +t.dataset.thumb === G.idx); });
    $$('[data-zoom]').forEach(function (t) { t.tabIndex = +t.dataset.zoom === G.idx ? 0 : -1; });
    if ($('#gPrev')) { $('#gPrev').disabled = G.idx === 0; $('#gNext').disabled = G.idx === ims.length - 1; }
  }
  function go(d) { if (G) show(G.idx + d); }

  /* Лайтбокс */
  var LB = { ims: [], i: 0, trigger: null };
  function openLightbox(ims, i, trigger) {
    LB.ims = ims; LB.i = i; LB.trigger = trigger;
    var lb = $('#lightbox');
    lb.hidden = false; void lb.offsetWidth; lb.classList.add('open');
    document.body.classList.add('locked');
    lbShow();
    $('.lightbox__close').focus();
  }
  function lbShow() {
    var im = $('#lightboxImg');
    im.src = LB.ims[LB.i];
    im.alt = 'Фото ' + (LB.i + 1) + ' з ' + LB.ims.length;
    $('.lightbox__prev').hidden = LB.ims.length < 2; $('.lightbox__next').hidden = LB.ims.length < 2;
  }
  function lbStep(d) { LB.i = (LB.i + d + LB.ims.length) % LB.ims.length; lbShow(); if (G) show(LB.i); }
  function closeLightbox() {
    var lb = $('#lightbox');
    lb.classList.remove('open'); document.body.classList.remove('locked');
    setTimeout(function () { lb.hidden = true; }, reduceMotion ? 0 : 300);
    if (LB.trigger && document.contains(LB.trigger)) LB.trigger.focus();
  }

  /* ---------- Копіювання ---------- */
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? 'Текст скопійовано' : 'Не вдалося скопіювати — виділіть текст вручну');
      if (done) done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast('Текст скопійовано'); if (done) done(true); }, fallback);
    } else fallback();
  }

  /* ---------- Бренди ---------- */
  function brands(app) {
    setMeta('Бренди', 'Бренди в магазині FLORIDA: Tommy Hilfiger, Juicy Couture, Steve Madden, ALDO, Nautica, Michael Kors, Karl Lagerfeld та інші.');
    var withItems = D.BRANDS.filter(function (b) { return b.items.length; });
    var without = D.BRANDS.filter(function (b) { return !b.items.length; });
    app.innerHTML = '<div class="wrap">' + crumbs([['Бренди', '']]) + '<h1 class="page-title">Бренди</h1><p class="page-lead">Оригінальні речі американських і світових брендів. Оберіть бренд, щоб побачити всі його моделі.</p>' +
      '<div class="brands" style="margin-top:32px">' + withItems.map(function (b, n) {
        var pics = [];
        b.items.forEach(function (p) { pics.push(p.images[0]); });
        b.items.forEach(function (p) { p.images.slice(1).forEach(function (s) { pics.push(s); }); });
        pics = pics.slice(0, 3);
        var slots = '';
        for (var i = 0; i < 3; i++) slots += '<span>' + (pics[i] ? img(pics[i], '', { w: 213, h: 266 }) : '') + '</span>';
        return '<a class="bcard reveal" style="transition-delay:' + (n % 3 * 60) + 'ms" href="#brand/' + b.slug + '"><div class="bcard__imgs" aria-hidden="true">' + slots + '</div>' +
          '<div class="bcard__body"><div class="bcard__top"><h2>' + esc(b.name) + '</h2><span class="bcard__count">' + goods(b.items.length) + '</span></div><p>' + esc(b.about) + '</p></div></a>';
      }).join('') + '</div>' +
      (without.length ? '<section class="section" style="padding-top:48px"><h2 class="section__title" style="font-size:26px">Також у магазинах</h2><p class="section__sub">Моделі цих брендів ще не додані на сайт — наявність уточнюйте в Direct.</p><div class="bmini">' +
        without.map(function (b) { return '<a class="chip" href="' + DIRECT + '" target="_blank" rel="noopener">' + esc(b.name) + '</a>'; }).join('') + '</div></section>' : '') + '</div>';
  }

  /* ---------- Кошик ---------- */
  function cartPage(app) {
    setMeta('Кошик', 'Кошик FLORIDA: оформіть заявку, і ми підтвердимо ціну та наявність у Direct.');
    if (!cart.length) {
      app.innerHTML = '<div class="wrap">' + crumbs([['Кошик', '']]) + '<h1 class="page-title">Кошик</h1><div style="margin:32px 0 80px">' +
        emptyState('Кошик порожній', 'Додайте товари з каталогу — і ми підтвердимо ціну та наявність у Direct.', '<a class="btn" href="#catalog">Перейти в каталог</a>') + '</div></div>';
      return;
    }
    app.innerHTML = '<div class="wrap">' + crumbs([['Кошик', '']]) + '<h1 class="page-title">Кошик</h1><p class="page-lead">Цін на сайті немає: надішліть заявку, і ми відповімо в Direct з ціною та наявністю.</p>' +
      '<div class="cart"><div><div id="lines"></div><a class="link" href="#catalog" style="margin-top:12px">' + icon('left', 16) + ' Продовжити покупки</a></div>' +
      '<div class="panel" id="checkout"></div></div></div>';
    renderLines(); renderForm();
  }
  function renderLines() {
    var box = $('#lines'); if (!box) return;
    if (!cart.length) { render(); return; }
    box.innerHTML = cart.map(function (l, i) {
      var p = byId(l.id), v = variantsOf(p)[l.v] || variantsOf(p)[0];
      return '<div class="line"><a class="line__img" href="#product/' + p.id + (l.v ? '/' + l.v : '') + '">' + img(v.images[0], p.brand + ' ' + p.name, { w: 176, h: 220 }) + '</a>' +
        '<div><div class="card__brand">' + esc(p.brand) + '</div><a class="line__name" href="#product/' + p.id + (l.v ? '/' + l.v : '') + '">' + esc(p.name) + '</a>' +
        '<div class="line__meta">Колір: ' + esc(v.color) + (l.s ? ' · Розмір: ' + esc(l.s) : '') + ' · ' + esc(p.code) + ' · Ціна за запитом</div>' +
        '<div class="line__row"><div class="qty" role="group" aria-label="Кількість"><button type="button" data-q="-1" data-i="' + i + '" aria-label="Зменшити кількість">−</button><output aria-live="polite">' + l.qty + '</output><button type="button" data-q="1" data-i="' + i + '" aria-label="Збільшити кількість">+</button></div>' +
        '<button class="remove" type="button" data-del="' + i + '">Видалити</button></div></div></div>';
    }).join('');
    box.onclick = function (e) {
      var t = e.target.closest('[data-q],[data-del]'); if (!t) return;
      var i = +t.dataset.i;
      if (t.dataset.del != null) { cart.splice(+t.dataset.del, 1); toast('Товар видалено з кошика'); }
      else { cart[i].qty = Math.max(1, Math.min(20, cart[i].qty + (+t.dataset.q))); }
      save('florida_cart', cart); syncBadges(); renderLines();
    };
  }
  function renderForm() {
    var saved = load('florida_contact', {});
    $('#checkout').innerHTML = '<h2>Оформлення заявки</h2><p class="small">Після відправки ви отримаєте готовий текст замовлення для Instagram Direct.</p>' +
      '<form class="form" id="orderForm" novalidate>' +
      field('oName', 'Ім\'я', '<input id="oName" name="name" autocomplete="name" required value="' + esc(saved.name || '') + '">') +
      field('oPhone', 'Телефон', '<input id="oPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+380 XX XXX XX XX" required value="' + esc(saved.phone || '') + '">') +
      field('oIg', 'Instagram (необов\'язково)', '<input id="oIg" name="ig" autocomplete="off" placeholder="@nickname" value="' + esc(saved.ig || '') + '">') +
      '<fieldset class="field"><legend>Спосіб отримання</legend><div class="radios">' +
      ['Самовивіз у Хусті', 'Самовивіз у Тячеві', 'Нова пошта'].map(function (o, i) { return '<label class="radio"><input type="radio" name="ship" value="' + o + '"' + (i === 0 ? ' checked' : '') + '>' + o + '</label>'; }).join('') +
      '</div></fieldset>' +
      '<div class="np" id="npBox" hidden>' + field('oCity', 'Місто', '<input id="oCity" name="city" autocomplete="address-level2">') + field('oBranch', 'Відділення або поштомат', '<input id="oBranch" name="branch" placeholder="№ відділення">') + '</div>' +
      field('oNote', 'Коментар', '<textarea id="oNote" name="note" placeholder="Наприклад, зручний час для зв\'язку"></textarea>') +
      '<button class="btn btn--block" type="submit">Сформувати замовлення</button></form><div id="orderOut"></div>';
    var f = $('#orderForm');
    f.addEventListener('change', function (e) {
      if (e.target.name === 'ship') { var np = e.target.value === 'Нова пошта'; $('#npBox').hidden = !np; }
    });
    $('#oPhone').addEventListener('focus', function () { if (!this.value) this.value = '+380'; });
    $('#oPhone').addEventListener('blur', function () { if (this.value === '+380') this.value = ''; });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      function check(id, cond, msg) {
        var el = $('#' + id), err = $('#' + id + 'Err');
        el.setAttribute('aria-invalid', !cond); err.textContent = cond ? '' : msg;
        if (!cond) { ok = false; first = first || el; }
      }
      var dg = $('#oPhone').value.replace(/\D/g, '');
      if (/^380380/.test(dg)) dg = dg.slice(3);
      if (/^0\d{9}$/.test(dg)) dg = '38' + dg;
      var phone = '+' + dg;
      if (/^\+380\d{9}$/.test(phone)) $('#oPhone').value = phone;
      var np = f.ship.value === 'Нова пошта';
      check('oName', $('#oName').value.trim().length > 1, 'Вкажіть ім\'я');
      check('oPhone', /^\+380\d{9}$/.test(phone), 'Формат: +380 і 9 цифр, наприклад +380 67 123 45 67');
      if (np) { check('oCity', $('#oCity').value.trim().length > 1, 'Вкажіть місто'); check('oBranch', $('#oBranch').value.trim().length > 0, 'Вкажіть відділення'); }
      if (!ok) { first.focus(); return; }
      save('florida_contact', { name: $('#oName').value.trim(), phone: phone, ig: $('#oIg').value.trim() });
      var lines = cart.map(function (l, i) {
        var p = byId(l.id), v = variantsOf(p)[l.v] || variantsOf(p)[0];
        return (i + 1) + '. ' + p.brand + ' — ' + p.name + ' (колір: ' + v.color + (l.s ? ', розмір: ' + l.s : '') + '), код ' + p.code + ' — ' + l.qty + ' шт.';
      });
      var text = 'Вітаю! Хочу оформити замовлення з сайту FLORIDA:\n\n' + lines.join('\n') +
        '\n\nІм\'я: ' + $('#oName').value.trim() + '\nТелефон: ' + phone +
        ($('#oIg').value.trim() ? '\nInstagram: ' + $('#oIg').value.trim() : '') +
        '\nОтримання: ' + f.ship.value + (np ? ' — ' + $('#oCity').value.trim() + ', відділення ' + $('#oBranch').value.trim() : '') +
        ($('#oNote').value.trim() ? '\nКоментар: ' + $('#oNote').value.trim() : '') +
        '\n\nПідкажіть, будь ласка, ціну та наявність.';
      orderResult($('#orderOut'), text, 'Замовлення готове');
    });
  }
  function orderResult(box, text, title) {
    box.innerHTML = '<div class="np" style="margin-top:22px;padding-top:20px;border-top:1px solid var(--line)"><h3 style="font-size:20px" tabindex="-1" id="resTitle">' + esc(title) + '</h3>' +
      '<p class="small">Скопіюйте текст і надішліть його нам у Direct — ми відповімо з ціною та наявністю.</p><div class="order-text" id="resText">' + esc(text) + '</div>' +
      '<div style="display:grid;gap:10px;grid-template-columns:1fr 1fr"><button class="btn btn--ghost" type="button" id="resCopy">Скопіювати</button><a class="btn btn--accent" href="' + DIRECT + '" target="_blank" rel="noopener" id="resDirect">Відкрити Direct</a></div></div>';
    $('#resCopy').onclick = function () { var b = this; copyText(text, function (ok) { if (ok) b.textContent = 'Скопійовано'; }); };
    $('#resDirect').onclick = function () { copyText(text); };
    $('#resTitle').focus();
  }
  function field(id, label, input) {
    return '<div class="field"><label for="' + id + '">' + label + '</label>' + input.replace('<input ', '<input aria-describedby="' + id + 'Err" ').replace('<textarea ', '<textarea aria-describedby="' + id + 'Err" ') + '<span class="field__err" id="' + id + 'Err" aria-live="polite"></span></div>';
  }

  /* ---------- Обране ---------- */
  function favorites(app) {
    setMeta('Обране', 'Збережені товари FLORIDA.');
    var list = favs.map(byId).filter(Boolean);
    app.innerHTML = '<div class="wrap">' + crumbs([['Обране', '']]) + '<h1 class="page-title">Обране</h1>' +
      (list.length ? '<p class="page-lead">' + goods(list.length) + '</p><div class="grid grid--4" style="margin:28px 0 80px">' + list.map(card).join('') + '</div>'
        : '<div style="margin:32px 0 80px">' + emptyState('Тут поки порожньо', 'Натисніть на сердечко на картці товару, щоб зберегти його тут.', '<a class="btn" href="#catalog">Перейти в каталог</a>') + '</div>') + '</div>';
  }

  /* ---------- Текстові сторінки ---------- */
  function about(app) {
    setMeta('Про нас', 'FLORIDA — бутик оригінальних брендових сумок і аксесуарів зі США в Хусті та Тячеві.');
    var nb = D.BRANDS.filter(function (b) { return b.slug !== 'florida'; }).length;
    app.innerHTML = '<div class="wrap">' + crumbs([['Про нас', '']]) + '<div class="prose"><h1 class="page-title">Про FLORIDA</h1>' +
      '<p>FLORIDA | brand bags — магазин брендових сумок, аксесуарів і взуття. Ми привозимо оригінальні речі брендів зі США: Tommy Hilfiger, Juicy Couture, Steve Madden, ALDO, Nautica, Michael Kors, Karl Lagerfeld, GUESS, DKNY та інших.</p>' +
      '<p>У наших магазинах у Хусті та Тячеві можна спокійно роздивитися кожну модель, приміряти й порадитися. Новинки ми щотижня показуємо в Instagram, а замовити можна просто в Direct.</p></div>' +
      '<div class="stats">' + [[nb, plural(nb, 'бренд', 'бренди', 'брендів') + ' в асортименті'], [STORES.length, 'магазини: Хуст і Тячів'], [P.length, plural(P.length, 'модель', 'моделі', 'моделей') + ' на сайті']].map(function (s) {
        return '<div class="stat reveal"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>';
      }).join('') + '</div>' +
      '<div class="photos2">' + img('img/store-hall.jpg', 'Торговий зал FLORIDA: полиці з сумками') + img('img/store-door.jpg', 'Вхід у магазин FLORIDA') + '</div></div>';
  }
  function delivery(app) {
    setMeta('Доставка й оплата', 'Умови доставки, оплати та повернення в магазині FLORIDA (зразок).');
    app.innerHTML = '<div class="wrap">' + crumbs([['Доставка й оплата', '']]) + '<div class="prose" style="padding-bottom:60px"><h1 class="page-title">Доставка й оплата</h1>' +
      '<span class="notice">Зразок умов — звірити з власником перед публікацією</span>' +
      '<h2>Як оформити</h2><ul><li>Додайте товари в кошик і сформуйте заявку або напишіть нам у Direct.</li><li>Ми підтвердимо ціну, наявність і спосіб отримання.</li></ul>' +
      '<h2>Отримання</h2><ul><li>Самовивіз у Хусті: вул. Львівська, 159.</li><li>Самовивіз у Тячеві: вул. Кошута, 26.</li><li>Нова пошта по Україні — у відділення або поштомат, за тарифами перевізника.</li></ul>' +
      '<h2>Оплата</h2><ul><li>У магазині — готівкою або карткою (уточнити).</li><li>Для Нової пошти — передоплата або накладений платіж (уточнити).</li></ul>' +
      '<h2>Обмін і повернення</h2><p>Обмін і повернення товару належної якості — відповідно до Закону України «Про захист прав споживачів». Точні умови уточнюйте в Direct.</p>' +
      '<a class="btn btn--accent" href="' + DIRECT + '" target="_blank" rel="noopener">' + icon('send', 18) + ' Запитати в Direct</a></div></div>';
  }
  function contacts(app) {
    setMeta('Контакти', 'Магазини FLORIDA в Хусті (вул. Львівська, 159) і Тячеві (вул. Кошута, 26). Instagram, TikTok, Threads.');
    app.innerHTML = '<div class="wrap">' + crumbs([['Контакти', '']]) + '<h1 class="page-title">Контакти</h1><p class="page-lead">Приходьте в магазини або пишіть нам онлайн.</p>' +
      '<div class="cards2">' + STORES.map(function (s) {
        return '<div class="scard"><div class="scard__body"><p class="eyebrow">Магазин</p><h2>' + s.city + '</h2><p>' + s.address + '</p><a class="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.q) + '" target="_blank" rel="noopener">Відкрити в Google Maps</a></div></div>';
      }).join('') + '</div>' +
      '<h2 class="section__title" style="font-size:28px;margin-bottom:16px">Онлайн</h2><div class="online">' +
      '<a href="' + DIRECT + '" target="_blank" rel="noopener"><span><small>Instagram Direct</small>@brand_bags213</span>' + icon('arrow', 18) + '</a>' +
      '<a href="https://www.tiktok.com/@brand_bags37" target="_blank" rel="noopener"><span><small>TikTok</small>@brand_bags37</span>' + icon('arrow', 18) + '</a>' +
      '<a href="https://www.threads.net/@brand_bags213" target="_blank" rel="noopener"><span><small>Threads</small>@brand_bags213</span>' + icon('arrow', 18) + '</a></div>' +
      '<div class="panel" style="max-width:620px;margin-bottom:80px;position:static"><h2>Поставити питання</h2><p class="small">Ми сформуємо текст повідомлення — скопіюйте його й надішліть у Direct.</p>' +
      '<form class="form" id="askForm" novalidate>' + field('qName', 'Ім\'я', '<input id="qName" autocomplete="name" required>') +
      field('qText', 'Ваше питання', '<textarea id="qText" required placeholder="Наприклад: чи є рюкзак Steve Madden у Тячеві?"></textarea>') +
      '<button class="btn" type="submit">Сформувати повідомлення</button></form><div id="askOut"></div></div></div>';
    $('#askForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#qName'), t = $('#qText'), ok = true;
      [[n, 'Вкажіть ім\'я'], [t, 'Напишіть питання']].forEach(function (x) {
        var good = x[0].value.trim().length > 1;
        x[0].setAttribute('aria-invalid', !good); $('#' + x[0].id + 'Err').textContent = good ? '' : x[1];
        if (!good && ok) { ok = false; x[0].focus(); }
      });
      if (!ok) return;
      orderResult($('#askOut'), 'Вітаю! Мене звати ' + n.value.trim() + '.\n' + t.value.trim(), 'Повідомлення готове');
    });
  }
  function notFound(app) {
    setMeta('Сторінку не знайдено', 'Сторінку не знайдено.');
    route.name = '404';
    app.innerHTML = '<div class="wrap nf"><b>4<span aria-hidden="true"></span>4</b><h1 class="page-title" style="font-size:28px">Сторінку не знайдено</h1><p>Можливо, посилання застаріло або товар уже продано.</p><a class="btn" href="#catalog">Перейти в каталог</a></div>';
  }

  /* ---------- Пошук ---------- */
  var searchIndex = P.map(function (p) {
    var c = cat(p.category), s = sub(c, p.subcategory);
    return { p: p, t: [p.brand, p.name, p.color, c && c.name, s && s.name, p.code, variantsOf(p).map(function (v) { return v.color; }).join(' '), p.isNew ? 'новинки новинка' : ''].join(' ').toLowerCase() };
  });
  function stem(w) { return w.length > 4 ? w.replace(/(ами|ями|ах|ях|ів|ей|и|і|а|я|у|ю|ом|ем|ою|ею)$/, '') : w; }
  function searchRun(q) {
    var box = $('#searchResults');
    q = q.trim().toLowerCase();
    if (!q) { box.innerHTML = ''; return []; }
    var toks = q.split(/\s+/).map(stem);
    var res = searchIndex.filter(function (x) { return toks.every(function (t) { return x.t.indexOf(t) > -1; }); }).map(function (x) { return x.p; });
    box.innerHTML = res.length ? res.slice(0, 8).map(function (p) {
      return '<a class="sres" href="#product/' + p.id + '">' + img(p.images[0], '', { w: 112, h: 140 }) + '<span><small>' + esc(p.brand) + '</small><b>' + esc(p.name) + '</b><small>' + esc(p.color) + (p.sold ? ' · Продано' : ' · Ціна за запитом') + '</small></span></a>';
    }).join('') + (res.length > 8 ? '<p class="search__empty">Ще ' + (res.length - 8) + ' — уточніть запит</p>' : '')
      : '<p class="search__empty">Нічого не знайдено за запитом «' + esc(q) + '». Спробуйте назву бренду або категорію.</p>';
    return res;
  }

  /* ---------- Події ---------- */
  function init() {
    buildNav(); syncBadges();
    megaBtn = $('#megaBtn'); megaEl = $('#mega');
    $('#lightboxImg').removeAttribute('src');
    megaBtn.addEventListener('click', function (e) { e.stopPropagation(); setMega(megaBtn.getAttribute('aria-expanded') !== 'true'); });
    var megaWrap = $('.nav__item--mega'), hoverT;
    if (window.matchMedia('(hover: hover)').matches) {
      megaWrap.addEventListener('mouseenter', function () { clearTimeout(hoverT); setMega(true); });
      megaWrap.addEventListener('mouseleave', function () { hoverT = setTimeout(function () { setMega(false); }, 180); });
    }
    megaEl.addEventListener('click', function (e) { if (e.target.closest('a')) setMega(false); });

    $('#searchChips').innerHTML = ['Juicy Couture', 'Steve Madden', 'Tommy Hilfiger', 'Рюкзак', 'Шопер', 'Дуті', 'Гаманець', 'Новинки'].map(function (c) { return '<button class="chip" type="button" data-q="' + c + '">' + c + '</button>'; }).join('');
    var si = $('#searchInput');
    si.addEventListener('input', function () { searchRun(si.value); });
    si.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var r = searchRun(si.value); if (r.length) { closeDrawer(true); location.hash = '#product/' + r[0].id; } }
    });
    $('#searchChips').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) { si.value = b.dataset.q; searchRun(si.value); si.focus(); } });
    $('#searchResults').addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(true); });
    $('#mobileNav').addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(true); });

    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); openDrawer(o.dataset.open, o); return; }
      if (e.target.closest('[data-close]') && openDrawerEl && openDrawerEl.contains(e.target)) { closeDrawer(); return; }
      var fb = e.target.closest('[data-fav]');
      if (fb) { e.preventDefault(); toggleFav(fb.dataset.fav); return; }
      if (megaEl && !megaEl.hidden && !e.target.closest('.nav__item--mega')) setMega(false);
      var sk = e.target.closest('.skip');
      if (sk) { e.preventDefault(); $('#main').focus(); }
    });
    var lb = $('#lightbox');
    lb.addEventListener('click', function (e) {
      if (e.target.closest('.lightbox__prev')) lbStep(-1);
      else if (e.target.closest('.lightbox__next')) lbStep(1);
      else if (e.target.closest('[data-close]') || e.target === lb) closeLightbox();
    });
    var lsx = null;
    lb.addEventListener('touchstart', function (e) { lsx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (lsx == null) return; var dx = e.changedTouches[0].clientX - lsx; if (Math.abs(dx) > 40) lbStep(dx < 0 ? 1 : -1); lsx = null; }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (!lb.hidden) {
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') lbStep(-1);
        else if (e.key === 'ArrowRight') lbStep(1);
        else if (e.key === 'Tab') trapFocus(e, lb);
        return;
      }
      if (openDrawerEl) {
        if (e.key === 'Escape') closeDrawer();
        else if (e.key === 'Tab') trapFocus(e, openDrawerEl);
        return;
      }
      if (e.key === 'Escape' && megaEl && !megaEl.hidden) { setMega(false); megaBtn.focus(); }
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openDrawer('searchDrawer'); }
    });
    window.addEventListener('hashchange', function () { if (openDrawerEl) closeDrawer(true); render(); });
    window.addEventListener('storage', function (e) {
      if (e.key === 'florida_cart') cart = load('florida_cart', []).filter(function (l) { return byId(l.id); });
      if (e.key === 'florida_favs') favs = load('florida_favs', []).filter(byId);
      syncBadges();
    });
    render();
  }
  init();
})();
