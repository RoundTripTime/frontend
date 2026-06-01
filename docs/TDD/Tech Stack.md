## 프론트엔드

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | **React Native** (Expo) | iOS/Android 단일 코드베이스 |
| 언어 | **TypeScript** |  |
| 상태관리 | **Zustand** |  |
| 서버 상태 | **TanStack Query** | 캐싱, 낙관적 업데이트 |
| 네비게이션 | **Expo Router** | 파일 기반, Deep Link 지원 |
| 지도 | **react-native-maps** |  |
| 애니메이션 | **Reanimated**  • **Gesture Handler** |  |
| HTTP 클라이언트 | **Axios** |  |
| URL 공유 수신 | **react-native-share** (iOS) · **react-native-receive-sharing-intent** (Android) | Share Sheet / Share Intent |
| 스타일 | **react-native-unistyles** | 테마, 다크모드 |
| 빌드 / 배포 | **EAS Build + EAS Submit** | App Store / Play Store 자동 배포 |

---

## 백엔드

| 구분 | 기술 | 버전 |
| --- | --- | --- |
| Language | **Java 21** (LTS) | `21` |
| Framework | **Spring Boot** | `4.0.6` |
| Security | **Spring Security**  • **JWT** | `7.0.5` |
| Persistence | **Spring Data JPA** · **Hibernate ORM** | `7.3` |
| Migration | **Flyway** | `12.5.0` |
| Async / Cache | **Redisson** · **Spring @Async** | `4.3.1` |
| Realtime | **Spring WebSocket** (STOMP) |  |
| Push | **Firebase Admin SDK** (FCM + APNs) | `9.8.0` |
| Docs | **SpringDoc OpenAPI** | `3.0.3` |
| Build | **Gradle** (Kotlin DSL) | `9.4.1` |
| Test | **JUnit 5** · **Mockito** · **Testcontainers** | `5.14.4` · `5.22.0` · `2.0.5` |

---

## 데이터베이스 & 스토리지

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 메인 DB | **PostgreSQL 16** | PostGIS (공간 쿼리), pgvector (임베딩 검색) 확장 포함 |
| 캐시 | **Redis 7** | API 캐싱, Job Queue, 분산 락 |
| 오브젝트 스토리지 | **AWS S3** | 썸네일, 임시 미디어 (TTL 적용) |

---

## 외부 API

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 영상 AI 분석 | **Supadata Extract API** | URL → 장소 JSON 추출 |
| 지도 / 장소 정규화 | **Kakao Maps API** | 한국 |
| 지도 / 장소 정규화 | **Google Maps Platform** | 해외 |
| 장소 썸네일 | **Flickr API** → **Wikimedia Commons** → **Google Places Photos** | 순서대로 폴백, 무료 우선 |
| Planning Agent LLM | **Kimi API** |  |
| 리워드 광고 | **Google AdMob** (Rewarded Video) | 광고 5회 시청 → 크레딧 1 적립. `react-native-google-mobile-ads` SDK |

### 클라우드 (AWS)

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 컴퓨팅 | **EC2 t4g.small** | 무료 트라이얼 (~2026년 12월), 2vCPU / 2GB RAM + 스왑 2GB |
| 오브젝트 스토리지 | **S3** | 썸네일 캐싱, 원본 파싱 결과 보관. 5GB/월 무료 |

### CI/CD

| 단계 | 도구 | 내용 |
| --- | --- | --- |
| CI | **GitHub Actions** | 테스트 → 정적 분석 → Docker 이미지 빌드 → EC2 SSH 배포 |
| 모바일 배포 | **EAS Build + EAS Submit** |  |
| 환경 분리 | `dev` / `prod` |  |

### 데이터 파이프라인

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 배치 처리 | **Spring Batch** | 임베딩 갱신, 썸네일 폴백 재처리 |
| 배치 스케줄 | **Spring Scheduler** |  |

### 로깅

| 항목 | 선택 | 비고 |
| --- | --- | --- |
| 메트릭 수집 | **Prometheus** | Spring Boot Actuator 엔드포인트 스크래핑 |
| 메트릭 시각화 | **Grafana** | Prometheus 연동 대시보드 |
| 인프라 메트릭 | **Amazon CloudWatch** | EC2 CPU / 메모리 / 디스크 기본 무료 |
| 에러 트래킹 | **Sentry** | 프론트 + 백엔드 |
| 로깅 | **Logback** → 파일 + **CloudWatch Logs** | 구조화 JSON 로그, 무료 티어 5GB/월 |
| 알림 | **CloudWatch Alarms** → SNS → Slack | 임계치 초과 시 자동 알림 |