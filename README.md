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

## Android Device Install Without EAS Queue

Use this path when you want to install the app directly to a physical Android device over USB-C instead of waiting for an EAS cloud build queue.

### 1. Prepare the device

1. Enable **Developer options** on the Android device.
2. Enable **USB debugging**.
3. Connect the device to the computer with a USB-C cable.
4. Accept the USB debugging prompt on the device.
5. Check that the device is visible:

```bash
adb devices
```

The device should appear as `device`, not `unauthorized`.

### 2. Install the dev build locally

```bash
nvm use
npm install
npx expo run:android
```

`npx expo run:android` creates or updates the native Android project locally, builds a debug APK, installs it to the connected device, and starts the app.

If Metro is not running after install, start it separately:

```bash
npm run start:dev
```

### 3. Console setup for native auth

Google OAuth and Kakao native login validate the installed app by package name plus the signing key used for that APK. A local USB install usually uses the Android debug keystore, so register the debug credentials in each console.

Android package name:

```text
com.roundtriptime.roundtrip
```

Debug SHA-1 for Google OAuth:

```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android
```

Register that SHA-1 in the Google Cloud Android OAuth client with package name `com.roundtriptime.roundtrip`.

Kakao key hash is also signing-key dependent. Generate/register the debug key hash in Kakao Developers for the same package name before testing Kakao native login.

### 4. Kakao WebView map setup

The current S-05 place detail map renders Kakao Maps through `react-native-webview` and the Kakao JavaScript SDK. It uses:

```text
EXPO_PUBLIC_KAKAO_JS_KEY
```

This WebView map path does **not** use Kakao Maps Native SDK. Developers do not need to register their personal Android debug key hash just to render the WebView map.

For the WebView map, the Kakao Developers application must have:

1. A valid **JavaScript key**.
2. **Web platform** enabled.
3. `file://` registered in **Web platform → Site domain**, because the current Android map HTML is loaded from `file:///android_asset/kakao-place-map.html`.

Each developer only needs to copy the shared JavaScript key into their local `.env`:

```bash
EXPO_PUBLIC_KAKAO_JS_KEY=...
```

No per-developer Kakao map key hash is required while the map stays on the WebView / JavaScript SDK path. If the map area is blank on device, verify the JavaScript key, `file://` site domain registration, and device network access.

Kakao native login is separate from the WebView map. Testing Kakao native login still requires the developer's Android debug key hash from step 3.

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
