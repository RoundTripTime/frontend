# Git 컨벤션

## Branch Strategy

- `main` is protected and always represents the latest team-testable app state.
- Direct pushes to `main` are not allowed.
- All changes go through Pull Requests targeting `main`.
- Create short-lived branches from the latest `main`.
- Branch names use one of these prefixes:
  - `feat/` for new features
  - `fix/` for bug fixes
  - `docs/` for documentation
  - `chore/` for tooling, config, and maintenance
  - `refactor/` for code restructuring without intended behavior changes
  - `release/` for release preparation only
- Workflow setup, design pattern, and code convention changes use `chore/`.
- Delete merged branches after merge. Do not keep old workflow branches as active development bases.
- If a branch lives for more than a few days, rebase or merge the latest `main` before requesting review.
- Required for merge:
  - Lint / Typecheck / Format pass
  - At least 1 review approval
  - Branch up to date with `main`

## Versioning

- Use semantic app versions: `MAJOR.MINOR.PATCH`.
  - `PATCH`: bug fixes, small UI fixes, copy changes
  - `MINOR`: user-visible features, new screens, API workflow additions
  - `MAJOR`: breaking app/API behavior or large navigation/product changes
- Android `versionCode` / iOS build number must increase for every uploaded store build.
- App version changes are made in the Expo app config and committed through a `release/` branch.
- Tag every uploaded internal-test or production candidate after the build source is merged:

```text
v0.1.0
v0.1.1
```

- If a build is only for quick local/dev-build verification and is not uploaded for team testing, a tag is not required.

## Release Flow

1. Merge feature/fix/refactor PRs into `main`.
2. Create `release/x.y.z` from `main`.
3. Update app version/build metadata.
4. Run verification:
   - `npm run typecheck`
   - format/lint command if the touched files require it
   - Android/iOS smoke test for native features affected by the release
5. Build with the target EAS profile.
6. Upload to the intended track, usually Google Play internal testing first.
7. Tag the exact commit used for the uploaded build.
8. Merge the `release/` PR into `main`.

Do not upload store builds from uncommitted local changes.

## Commit Messages

Use short Conventional Commit style messages:

```text
type: summary
```

Allowed types:

- `feat`: user-facing feature
- `fix`: bug fix
- `docs`: documentation only
- `chore`: tooling, config, dependency, or maintenance change
- `refactor`: code structure change without behavior change
- `test`: test-only change
- `build`: app build, version, or release metadata
- `ci`: CI/CD configuration

Examples:

```text
feat: add plan editor screen
fix: handle empty place list
docs: add query conventions
chore: configure import order lint
build: bump android version code
```

## Pull Requests

- Keep PRs focused on one workflow or one small change set.
- Fill out the PR template before requesting review.
- Mention commands run in the PR description.
- Use squash merge by default.
- Before opening a PR, check `git status` and avoid including unrelated local changes.
- Include screenshots or short screen recordings for UI changes when practical.
