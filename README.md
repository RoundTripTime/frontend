# RoundTrip Frontend

React Native (Expo) frontend for the RoundTrip travel planning app.

## Stack

- React Native 0.81 · Expo SDK 54 · TypeScript 5.9
- Expo Router (file-based) · Zustand · TanStack Query · Axios

## Prerequisites

- Node 20.19.4 (see `.nvmrc` — `nvm use` to activate)
- npm 10.x (bundled with Node 20.19.4)
- Xcode (iOS) / Android Studio (Android) — only for Simulator / Emulator
- EAS CLI (`npm install -g eas-cli`) — required for development builds

## Setup

```bash
nvm use
npm install
cp .env.example .env   # fill in keys as needed
```

For development context, read [DEVELOPMENT.md](DEVELOPMENT.md) first.

This project uses **EAS development builds** as the standard development environment. Expo Go is not sufficient for native login, share intent, push notification, or background fetch.

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
npm run start:dev
```

## Commands

| Command                | Purpose                         |
| ---------------------- | ------------------------------- |
| `npm start`            | Metro bundler                   |
| `npm run start:dev`    | Metro for EAS development build |
| `npm run ios`          | Open iOS Simulator              |
| `npm run android`      | Open Android Emulator           |
| `npm run lint`         | ESLint                          |
| `npm run lint:fix`     | ESLint with auto-fix            |
| `npm run format`       | Prettier write                  |
| `npm run format:check` | Prettier check (CI)             |
| `npm run typecheck`    | TypeScript --noEmit             |

## Git

See [Git conventions](git.md).

## Pre-commit Hooks

Husky + lint-staged automatically run on every commit:

- TS/JS files → `eslint --fix` + `prettier --write`
- JSON / Markdown / YAML → `prettier --write`

If a hook fails, the commit is aborted. Fix the issue and stage again.

## Supported Platforms

iOS 15.1+ · Android 7.0+ (API 24) · target API 35.
iPhone / Android handsets only (iPad / tablet not supported in MVP).
