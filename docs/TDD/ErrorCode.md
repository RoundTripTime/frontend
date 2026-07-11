> API 에러 응답 표준 코드 체계. API spec 전체 64개 엔드포인트를 전수 검토해 공통 에러와 엔드포인트별 특수 에러를 통합 정리한다.
> 

## 1. 공통 에러 형식

모든 에러 응답은 아래 형식을 따른다.

```json
{
  "error": {
    "code": "PLACE_NOT_FOUND",
    "message": "해당 장소를 찾을 수 없습니다."
  }
}
```

- `code`: 클라이언트 분기 처리용 안정 식별자 (SCREAMING_SNAKE_CASE).
- `message`: 사용자 노출 가능한 한국어 메시지. 클라이언트는 `code` 기준으로 분기하고 `message`는 표시용으로만 사용한다.

## 2. 공통 에러 코드

API spec의 「공통 에러 코드」 표 기준. 모든 엔드포인트에서 발생할 수 있다.

| HTTP | code | 설명 |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | 요청 파라미터 오류 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 403 | FORBIDDEN | 권한 없음 |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 중복 리소스 |
| 422 | UNPROCESSABLE | 처리 불가 상태 |
| 500 | INTERNAL_ERROR | 서버 오류 |

> API spec의 공통 에러 형식 예시에 등장하는 `PLACE_NOT_FOUND`는 404 `NOT_FOUND`의 리소스 특화 변형이다. 4.x 도메인별 표 참조.
> 

## 3. 인증·인가 적용 기준

| code | HTTP | 발생 조건 |
| --- | --- | --- |
| UNAUTHORIZED | 401 | 🔓 표기 없는 모든 엔드포인트에서 `Authorization: Bearer` 헤더 누락 또는 만료된 액세스 토큰 |
| FORBIDDEN | 403 | 인증은 됐으나 권한이 없는 경우 (타인 리소스 수정/삭제, 기본 플레이스 삭제 등) |

> 🔓 표기 엔드포인트(공유 링크 조회, 공개 공유 조회)는 비인증 접근을 허용하므로 토큰 없이도 `UNAUTHORIZED`가 발생하지 않는다.
> 

---

## 4. 도메인별 특수 에러 코드

API spec에 명시된 엔드포인트별 에러를 전수 추출했다.

### 4.1 링크 수집 (Source Links)

**POST /source-links**

| code | HTTP | 설명 |
| --- | --- | --- |
| UNSUPPORTED_PLATFORM | 422 | 지원하지 않는 URL 플랫폼 |
| DUPLICATE_LINK | 409 | 이미 처리 중인 동일 링크 |

### 4.2 장소 후보 (Place Candidates)

**POST /candidates/batch**

| code | HTTP | 설명 |
| --- | --- | --- |
| VALIDATION_ERROR | 400 | candidates 배열이 비었거나 50개 초과 |

> batch 요청은 부분 실패를 허용한다. 개별 후보의 실패는 요청 자체의 에러가 아니라 HTTP 200 응답 body의 `failed[]` 배열로 반환된다. 항목별 실패 사유는 아래 「batch 항목 실패 사유」 표 참조.
> 

**batch 항목 실패 사유** (응답 body `failed[].reason` 값)

| reason | 설명 |
| --- | --- |
| NOT_FOUND | 해당 candidate_id가 존재하지 않음 |
| ALREADY_PROCESSED | 이미 수락/거절 처리된 후보 |

### 4.3 커뮤니티 (Community)

**DELETE /community/posts/:post_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 포스트 삭제 시도 |

**POST /community/posts/:post_id/like**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 좋아요한 포스트 |

**DELETE /community/posts/:post_id/comments/:comment_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 댓글 삭제 시도 |

**POST /users/:user_id/follow**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 팔로우 중 |
| FORBIDDEN | 403 | 본인 팔로우 시도 |

### 4.4 장소 리뷰 (Place Reviews)

**POST /places/:place_id/reviews**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 해당 장소에 리뷰 존재 (장소 1개당 사용자 1개 리뷰만 허용) |

**DELETE /places/:place_id/reviews/:review_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 리뷰 삭제 시도 |

### 4.5 플레이스 (Collections)

