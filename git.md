# Git 컨벤션

## Branch Strategy

- `main` is protected. Direct pushes are not allowed.
- All changes go through Pull Requests targeting `main`.
- Branch names use one of these prefixes:
  - `feat/` for new features
  - `fix/` for bug fixes
  - `docs/` for documentation
  - `chore/` for tooling, config, and maintenance
- Workflow setup, design pattern, and code convention changes use `chore/`.
- Required for merge:
  - Lint / Typecheck / Format pass
  - At least 1 review approval
  - Branch up to date with `main`
- GitHub branch protection rules to be configured after the first push.

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

Examples:

```text
feat: add plan editor screen
fix: handle empty place list
docs: add query conventions
chore: configure import order lint
```

## Pull Requests

- Keep PRs focused on one workflow or one small change set.
- Fill out the PR template before requesting review.
- Mention commands run in the PR description.
- Use squash merge by default.
