/* =========================================================================
   FLORIDA | brand bags — дані магазину
   -------------------------------------------------------------------------
   Щоб додати товар: скопіюйте будь-який об'єкт у масиві PRODUCTS,
   змініть id (латиницею, без пробілів), code (наступний FL-1xx) і решту полів.
   Фото кладіть у папку img/ з назвами <id>-1.jpg, <id>-2.jpg …
   Перше фото — головне (на білому фоні), друге показується при наведенні.
   Продано: додайте sold: true — товар лишиться на сайті з позначкою «Продано».
   Розміри (взуття): sizes: ['37', '38'] — покупець обере розмір перед додаванням у кошик.
   Детальна інструкція — у файлі README.md.

   Джерело всіх фото нижче: власні публікації магазину в Instagram
   @brand_bags213 (вирізані з наданих скриншотів профілю). Фото з -1.jpg,
   позначені cut: true, — товар вирізано й поставлено на білий фон;
   решта — оригінальні кадри магазину. Офіційні фото брендів не
   використовувались: точні артикули моделей невідомі.
   ========================================================================= */

window.FLORIDA = (function () {
  'use strict';

  var CATEGORIES = [
    { slug: 'bags', name: 'Сумки', img: 'img/aldo-quilted-shopper-cut.webp', subs: [
      { slug: 'shoppers', name: 'Шопери' },
      { slug: 'totes', name: 'Тоути' },
      { slug: 'handles', name: 'З ручками' },
      { slug: 'shoulder', name: 'На плече' },
      { slug: 'puffy', name: 'Дуті' },
      { slug: 'bucket', name: 'Торби' }
    ] },
    { slug: 'backpacks', name: 'Рюкзаки', img: 'img/sm-suede-backpack-cut.webp', subs: [
      { slug: 'city', name: 'Міські' },
      { slug: 'sport', name: 'Спортивні' }
    ] },
    { slug: 'wallets', name: 'Гаманці', img: 'img/sm-croc-wallet-cut.webp', subs: [] },
    { slug: 'accessories', name: 'Аксесуари', img: 'img/jc-watch-set-cut.webp', subs: [
      { slug: 'watches', name: 'Годинники' },
      { slug: 'hats', name: 'Головні убори' }
    ] },
    { slug: 'shoes', name: 'Взуття', img: 'img/rb-sneakers-cut.webp', subs: [
      { slug: 'sneakers', name: 'Кросівки' },
      { slug: 'home', name: 'Домашнє взуття' }
    ] },
    { slug: 'gifts', name: 'Подарунки', img: 'img/gift-certificate-1.jpg', subs: [
      { slug: 'certificates', name: 'Сертифікати' }
    ] }
  ];

  /* Бренди в асортименті. about — короткий опис стилю для сторінки «Бренди». */
  var BRANDS = [
    { slug: 'tommy-hilfiger', name: 'Tommy Hilfiger', about: 'Американська класика: монограма TH, стримані кольори, практичні форми.' },
    { slug: 'juicy-couture', name: 'Juicy Couture', about: 'Грайливий гламур: велюр, тиснені монограми, золотисті підвіси-серця.' },
    { slug: 'steve-madden', name: 'Steve Madden', about: 'Сміливі деталі й великі логотипи для міста на кожен день.' },
    { slug: 'aldo', name: 'ALDO', about: 'Сучасні силуети, стьобані фактури та акуратна фурнітура.' },
    { slug: 'nautica', name: 'Nautica', about: 'Морська естетика: щільні тканини, коньячні ручки, чисті лінії.' },
    { slug: 'michael-kors', name: 'Michael Kors', about: 'Впізнавана монограма MK і стриманий нью-йоркський шик.' },
    { slug: 'karl-lagerfeld', name: 'Karl Lagerfeld', about: 'Чорно-білий паризький стиль з іронією — Карл і кішка Шупетт.' },
    { slug: 'guess', name: 'GUESS', about: 'Лос-анджелеський гламур, монограма G і золотиста фурнітура.' },
    { slug: 'dkny', name: 'DKNY', about: 'Міський мінімалізм Нью-Йорка, монограмні полотна.' },
    { slug: 'reebok', name: 'Reebok', about: 'Спортивний комфорт: дуті сумки, м\'які тканини, кросівки.' },
    { slug: 'puma', name: 'PUMA', about: 'Спортивні лінії та м\'які дуті форми на кожен день.' },
    { slug: 'adidas', name: 'adidas', about: 'Функціональні рюкзаки з продуманими кишенями.' },
    { slug: 'wrangler', name: 'Wrangler', about: 'Вестерн-настрій: орнаменти, медальйони, натуральні відтінки.' },
    { slug: 'nine-west', name: 'Nine West', about: 'Жіночна класика з декоративними поясами та пряжками.' },
    { slug: 'bebe', name: 'bebe', about: 'Сяйливі аксесуари й годинники у подарункових наборах.' },
    { slug: 'florida', name: 'FLORIDA', about: 'Подарункові сертифікати нашого магазину.' }
  ];

  /* Кольори для фільтра (кружечки). */
  var COLORS = {
    black:    { name: 'Чорний',     hex: '#141414' },
    graphite: { name: 'Графіт',     hex: '#4A4A4A' },
    white:    { name: 'Молочний',   hex: '#F3EDE1' },
    beige:    { name: 'Бежевий',    hex: '#D8C29E' },
    brown:    { name: 'Коричневий', hex: '#6B4A35' },
    burgundy: { name: 'Бордо',      hex: '#6E1F2E' },
    pink:     { name: 'Рожевий',    hex: '#E8B9C0' },
    blue:     { name: 'Синій',      hex: '#1F2A44' },
    green:    { name: "М'ятний",    hex: '#BFDCCB' },
    silver:   { name: 'Срібло',     hex: '#C9C9C9' },
    yellow:   { name: 'Жовтий',     hex: '#F5D21F' }
  };

  function imgs(id, n) {
    var a = [];
    for (var i = 1; i <= n; i++) a.push('img/' + id + '-' + i + '.jpg');
    return a;
  }

  var PRODUCTS = [
    { id: 'jc-bucket-backpack', code: 'FL-101', brand: 'Juicy Couture', category: 'backpacks', subcategory: 'city',
      name: 'Рюкзак-торба з тисненою монограмою', color: 'молочний', colorFamily: 'white', isNew: true,
      description: 'Рюкзак-торба молочного кольору з тисненою монограмою по всій поверхні. Затягується шнурком, спереду — золотиста застібка з логотипом і підвіс-серце.',
      images: imgs('jc-bucket-backpack', 2) },

    { id: 'jc-heart-shopper', code: 'FL-102', brand: 'Juicy Couture', category: 'bags', subcategory: 'shoppers',
      name: 'Шопер з монограмою та підвісом-серцем', color: 'сливовий', colorFamily: 'burgundy', isNew: true,
      description: 'Шопер сливового кольору з тисненою монограмою і двома довгими ручками. На ручці — підвіс-серце та металевий брелок Juicy Couture.',
      images: imgs('jc-heart-shopper', 2) },

    { id: 'jc-chain-bucket', code: 'FL-103', brand: 'Juicy Couture', category: 'bags', subcategory: 'bucket',
      name: 'Сумка-торба з ланцюжком', color: 'бордо', colorFamily: 'burgundy', isNew: true,
      description: 'Глянцева сумка-торба кольору бордо зі збірками по верху. Масивний золотистий ланцюжок і підвіс-замочок.',
      images: imgs('jc-chain-bucket', 1) },

    { id: 'jc-velour-baguette', code: 'FL-104', brand: 'Juicy Couture', category: 'bags', subcategory: 'shoulder',
      name: 'Велюрова сумка-багет з короною', color: 'бордо', colorFamily: 'burgundy', isNew: false,
      description: 'Велюрова сумка-багет кольору бордо з вишитою короною та чорними вставками. Ремінець із ланцюжком і хутряний помпон-брелок.',
      sold: true, // ДЛЯ ДЕМО позначки «Продано» — приберіть або поставте false, якщо товар є
      images: imgs('jc-velour-baguette', 2) },

    { id: 'jc-watch-set', code: 'FL-105', brand: 'Juicy Couture', category: 'accessories', subcategory: 'watches',
      name: 'Годинник зі змінними ремінцями', color: 'срібло / рожевий', colorFamily: 'silver', isNew: false,
      description: 'Годинник із прямокутним корпусом у камінцях і рожевим циферблатом. У фірмовій коробці — металевий браслет і два змінні ремінці: рожевий і чорний.',
      images: imgs('jc-watch-set', 3) },

    { id: 'rb-puffy-tote', code: 'FL-106', brand: 'Reebok', category: 'bags', subcategory: 'puffy',
      name: 'Дутий тоут', color: 'чорний', colorFamily: 'black', isNew: true,
      description: 'Чорний дутий тоут зі стьобаної тканини з двома ручками. Фірмові бирки Reebok.',
      images: imgs('rb-puffy-tote', 3) },

    { id: 'rb-puffy-shopper', code: 'FL-107', brand: 'Reebok', category: 'bags', subcategory: 'puffy',
      name: 'Дутий шопер з леопардовою косметичкою', color: 'шоколад', colorFamily: 'brown', isNew: true,
      description: 'Шоколадний дутий шопер з м\'якими об\'ємними ручками. На ручці — леопардова косметичка-брелок.',
      images: imgs('rb-puffy-shopper', 2) },

    { id: 'rb-sneakers', code: 'FL-108', brand: 'Reebok', category: 'shoes', subcategory: 'sneakers',
      name: 'Кросівки', color: 'молочні', colorFamily: 'white', isNew: true,
      description: 'Молочні кросівки на шнурівці з багатошаровим верхом. Світла підошва з бежевим кантом.',
      // ПРИКЛАД розмірів для демо — замініть реальними наявними розмірами
      sizes: ['36', '37', '38', '39', '40'], sizeNote: 'Розмірна сітка EU. Наявність розміру підтвердимо в Direct.',
      images: imgs('rb-sneakers', 2) },

    { id: 'sm-logo-backpack', code: 'FL-109', brand: 'Steve Madden', category: 'backpacks', subcategory: 'city',
      name: 'Рюкзак з великим логотипом', color: 'графіт', colorFamily: 'graphite', isNew: true,
      description: 'Рюкзак кольору графіт з великим білим логотипом на передній кишені. Блискавки з довгими пулерами.',
      images: imgs('sm-logo-backpack', 1) },

    { id: 'sm-suede-backpack', code: 'FL-110', brand: 'Steve Madden', category: 'backpacks', subcategory: 'city',
      name: 'Замшевий рюкзак з клапаном', color: 'карамель', colorFamily: 'brown', isNew: false,
      description: 'Рюкзак з м\'якої замші-ефекту карамельного кольору. Клапан із золотистою застібкою-замком і верхня ручка.',
      images: imgs('sm-suede-backpack', 2) },

    { id: 'sm-puppy-shopper', code: 'FL-111', brand: 'Steve Madden', category: 'bags', subcategory: 'shoppers',
      name: 'Шопер з брелоком-цуценям', color: 'темно-синій', colorFamily: 'blue', isNew: false,
      description: 'Темно-синій шопер з довгими ручками. Прикрашений пухнастим брелоком-цуценям і яскравими підвісками.',
      images: imgs('sm-puppy-shopper', 1) },

    { id: 'sm-croc-wallet', code: 'FL-112', brand: 'Steve Madden', category: 'wallets', subcategory: '',
      name: 'Гаманець під крокодила', color: 'шоколадний', colorFamily: 'brown', isNew: false,
      description: 'Гаманець з тисненням під шкіру крокодила. Клапан-застібка з металевим логотипом STEVE MADDEN.',
      images: imgs('sm-croc-wallet', 2),
      variants: [
        { color: 'шоколадний', colorFamily: 'brown', images: imgs('sm-croc-wallet', 2) },
        { color: 'чорний', colorFamily: 'black', images: imgs('sm-croc-wallet-black', 2) }
      ] },

    { id: 'th-monogram-tote', code: 'FL-113', brand: 'Tommy Hilfiger', category: 'bags', subcategory: 'totes',
      name: 'Тоут з монограмою TH', color: 'коричневий / рожевий', colorFamily: 'brown', isNew: false,
      description: 'Тоут з монограмою TH у коричнево-рожевій гамі. Коричневі ручки, центральна смуга і металевий логотип.',
      images: imgs('th-monogram-tote', 3) },

    { id: 'th-travel-tote', code: 'FL-114', brand: 'Tommy Hilfiger', category: 'bags', subcategory: 'totes',
      name: 'Дорожня сумка-тоут', color: 'шоколад', colorFamily: 'brown', isNew: false,
      description: 'Місткий тоут шоколадного кольору для поїздок. Зовнішня кишеня, дві ручки та підвіс-бирка з логотипом TH.',
      images: imgs('th-travel-tote', 2) },

    { id: 'aldo-quilted-shopper', code: 'FL-115', brand: 'ALDO', category: 'bags', subcategory: 'shoppers',
      name: 'Стьобаний шопер з ланцюжками', color: 'шоколад', colorFamily: 'brown', isNew: false,
      description: 'Шопер шоколадного кольору зі стьобкою «ялинкою». Ручки з золотистими ланцюжками.',
      images: imgs('aldo-quilted-shopper', 2) },

    { id: 'aldo-bowler', code: 'FL-116', brand: 'ALDO', category: 'bags', subcategory: 'handles',
      name: 'Сумка-боулер', color: 'темний шоколад', colorFamily: 'brown', isNew: false,
      description: 'Структурна сумка-боулер темно-шоколадного кольору з двома округлими ручками. Лаконічний логотип ALDO.',
      images: imgs('aldo-bowler', 2) },

    { id: 'nautica-tote', code: 'FL-117', brand: 'Nautica', category: 'bags', subcategory: 'totes',
      name: 'Тоут з коньячними ручками', color: 'чорний', colorFamily: 'black', isNew: false,
      description: 'Чорний тоут з фактурної тканини з ручками коньячного кольору. Металевий логотип N і фірмова бирка.',
      images: imgs('nautica-tote', 2) },

    { id: 'nautica-hobo', code: 'FL-118', brand: 'Nautica', category: 'bags', subcategory: 'shoulder',
      name: 'Замшева сумка-хобо', color: 'коричневий', colorFamily: 'brown', isNew: false,
      description: 'Сумка-хобо з коричневої замші-ефекту з логотипом NAUTICA спереду. Ремінець із золотистою фурнітурою.',
      images: imgs('nautica-hobo', 2) },

    { id: 'karl-choupette-bag', code: 'FL-119', brand: 'Karl Lagerfeld', category: 'bags', subcategory: 'handles',
      name: 'Сумка з Карлом і Шупетт', color: 'чорний / беж', colorFamily: 'black', isNew: false,
      description: 'Сумка в чорно-бежеву смужку з монограмою і двома ручками. Аплікація з Карлом і кішкою Шупетт.',
      images: imgs('karl-choupette-bag', 2) },

    { id: 'karl-slippers', code: 'FL-120', brand: 'Karl Lagerfeld', category: 'shoes', subcategory: 'home',
      name: 'Домашні капці з хутром', color: 'чорні', colorFamily: 'black', isNew: false,
      description: 'Чорні домашні капці з пухнастим хутром і смужкою з логотипом KARL LAGERFELD.',
      // ПРИКЛАД розмірів для демо — замініть реальними
      sizes: ['S (36–37)', 'M (38–39)', 'L (40–41)'], sizeNote: 'Наявність розміру підтвердимо в Direct.',
      images: imgs('karl-slippers', 2) },

    { id: 'mk-cap', code: 'FL-121', brand: 'Michael Kors', category: 'accessories', subcategory: 'hats',
      name: 'Кепка з монограмою', color: 'коричнева', colorFamily: 'brown', isNew: false,
      description: 'Коричнева кепка з монограмою MK по всій поверхні та вигнутим козирком.',
      images: imgs('mk-cap', 2) },

    { id: 'puma-puffy-shopper', code: 'FL-122', brand: 'PUMA', category: 'bags', subcategory: 'puffy',
      name: 'Дутий шопер', color: 'бежевий', colorFamily: 'beige', isNew: false,
      description: 'Бежевий дутий шопер зі стьобаної тканини. Об\'ємні м\'які ручки та логотип PUMA.',
      images: imgs('puma-puffy-shopper', 2) },

    { id: 'ninewest-shopper', code: 'FL-123', brand: 'Nine West', category: 'bags', subcategory: 'shoppers',
      name: 'Шопер з декоративним поясом', color: 'шоколад', colorFamily: 'brown', isNew: false,
      description: 'Шоколадний шопер з довгими ручками. Декоративний пояс з металевими заклепками.',
      images: imgs('ninewest-shopper', 1) },

    { id: 'wrangler-aztec-tote', code: 'FL-124', brand: 'Wrangler', category: 'bags', subcategory: 'totes',
      name: 'Тоут з ацтекським орнаментом', color: 'айворі / теракота', colorFamily: 'white', isNew: false,
      description: 'Тоут кольору айворі з ацтекським орнаментом у теракотових тонах. Металеві медальйони-конхо та фірмова нашивка Wrangler.',
      images: imgs('wrangler-aztec-tote', 1) },

    { id: 'adidas-backpack', code: 'FL-125', brand: 'adidas', category: 'backpacks', subcategory: 'sport',
      name: 'Рюкзак', color: "м'ятний", colorFamily: 'green', isNew: false,
      description: 'М\'ятний рюкзак з кількома кишенями на блискавках і логотипом adidas.',
      images: imgs('adidas-backpack', 2) },

    { id: 'gift-certificate', code: 'FL-126', brand: 'FLORIDA', category: 'gifts', subcategory: 'certificates',
      name: 'Подарунковий сертифікат', color: 'жовтий', colorFamily: 'yellow', isNew: false,
      description: 'Фірмовий подарунковий сертифікат FLORIDA на обрану суму у святковому пакуванні. Номінал і умови використання уточнюйте в Direct.',
      images: imgs('gift-certificate', 1) }
  ];

  return { CATEGORIES: CATEGORIES, BRANDS: BRANDS, COLORS: COLORS, PRODUCTS: PRODUCTS };
})();
