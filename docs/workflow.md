WF-DEV-01 · Dev Build 개발 환경 고정
- Expo Go 의존 제거
- iOS/Android dev build 실행 방법 정리
- 실서버 API base URL 고정
- mock adapter 비활성화

WF-DEV-02 · 인증 / 세션 안정화
- 테스트 토큰 또는 실제 소셜 로그인 기준 정리
- SecureStore 토큰 저장/초기화
- 401 refresh 실패 시 로그아웃 처리
- 앱 재실행 시 세션 복구 검증

WF-DEV-03 · 공유 시트 / URL 수신
- iOS Share Extension / Android Intent 등록
- 유튜브/인스타/브라우저 공유에서 앱 진입
- S-03 또는 내부 handler에서 URL 수신
- POST /source-links 호출

WF-DEV-04 · 장소 추출 Job 상태 관리
- pending / processing / done / failed 상태 처리
- 앱 실행 중 polling
- 결과 도착 시 후보 store/query 반영
- S-04 진입 알림/배지 처리

WF-DEV-05 · 백그라운드 Fetch / Push Notification
- 앱이 꺼져 있거나 백그라운드일 때 Job 상태 확인
- 완료 시 push/local notification
- 알림 클릭 시 S-04 진입

WF-DEV-06 · 지도 SDK
- 지도 provider 정책 확정
- Kakao/Google SDK 키 관리
- S-05 장소 상세 지도 표시
- 외부 지도 열기 fallback 유지

WF-DEV-07 · 플랜 마켓 고도화
- 요구사항 재정의
- 구매/복사/크레딧/광고 정책 확정
- API 계약 정리
- 실제 UI/상호작용 구현

WF-DEV-08 · 개발자 문서화
- 실행 방법
- env 설정
- dev build 생성
- 주요 기능 디버깅 방법
- API/네이티브 기능 체크리스트

WF-DEV-09 · UI/UX 리팩토링
- 공통 컴포넌트 정리
- SafeArea/헤더/탭/로딩/빈 상태 통일
- 화면별 디테일 정리