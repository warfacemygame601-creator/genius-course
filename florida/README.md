# FLORIDA | brand bags — інтернет-магазин

Статичний сайт без фреймворків: `index.html` + `css/style.css` + `js/products.js` (дані) + `js/app.js` (логіка) + `img/`.
Його можна залити на будь-який хостинг (Netlify, GitHub Pages, звичайний хостинг): скопіюйте всю папку `florida/`.
Для перегляду локально: `python3 -m http.server` у цій папці й відкрийте http://localhost:8000.

Сторінки працюють через `#hash`, тож будь-яким розділом можна поділитися посиланням:
`#catalog`, `#new`, `#bags`, `#bags-shoppers`, `#backpacks-city`, `#wallets`, `#brands`, `#brand/juicy-couture`,
`#product/sm-croc-wallet`, `#product/sm-croc-wallet/1` (другий колір), `#cart`, `#favorites`, `#about`, `#delivery`, `#contacts`.

## Як додати новий товар

1. Підготуйте 3–5 фото, вертикальних **4:5** (наприклад, 1000×1250 px), JPEG до 150 КБ.
   Перше фото — товар спереду **на чистому білому фоні**, далі: збоку, ззаду, деталь фурнітури/логотипа, всередині або на моделі.
2. Назвіть файли `img/<id>-1.jpg`, `img/<id>-2.jpg` … (`<id>` — латиницею, без пробілів, наприклад `guess-logo-tote`).
3. Відкрийте `js/products.js` і додайте об'єкт у масив `PRODUCTS` (найпростіше — скопіювати сусідній):

```js
{ id: 'guess-logo-tote', code: 'FL-127', brand: 'GUESS', category: 'bags', subcategory: 'totes',
  name: 'Тоут з монограмою', color: 'коричневий', colorFamily: 'brown', isNew: true,
  description: 'Тоут з монограмою G і золотистою табличкою з логотипом. Дві ручки.',
  images: imgs('guess-logo-tote', 4) },   // 4 = скільки фото <id>-1…-4.jpg
```

- `brand` — точно як у списку `BRANDS` (бренд без товарів сам з'явиться у «Брендах», щойно додасте товар).
- `category` / `subcategory` — slug із `CATEGORIES` (`bags`/`shoppers`, `totes`, `handles`, `shoulder`, `puffy`, `bucket`; `backpacks`/`city`, `sport`; `wallets`; `accessories`/`watches`, `hats`; `shoes`/`sneakers`, `home`; `gifts`/`certificates`). Для гаманців `subcategory: ''`.
- `colorFamily` — ключ із `COLORS` (black, graphite, white, beige, brown, burgundy, pink, blue, green, silver, yellow) — потрібен для фільтра.
- `isNew: true` — товар потрапить у «Новинки» й отримає жовтий бейдж.
- Кілька кольорів: додайте `variants` — кожен колір зі своїми фото (приклад — `sm-croc-wallet`):

```js
variants: [
  { color: 'шоколадний', colorFamily: 'brown', images: imgs('sm-croc-wallet', 2) },
  { color: 'чорний',     colorFamily: 'black', images: imgs('sm-croc-wallet-black', 2) }
]
```

4. Збережіть файл і оновіть сторінку. Кількість товарів у категоріях, брендах і фільтрах рахується автоматично.

Ціни на сайті не вказуються навмисно — скрізь «Ціна за запитом», заявка з кошика формує текст для Instagram Direct.

## Вирізки для героя та плиток категорій

Файли `img/<id>-cut.webp` — товар на прозорому фоні. Їх використовують герой (`th-monogram-tote`, `jc-bucket-backpack`, `aldo-quilted-shopper`)
і плитки категорій (поле `img` у `CATEGORIES`). Для нового товару вирізку можна зробити в будь-якому сервісі видалення фону;
розмір вирізки додайте в об'єкт `CUT` на початку `js/app.js` (ширина, висота), щоб не було зсуву макета.

## Що звірити з власником

- Сторінка «Доставка й оплата» та акордеон у товарі — **зразок умов**, позначено на сайті.
- Бренди GUESS, DKNY і bebe є в асортименті, але товарів на сайті ще немає — показані як «Також у магазинах».
- Список фото, яких бракує, — у файлі `PHOTOS.md`.
