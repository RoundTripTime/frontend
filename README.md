# RoundTrip Frontend

React Native (Expo) frontend for the RoundTrip travel planning app.

## Stack

- React Native 0.81 · Expo SDK 54 · TypeScript 5.9
- Expo Router (file-based) · Zustand · TanStack Query · Axios

## Prerequisites

- Node 20.19.4 (see `.nvmrc` — `nvm use` to activate)
- npm 10.x (bundled with Node 20.19.4)
- Xcode (iOS) / Android Studio (Android) — only for Simulator / Emulator

## Setup

```bash
nvm use
npm install
cp .env.example .env   # fill in keys as needed
```

## Commands

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `npm start`            | Metro bundler (use Expo Go for early dev) |
| `npm run ios`          | Open iOS Simulator                        |
| `npm run android`      | Open Android Emulator                     |
| `npm run lint`         | ESLint                                    |
| `npm run lint:fix`     | ESLint with auto-fix                      |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check (CI)                       |
| `npm run typecheck`    | TypeScript --noEmit                       |

## Branch Strategy

- `main` is protected. Direct pushes are not allowed.
- All changes go through Pull Requests targeting `main`.
- Required for merge:
  - ✅ Lint / Typecheck / Format pass
  - ✅ At least 1 review approval
  - ✅ Branch up to date with `main`
- GitHub branch protection rules to be configured after the first push.

## Pre-commit Hooks

Husky + lint-staged automatically run on every commit:

- TS/JS files → `eslint --fix` + `prettier --write`
- JSON / Markdown / YAML → `prettier --write`

If a hook fails, the commit is aborted. Fix the issue and stage again.

## Supported Platforms

iOS 15.1+ · Android 7.0+ (API 24) · target API 35.
iPhone / Android handsets only (iPad / tablet not supported in MVP).
