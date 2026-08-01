# TanStack Query 컨벤션

## 목적

서버 상태는 TanStack Query로 관리하고, 키 네이밍·staleTime·retry·캐시 무효화 규칙을 통일한다.

## Query Client

- 기본 `staleTime`은 `1분`으로 둔다.
- 조회 쿼리 `retry`는 `1회`로 둔다.
- 변경 요청 `retry`는 `0회`로 둔다.
- 공통 인스턴스는 `src/lib/queryClient.ts`의 `queryClient`를 사용한다.

## Query Key 네이밍

- Query Key는 배열만 사용한다.
- 첫 요소는 앱 범위 식별자인 `app`으로 둔다.
- 두 번째 요소는 도메인 이름을 복수형으로 둔다.
- 목록은 `list`, 상세는 `detail`을 사용한다.
- 상세 키는 마지막에 식별자를 둔다.

```ts
queryKeys.places.lists();
queryKeys.places.detail(placeId);
queryKeys.plans.detail(planId);
```

## 캐시 무효화

- 생성, 수정, 삭제 후에는 해당 도메인의 목록 키를 무효화한다.
- 상세 데이터가 변경되면 해당 상세 키를 무효화한다.
- 여러 화면에 영향을 주는 변경은 도메인 루트 키를 무효화한다.

```ts
queryClient.invalidateQueries({ queryKey: queryKeys.places.lists() });
queryClient.invalidateQueries({ queryKey: queryKeys.places.detail(placeId) });
queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });
```
