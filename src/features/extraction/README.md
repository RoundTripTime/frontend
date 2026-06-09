# Extraction Job Tracking

URL 공유 후 장소 후보가 도착할 때까지 추적하는 클라이언트 측 보조 레이어다.

## Current Flow

1. S-03에서 `POST /source-links`로 URL을 제출한다.
2. 응답의 `job_id`를 `SecureStore`와 Zustand에 active job으로 저장한다.
3. 앱이 foreground에 있으면 `ExtractionJobWatcher`가 `GET /jobs/{jobId}/candidates`를 polling한다.
4. 앱이 background에 있으면 `expo-background-task`가 OS 허용 주기에 따라 같은 후보 조회를 시도한다.
5. 후보 조회 결과가 완료 상태이면 `expo-notifications` local notification을 띄운다.
6. 알림을 누르면 S-04(`/places/recent`)로 이동한다.

## Temporary Client Responsibility

현재 구현은 서버 push notification이 아직 없어서 프론트가 분석 완료 여부를 직접 확인한다.
아래 파일들은 서버 push가 도입되면 수정 또는 제거될 가능성이 높다.

- `ExtractionJobWatcher.tsx`: foreground polling 및 local notification 표시.
- `backgroundTask.ts`: background polling task 등록.
- `pollActiveExtractionJob.ts`: background task에서 후보 상태를 직접 조회.
- `activeExtractionJobStorage.ts`: polling 재개를 위한 active job 로컬 저장.
- `notifications.ts`: 서버 push 전까지 사용하는 local notification.

## Target Flow

서버가 장소 추출 완료 시점에 push notification을 발송하는 구조로 전환한다.

1. S-03에서 URL을 제출하고 `job_id`만 저장한다.
2. 서버가 Supadata/GPT 파이프라인을 완료한다.
3. 서버가 사용자 디바이스로 push notification을 보낸다.
4. 앱은 push payload의 `job_id` 또는 route 정보를 바탕으로 S-04를 연다.
5. S-04 진입 시 후보 목록을 한 번 조회한다.

이 전환이 완료되면 앱의 주기적 background polling은 fallback/debug 용도로만 남기거나 제거한다.