**DELETE /collections/:collection_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | `is_default: true`인 기본 플레이스 삭제 시도 |

### 4.6 플랜 마켓 (Plan Market)

**GET /market/plans/:market_plan_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| INSUFFICIENT_CREDITS | 402 | 크레딧 부족으로 플랜 상세 열람 불가 |

**POST /market/plans**

| code | HTTP | 설명 |
| --- | --- | --- |
| OTA_NOT_VERIFIED | 422 | OTA 예약 미완료 플랜 등록 시도 |
| ALREADY_LISTED | 409 | 이미 마켓에 등록된 플랜 |

**DELETE /market/plans/:market_plan_id**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 플랜 삭제 시도 |

> `INSUFFICIENT_CREDITS`는 402 Payment Required를 사용한다. API spec의 공통 에러 코드 표에는 402가 없으므로, 이 도메인 전용 상태 코드로 명시 관리한다.
> 

### 4.7 크레딧 / 광고 (Credits)

**POST /credits/ads/start**

| code | HTTP | 설명 |
| --- | --- | --- |
| AD_LIMIT_REACHED | 422 | 일일 광고 시청 한도 초과 |

**POST /credits/ads/complete**

| code | HTTP | 설명 |
| --- | --- | --- |
| INVALID_AD_SESSION | 422 | 유효하지 않거나 만료된 광고 세션 |
| AD_ALREADY_COMPLETED | 409 | 이미 완료 처리된 세션 |

---

## 5. 전체 에러 코드 색인

spec에 등장하는 모든 에러 코드를 HTTP 상태별로 통합한 색인. (공통 7종 + 특수 + PLACE_NOT_FOUND)

| code | HTTP | 분류 | 주 발생 위치 |
| --- | --- | --- | --- |
| VALIDATION_ERROR | 400 | 공통 | 전 엔드포인트 / POST /candidates/batch |
| UNAUTHORIZED | 401 | 공통 | 🔓 미표기 전 엔드포인트 |
| INSUFFICIENT_CREDITS | 402 | 특수 | GET /market/plans/:market_plan_id |
| FORBIDDEN | 403 | 공통 | 타인 리소스 삭제, 본인 팔로우, 기본 플레이스 삭제 |
| NOT_FOUND | 404 | 공통 | 전 엔드포인트 |
| PLACE_NOT_FOUND | 404 | 공통(변형) | 장소 리소스 미존재 (공통 에러 형식 예시) |
| CONFLICT | 409 | 공통 | 좋아요 중복, 팔로우 중복, 리뷰 중복 |
| DUPLICATE_LINK | 409 | 특수 | POST /source-links |
| ALREADY_LISTED | 409 | 특수 | POST /market/plans |
| AD_ALREADY_COMPLETED | 409 | 특수 | POST /credits/ads/complete |
| UNPROCESSABLE | 422 | 공통 | 전 엔드포인트 |
| UNSUPPORTED_PLATFORM | 422 | 특수 | POST /source-links |
| OTA_NOT_VERIFIED | 422 | 특수 | POST /market/plans |
| AD_LIMIT_REACHED | 422 | 특수 | POST /credits/ads/start |
| INVALID_AD_SESSION | 422 | 특수 | POST /credits/ads/complete |
| INTERNAL_ERROR | 500 | 공통 | 전 엔드포인트 |

## 6. 비고

- batch 항목 실패 사유(`NOT_FOUND`, `ALREADY_PROCESSED`)는 HTTP 에러 코드가 아니라 200 응답 body의 `failed[].reason` 값이다. 색인 표에는 포함하지 않았다.
- `INSUFFICIENT_CREDITS`의 402는 API spec 공통 에러 표에 없는 상태 코드다. 결제/크레딧 도메인 확장 시 402 정책을 별도 합의할 것을 권장한다.
- 분석 잡 실패는 HTTP 에러가 아니다. `GET /jobs/:job_id`는 잡이 실패해도 HTTP 200을 반환하며, 실패 원인은 응답 body의 `error_code` 필드로 전달된다 (현재 spec에 구체적 값 미정의 — 추후 정의 필요).
- 성공 응답은 별도 문서 SuccessCode를 참조한다.