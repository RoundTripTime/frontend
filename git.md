# Git 컨벤션

## Branch Strategy

현재 프로젝트는 기능별 브랜치를 오래 유지하지 않는다. 다음 테스트 앱 버전을 하나의 브랜치에서 관리하고, 안정화되면 `main`에 병합한다.

### `main`

- 항상 팀원이 실행 가능한 안정 버전이다.
- Play Store 내부 테스트 또는 시연에 올릴 수 있는 기준 브랜치다.
- 직접 push하지 않는다.
- 다음 테스트 앱 브랜치가 안정화되면 Pull Request로 병합한다.

### `test-app/x.y.z`

- 다음 테스트 앱 버전을 준비하는 작업 브랜치다.
- 예: `test-app/0.2.0`
- 기능, 버그 수정, 리팩토링, UI 수정, 문서 수정은 이 브랜치에 함께 커밋한다.
- 개발 중간 체크포인트가 필요하면 이 브랜치에 작고 자주 커밋한다.
- 테스트 앱이 안정화되면 `main`으로 PR을 만들고 squash merge한다.
- merge 후 브랜치는 삭제한다.

### Branch Lifecycle

1. 최신 `main`에서 다음 테스트 앱 브랜치를 만든다.

```bash
git switch main
git pull --ff-only origin main
git switch -c test-app/0.2.0
git push -u origin test-app/0.2.0
```

2. 모든 작업은 해당 `test-app/x.y.z` 브랜치에 커밋한다.
3. 중간중간 원격에 push해서 체크포인트를 남긴다.
4. QA 또는 팀 테스트가 가능한 상태가 되면 PR을 생성한다.
5. `main`에 squash merge한다.
6. merge된 테스트 앱 브랜치는 로컬/원격 모두 삭제한다.

## Versioning

- 앱 버전은 `MAJOR.MINOR.PATCH` 형식으로 관리한다.
  - `PATCH`: 작은 UI 수정, 버그 수정, 문구 수정
  - `MINOR`: 화면/기능/API 흐름 추가
  - `MAJOR`: 큰 앱 구조 변경 또는 호환성 깨지는 변경
- Android `versionCode` / iOS build number는 스토어에 업로드할 때마다 증가시킨다.
- 버전이 확정되어 `main`에 병합되면 tag를 남긴다.

```text
v0.1.0
v0.2.0
```

- 테스트 후보를 구분해야 하면 rc tag를 사용할 수 있다.

```text
v0.2.0-rc.1
v0.2.0-rc.2
```

## Release Flow

1. `test-app/x.y.z`에서 작업한다.
2. 필요한 중간 체크포인트를 커밋/push한다.
3. 테스트 앱 빌드 전 검증한다.
   - `npm run typecheck`
   - 변경 파일 대상 format/lint
   - Android/iOS smoke test
4. EAS 또는 Play Store 내부 테스트 빌드를 만든다.
5. 안정화되면 `test-app/x.y.z` → `main` PR을 만든다.
6. squash merge한다.
7. merge된 `main` 커밋에 버전 tag를 생성한다.
8. `test-app/x.y.z` 브랜치를 삭제한다.

스토어에 업로드하는 빌드는 반드시 커밋된 소스에서 만든다. uncommitted local changes 상태에서 빌드하지 않는다.

## Commit Messages

커밋 메시지는 짧고 이해 가능하게 작성한다. Conventional Commit을 권장하지만, 테스트 앱 브랜치에서는 과도하게 타입을 나누지 않는다.

권장 형식:

```text
type: summary
```

주로 사용하는 type:

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 구조 개선
- `docs`: 문서 수정
- `build`: 버전, EAS, 앱 빌드 설정
- `chore`: 기타 관리 작업

예시:

```text
feat: add share intent receiver
fix: persist kakao login session
refactor: simplify place thumbnail fallback
build: bump android version code
docs: update test app workflow
```

## Pull Requests

- `test-app/x.y.z`에서 `main`으로 PR을 만든다.
- PR에는 테스트 앱에서 바뀐 주요 기능과 검증 결과를 적는다.
- UI 변경이 크면 스크린샷 또는 짧은 녹화를 첨부한다.
- 기본 merge 방식은 squash merge다.
- merge 후 브랜치를 삭제한다.
