# Feature Guide

`src/features`는 도메인별 화면 가공 로직을 둔다. 화면 파일이 비대해질 때 가장 먼저 분리할 위치다.

## 현재 도메인

- `auth`: Google/Kakao login 호출과 social login API 연결
- `places`: 장소 카드/후보/상세 view model
- `plans`: 플랜 목록/상세 view model, schedule drag-and-drop model

## 분리 기준

아래 중 하나에 해당하면 feature로 옮긴다.

- API response를 화면 표시용 label/state로 바꾸는 코드
- route와 무관한 순수 계산 로직
- 여러 화면에서 같은 도메인 데이터를 같은 방식으로 보여주는 코드
- 테스트 가능한 비즈니스 규칙

## 예시

- `plans/scheduleModel.ts`: S-07 row 생성, day/sort_order 계산, 저장 patch 생성
- `places/viewModel.ts`: place/candidate API 응답을 카드와 상세 화면용 모델로 변환

화면 이동, Alert, router, component state는 가능한 `app/` 화면 파일에 남긴다.
