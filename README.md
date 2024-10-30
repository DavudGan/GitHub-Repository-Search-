# GitHub-Repository-Search
Данный мини проект реализован для стажировки ВКонтакте.

## Используемые технологии

В проекте использованы следующие технологии:

- **React** — библиотека для создания пользовательских интерфейсов.
- **Vite** — для сборки.
- **TypeScript** — типизация.
- **MobX** — библиотека для управления состоянием.
- **Material-UI (MUI)** — набор компонентов.
- **Jest** — для создания модульных тестов.
- **React Testing Library** — библиотека для тестирования React-компонентов.

## Почему Material-UI (MUI)?

- **Единый стиль**.
- **Экономия времени и ресурсов**.
- **Высокий уровень кастомизации**.
- **Поддержка адаптивного дизайна**.
- **Xорошая документация**.
- **Поддержка TypeScript**.

## Как запустит проект:
- Создай `.env` файл с переменной `VITE_REACT_APP_GITHUB_TOKEN = 'GitGub_Token'` (сгенерируй свой токен https://github.com/settings/tokens и вставь вместо `GitGub_Token`)
- `npm i`
- `npm run dev`

## Запускаем тесты: 
Для запуска тестов нужно в файле `RepositoryStore.ts` изменит переменную `const GITHUB_TOKEN = import.meta.env.VITE_REACT_APP_GITHUB_TOKEN`:

```js
import { makeAutoObservable, runInAction } from "mobx";

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = 'import.meta.env.VITE_REACT_APP_GITHUB_TOKEN';//Это поможет избавиться от ошибки с import.meta.

interface LicenseInfo {
  name: string | null;
}

interface PrimaryLanguage {
  name: string | null;
}
//Код...
```
Запускаем тест: `npm test`

