# 네이밍 컨벤션

## 목적

파일, 컴포넌트, 훅, 타입 이름의 표기법을 통일한다.

## 파일

- 일반 TypeScript 파일은 `camelCase.ts`를 사용한다.
- React 컴포넌트 파일은 `PascalCase.tsx`를 사용한다.
- 훅 파일은 `useName.ts`를 사용한다.
- 템플릿이나 내부 기준 파일은 `_template.ts`처럼 앞에 `_`를 붙일 수 있다.

## 컴포넌트

- 컴포넌트 이름은 `PascalCase`를 사용한다.
- Screen 컴포넌트는 화면명을 기준으로 `HomeScreen`, `PlanDetailScreen`처럼 작성한다.
- Container 컴포넌트는 대상 뒤에 `Container`를 붙인다.
- Presentational 컴포넌트는 UI 역할이 드러나는 이름을 사용한다.

## 훅

- 훅 이름은 `use`로 시작하는 `camelCase`를 사용한다.
- 서버 상태 조회 훅은 `usePlaces`, `usePlaceDetail`처럼 데이터 대상을 드러낸다.
- 동작을 묶는 훅은 `useCreatePlan`, `useAcceptPlaceCandidate`처럼 액션을 드러낸다.

## 타입

- 타입 이름은 `PascalCase`를 사용한다.
- props 타입은 컴포넌트 이름 뒤에 `Props`를 붙인다.
- 상태 타입은 대상 뒤에 `State`를 붙인다.
- 액션 타입은 대상 뒤에 `Actions`를 붙인다.

```ts
type PlaceCardProps = {};
type PlanEditorState = {};
type PlanEditorActions = {};
```
