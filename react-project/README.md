[![CI/CD Pipeline](https://github.com/snizhanavovkpp2023-max/my-film_project/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/snizhanavovkpp2023-max/my-film_project/actions/workflows/ci-cd.yml)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Cinefy 
React + Vite проєкт для перегляду фільмів з використанням TMDB API, системою авторизації та списком обраного.

## Що зроблено:

- ## Система авторизації (Login Page)
 - Сторінка входу з повною валідацією полів
 - Перевірка наявності логіна.
 - Валідація формату Email (через regex).
 - Перевірка довжини пароля (мін. 4 символи).
 - Реалізовано перенаправлення (Maps) на головну після успішного входу.

- ## Головна сторінка (Home + API)
 - Компонент, що взаємодіє із зовнішнім сервісом TMDB:
 - Автоматичне завантаження "Popular Movies" при старті.
 - Функціональний пошук фільмів за ключовим словом.
 - Обробка станів завантаження (loading) та помилок (error).

- ## Список "Обраного" (Favorites)
 - Можна натиснути на "серце" на будь-якій картці фільму.
 - Фільм автоматично додається у твій особистий список.
 - Збереження: Навіть якщо оновити сторінку, список не зникне (використовується localStorage).

 - ## MovieCard
  Універсальна картка з постером, датою релізу та інтерактивною кнопкою.

 - ## NavBar
  Навігація, яка відображається лише для авторизованих користувачів.


 ## Запуск проєкту
 ## Встановлення залежностей:
 - npm install

 ## Запуск у режимі розробки:
 - npm run dev
 
 ## Збірка проєкту:
 - npm run build