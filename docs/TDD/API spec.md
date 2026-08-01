> REST API 기반. 인증은 Bearer Token (JWT). 모든 요청/응답 body는 `application/json`.
> 

---

## 공통 규칙

**Base URL**

```
https://api.example.com/v1
```

**인증**

```
Authorization: Bearer <access_token>
```

비로그인 허용 엔드포인트는 각 항목에 🔓 표기.

**공통 에러 형식**

```json
{
  "error": {
    "code": "PLACE_NOT_FOUND",
    "message": "해당 장소를 찾을 수 없습니다."
  }
}
```

**공통 에러 코드**

| HTTP | code | 설명 |
| --- | --- | --- |
| 400 | VALIDATION_ERROR | 요청 파라미터 오류 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 403 | FORBIDDEN | 권한 없음 |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 중복 리소스 |
| 422 | UNPROCESSABLE | 처리 불가 상태 |
| 500 | INTERNAL_ERROR | 서버 오류 |

---

## 엔드포인트 목록

| 도메인 | 메서드 | 경로 | 설명 |
| --- | --- | --- | --- |
| Auth | POST | /auth/social | 소셜 로그인 |
| Auth | POST | /auth/refresh | 토큰 갱신 |
| Auth | DELETE | /auth/session | 로그아웃 |
| Users | GET | /users/me | 내 프로필 조회 |
| Users | PATCH | /users/me | 프로필 수정 |
| Users | DELETE | /users/me | 계정 삭제 |
| Source Links | POST | /source-links | 링크 제출 + 분석 잡 생성 |
| Source Links | GET | /source-links | 링크 목록 조회 |
| Extraction Jobs | GET | /jobs/:job_id | 분석 잡 상태 조회 |
| Place Candidates | GET | /jobs/:job_id/candidates | 장소 후보 목록 |
| Place Candidates | PATCH | /candidates/:candidate_id | 후보 단건 수락/거절 |
| Place Candidates | POST | /candidates/batch | 후보 일괄 수락/거절 |
| Places | GET | /places/:place_id | 장소 상세 |
| Places | GET | /places/search | 장소 검색 |
| Places | GET | /places/similar | 유사 장소 추천 |
| Places | GET | /discover | 둘러보기 — 취향 기반 장소 추천 |
| Collections | GET | /collections | 플레이스 목록 |
| Collections | POST | /collections | 플레이스 생성 |
| Collections | PATCH | /collections/:collection_id | 플레이스 수정 |
| Collections | DELETE | /collections/:collection_id | 플레이스 삭제 |
| Collections | GET | /collections/:collection_id/places | 플레이스 내 장소 조회 |
| Collections | POST | /collections/:collection_id/places | 장소 추가 |
| Collections | DELETE | /collections/:collection_id/places/:place_id | 장소 제거 |
| Collections | GET | /collections/:collection_id/share | 공유 링크 조회 🔓 |
| Itineraries | GET | /itineraries | 플랜 목록 |
| Itineraries | POST | /itineraries | 플랜 생성 |
| Itineraries | GET | /itineraries/:itinerary_id | 플랜 상세 |
| Itineraries | PATCH | /itineraries/:itinerary_id | 플랜 수정 |
| Itineraries | DELETE | /itineraries/:itinerary_id | 플랜 삭제 |
| Itineraries | POST | /itineraries/:itinerary_id/items | 장소 추가 |
| Itineraries | PATCH | /itineraries/:itinerary_id/items/:item_id | 장소 일정 수정 |
| Itineraries | DELETE | /itineraries/:itinerary_id/items/:item_id | 장소 제거 |
| Itineraries | POST | /itineraries/:itinerary_id/items/reorder | 순서 일괄 변경 |
| Itineraries | GET | /itineraries/:itinerary_id/share | 공유 링크 조회 🔓 |
| Itineraries | GET | /itineraries/:itinerary_id/ota-links | OTA 링크 생성 |
| Planning Agent | POST | /itineraries/:itinerary_id/agent | Agent 메시지 전송 |
| Community | GET | /community/posts | 커뮤니티 피드 조회 |
| Community | POST | /community/posts | 포스트 작성 |
| Community | GET | /community/posts/:post_id | 포스트 상세 |
| Community | DELETE | /community/posts/:post_id | 포스트 삭제 |
| Community | POST | /community/posts/:post_id/like | 좋아요 |
| Community | DELETE | /community/posts/:post_id/like | 좋아요 취소 |
| Community | GET | /community/posts/:post_id/comments | 댓글 목록 |
| Community | POST | /community/posts/:post_id/comments | 댓글 작성 |
| Community | DELETE | /community/posts/:post_id/comments/:comment_id | 댓글 삭제 |
| Community | GET | /users/:user_id/profile | 다른 사용자 프로필 조회 |
| Community | POST | /users/:user_id/follow | 팔로우 |
| Community | DELETE | /users/:user_id/follow | 언팔로우 |
| Places | GET | /places/:place_id/reviews | 장소 리뷰 목록 |
| Places | POST | /places/:place_id/reviews | 리뷰 작성 |
| Places | DELETE | /places/:place_id/reviews/:review_id | 리뷰 삭제 |
| Places | GET | /places/:place_id/source-links | 장소 출처 영상 목록 |
| Plan Market | GET | /market/plans | 플랜 마켓 목록 |
| Plan Market | POST | /market/plans | 플랜 마켓 등록 |
| Plan Market | GET | /market/plans/:market_plan_id/preview | 플랜 미리보기 |
| Plan Market | GET | /market/plans/:market_plan_id | 플랜 상세 조회 (크레딧 차감) |
| Plan Market | DELETE | /market/plans/:market_plan_id | 플랜 마켓 등록 취소 |
| Credits | GET | /credits/me | 내 크레딧 잔액 조회 |
| Credits | GET | /credits/me/history | 크레딧 적립/차감 내역 |
| Credits | POST | /credits/ads/start | 광고 시청 시작 |
| Credits | POST | /credits/ads/complete | 광고 시청 완료 + 크레딧 적립 |
| Notifications | GET | /notifications | 알림 목록 |
| Notifications | PATCH | /notifications/:notification_id/read | 알림 읽음 처리 |
| Public Share | GET | /public/itineraries/:share_token | 공유 플랜 조회 🔓 |
| Public Share | GET | /public/collections/:share_token | 공유 플레이스 조회 🔓 |

---

## 1. 인증 (Auth)

### POST /auth/social

소셜 로그인. Google / Kakao OAuth 토큰으로 가입 또는 로그인한다.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| provider | string | ✅ | google / kakao |
| id_token | string | ✅ | 소셜 제공자 발급 ID 토큰 |

```json
{
  "provider": "google",
  "id_token": "eyJhbGci..."
}
```

**Response 201**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| access_token | string | API 요청 시 사용하는 JWT 액세스 토큰 |
| refresh_token | string | 액세스 토큰 갱신용 토큰 |
| user.id | string | 사용자 고유 ID |
| user.nickname | string | 닉네임 (형용사+동물+숫자 형식) |
| user.avatar_url | string | 프로필 이미지 URL |
| user.email | string | 소셜 계정 이메일 |
| user.locale | string | 언어 설정 (예: ko-KR) |
| user.is_new_user | boolean | 최초 가입 여부. true면 온보딩 화면으로 이동 |
| user.credit_balance | integer | 로그인 시점의 크레딧 잔액. 이후 변동은 `GET /credits/me` 사용 |

```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "nickname": "이상한 여우 8237",
    "avatar_url": "https://cdn.example.com/avatars/fox.png",
    "email": "user@example.com",
    "locale": "ko-KR",
    "is_new_user": true,
    "credit_balance": 3
  }
}
```

---

### POST /auth/refresh

액세스 토큰 갱신.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| refresh_token | string | ✅ | 리프레시 토큰 |

**Response 200**

```json
{ "access_token": "eyJhbGci..." }
```

---

### DELETE /auth/session

로그아웃. 서버 측 리프레시 토큰 무효화.

**Response 204**

---

## 2. 사용자 (Users)

### GET /users/me

내 프로필 조회.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| id | string | 사용자 고유 ID |
| nickname | string | 닉네임 |
| avatar_url | string | 프로필 이미지 URL |
| email | string | 이메일 |
| locale | string | 언어 설정 |
| home_region | string | 선호 지역 |
| map_provider | string | 선호 지도 앱 (kakao / google) |
| credit_balance | integer | 현재 크레딧 잔액. 실시간 값은 `GET /credits/me` 사용 |
| created_at | string | 계정 생성 일시 (ISO 8601) |

```json
{
  "id": "uuid",
  "nickname": "이상한 여우 8237",
  "avatar_url": "https://cdn.example.com/avatars/fox.png",
  "email": "user@example.com",
  "locale": "ko-KR",
  "home_region": "서울",
  "map_provider": "kakao",
  "credit_balance": 3,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### PATCH /users/me

닉네임 / 아바타 / 선호 설정 변경. 변경할 항목만 포함 (모든 필드 optional).

**Request Body**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| nickname | string | 닉네임 (최대 20자) |
| avatar_url | string | 프로필 사진 URL |
| home_region | string | 선호 지역 |
| locale | string | 언어 설정 (예: ko-KR) |
| map_provider | string | kakao / google |

**Response 200** — 변경된 사용자 객체 반환 (credit_balance 포함)

---

### DELETE /users/me

계정 삭제.

**Response 204**

---

## 3. 링크 수집 (Source Links)

### POST /source-links

공유하기로 수신된 링크를 제출하고 분석 잡을 즉시 생성한다. (S-03 트리거)

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| url | string | ✅ | 공유 수신된 URL |

**Response 201**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| source_link_id | string | 링크 고유 ID |
| job_id | string | 생성된 분석 잡 ID. 이후 `/jobs/:job_id` 폴링에 사용 |
| job_status | string | 초기 상태 (항상 pending) |
| source_type | string | 감지된 플랫폼 타입 (youtube_short / instagram_reel 등) |
| submitted_at | string | 제출 일시 (ISO 8601) |

```json
{
  "source_link_id": "uuid",
  "job_id": "uuid",
  "job_status": "pending",
  "source_type": "youtube_short",
  "submitted_at": "2024-12-01T10:00:00Z"
}
```

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| UNSUPPORTED_PLATFORM | 422 | 지원하지 않는 URL 플랫폼 |
| DUPLICATE_LINK | 409 | 이미 처리 중인 동일 링크 |

---

### GET /source-links

제출한 링크 목록 조회. (S-02 홈 화면)

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| status | string |  | pending / processing / done / failed |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 링크 목록 |
| items[].source_link_id | string | 링크 고유 ID |
| items[].url | string | 제출된 원본 URL |
| items[].source_type | string | 플랫폼 타입 (youtube_short / instagram_reel 등) |
| items[].title | string | 영상 제목 |
| items[].thumbnail_url | string | 영상 썸네일 URL |
| items[].job_status | string | 분석 잡 상태 (pending / processing / done / failed) |
| items[].submitted_at | string | 제출 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "source_link_id": "uuid",
      "url": "https://youtube.com/shorts/abc123",
      "source_type": "youtube_short",
      "title": "도쿄 숨은 맛집 VLOG",
      "thumbnail_url": "https://...",
      "job_status": "done",
      "submitted_at": "2024-12-01T10:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

## 4. 분석 잡 (Extraction Jobs)

### GET /jobs/:job_id

분석 잡 상태 조회. 폴링 또는 푸시 알림 수신 후 호출.

**job_status 상태 전이**

| 값 | 설명 |
| --- | --- |
| pending | 대기 중 |
| processing | 분석 중 |
| done | 완료 |
| failed | 실패 |

`pending` → `processing` → `done` | `failed`

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| job_id | string | 잡 고유 ID |
| source_link_id | string | 연결된 링크 ID |
| job_status | string | 현재 잡 상태 (pending / processing / done / failed) |
| signal_count | integer | 추출된 장소 후보 수 |
| error_code | string | 실패 시 에러 코드. 정상 시 null |
| started_at | string | 처리 시작 일시 (ISO 8601) |
| completed_at | string | 처리 완료 일시 (ISO 8601). 미완료 시 null |

```json
{
  "job_id": "uuid",
  "source_link_id": "uuid",
  "job_status": "done",
  "signal_count": 3,
  "error_code": null,
  "started_at": "2024-12-01T10:00:05Z",
  "completed_at": "2024-12-01T10:00:18Z"
}
```

---

## 5. 장소 후보 (Place Candidates)

### GET /jobs/:job_id/candidates

분석 완료 후 장소 후보 목록 조회. (S-04 화면)

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| source_link | object | 분석된 원본 링크 정보 |
| source_link.url | string | 원본 URL |
| source_link.title | string | 영상 제목 |
| source_link.thumbnail_url | string | 영상 썸네일 URL |
| candidates | array | 추출된 장소 후보 목록 |
| candidates[].candidate_id | string | 후보 고유 ID |
| candidates[].candidate_name | string | AI가 파싱한 장소명 |
| candidates[].category | string | 장소 카테고리 |
| candidates[].confidence_score | number | AI 추출 신뢰도 (0.0~1.0) |
| candidates[].rank_order | integer | 영상 내 언급 순서 |
| candidates[].requires_confirmation | boolean | 신뢰도 낮은 후보. true면 사용자 수동 확인 권장 |
| candidates[].status | string | 후보 상태 (proposed / accepted / rejected / edited) |
| candidates[].evidence | string | 장소 추출 근거 텍스트 |
| candidates[].place | object | 지도 정규화된 장소 정보 |
| candidates[].place.place_id | string | 장소 고유 ID |
| candidates[].place.canonical_name | string | 정규화된 공식 장소명 |
| candidates[].place.latitude | number | 위도 |
| candidates[].place.longitude | number | 경도 |
| candidates[].place.country_code | string | 국가 코드 |
| candidates[].place.google_place_id | string | Google Maps 장소 ID |
| candidates[].place.kakao_place_id | string | Kakao Maps 장소 ID |

```json
{
  "source_link": {
    "url": "https://youtube.com/shorts/abc123",
    "title": "도쿄 숨은 맛집 VLOG",
    "thumbnail_url": "https://..."
  },
  "candidates": [
    {
      "candidate_id": "uuid",
      "candidate_name": "시부야 스크램블 교차로",
      "category": "관광명소",
      "confidence_score": 0.9200,
      "rank_order": 1,
      "requires_confirmation": false,
      "status": "proposed",
      "evidence": "캡션:\"시부야 교차로 최고의 뷰포인트\"",
      "place": {
        "place_id": "uuid",
        "canonical_name": "시부야 스크램블 교차로",
        "latitude": 35.659513,
        "longitude": 139.700440,
        "category": "관광명소",
        "country_code": "JP",
        "google_place_id": "ChIJ...",
        "kakao_place_id": "12345678"
      }
    }
  ]
}
```

---

### PATCH /candidates/:candidate_id

후보 단건 수락 / 거절 / 수정. (S-04 개별 버튼)

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| status | string | ✅ | accepted / rejected / edited |

**status 값 설명**

| 값 | 설명 |
| --- | --- |
| accepted | 수락 |
| rejected | 거절 |
| edited | 사용자가 직접 수정 |

**Response 200** — 변경된 candidate 객체 반환

---

### POST /candidates/batch

후보 일괄 수락 / 거절. (S-04 “전체 수락” 또는 다중 선택 후 일괄 처리)

한 번의 요청으로 여러 후보의 상태를 동시에 변경한다. 부분 실패 시에도 성공한 항목은 반영되며, 실패 목록을 함께 반환한다.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| candidates | array | ✅ | 변경할 후보 목록 (최대 50개) |
| candidates[].candidate_id | string | ✅ | 후보 고유 ID |
| candidates[].status | string | ✅ | accepted / rejected |

```json
{
  "candidates": [
    { "candidate_id": "uuid-1", "status": "accepted" },
    { "candidate_id": "uuid-2", "status": "accepted" },
    { "candidate_id": "uuid-3", "status": "rejected" }
  ]
}
```

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| updated | array | 성공적으로 상태가 변경된 후보 목록 |
| updated[].candidate_id | string | 후보 고유 ID |
| updated[].status | string | 변경된 상태 |
| failed | array | 처리 실패한 후보 목록 |
| failed[].candidate_id | string | 후보 고유 ID |
| failed[].reason | string | 실패 사유 (예: NOT_FOUND / ALREADY_PROCESSED) |

```json
{
  "updated": [
    { "candidate_id": "uuid-1", "status": "accepted" },
    { "candidate_id": "uuid-2", "status": "accepted" },
    { "candidate_id": "uuid-3", "status": "rejected" }
  ],
  "failed": []
}
```

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| VALIDATION_ERROR | 400 | candidates 배열이 비었거나 50개 초과 |

---

## 6. 장소 (Places)

### GET /places/:place_id

장소 상세 조회. (S-05 화면)

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| place_id | string | 장소 고유 ID |
| canonical_name | string | 정규화된 공식 장소명 |
| latitude | number | 위도 |
| longitude | number | 경도 |
| category | string | 장소 카테고리 (관광명소 / 맛집 / 카페 / 숙박 / 자연 / 기타) |
| country_code | string | 국가 코드 (ISO 3166-1 alpha-2, 예: JP / KR / TH) |
| google_place_id | string | Google Maps 장소 ID |
| kakao_place_id | string | Kakao Maps 장소 ID |
| thumbnail_url | string | 대표 썸네일 이미지 URL |
| thumbnail_source | string | 썸네일 출처 (flickr / wikimedia / google_places) |
| source_link | object | 이 장소가 추출된 원본 영상 정보 |
| source_link.url | string | 원본 영상 URL |
| source_link.title | string | 영상 제목 |
| source_link.thumbnail_url | string | 영상 썸네일 URL |
| source_link.platform | string | 플랫폼 타입 (youtube_short / instagram_reel 등) |
| evidence | string | 장소 추출 근거 (Supadata가 감지한 캡션 또는 음성 텍스트) |
| created_at | string | 장소 저장 일시 (ISO 8601) |

```json
{
  "place_id": "uuid",
  "canonical_name": "시부야 스크램블 교차로",
  "latitude": 35.659513,
  "longitude": 139.700440,
  "category": "관광명소",
  "country_code": "JP",
  "google_place_id": "ChIJ...",
  "kakao_place_id": "12345678",
  "thumbnail_url": "https://cdn.example.com/places/shibuya.jpg",
  "thumbnail_source": "flickr",
  "source_link": {
    "url": "https://youtube.com/shorts/abc123",
    "title": "도쿄 숨은 맛집 VLOG",
    "thumbnail_url": "https://...",
    "platform": "youtube_short"
  },
  "evidence": "캡션:\"시부야 교차로 최고의 뷰포인트\"",
  "created_at": "2024-12-01T10:00:20Z"
}
```

---

### GET /places/search

장소 수동 검색. 저신뢰 후보 대체 또는 직접 추가 시 사용.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| q | string | ✅ | 검색 키워드 |
| provider | string |  | kakao / google (기본: kakao) |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| results | array | 검색 결과 장소 목록 |
| results[].place_id | string | 장소 고유 ID |
| results[].canonical_name | string | 정규화된 장소명 |
| results[].category | string | 장소 카테고리 |
| results[].latitude | number | 위도 |
| results[].longitude | number | 경도 |
| results[].country_code | string | 국가 코드 |

```json
{
  "results": [
    {
      "place_id": "uuid",
      "canonical_name": "블루보틀 시부야점",
      "category": "카페",
      "latitude": 35.661,
      "longitude": 139.699,
      "country_code": "JP"
    }
  ]
}
```

---

### GET /places/similar

유사 장소 추천. Planning Agent `search_similar_places` 도구 내부에서 호출. pgvector 임베딩 검색.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| place_id | string | ✅ | 기준 장소 ID |
| limit | integer |  | 기본 10, 최대 20 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| results | array | 유사 장소 목록 |
| results[].place_id | string | 장소 고유 ID |
| results[].canonical_name | string | 정규화된 장소명 |
| results[].category | string | 장소 카테고리 |
| results[].latitude | number | 위도 |
| results[].longitude | number | 경도 |
| results[].thumbnail_url | string | 장소 썸네일 URL |
| results[].thumbnail_source | string | 썸네일 출처 (flickr / wikimedia / google_places) |
| results[].similarity_score | number | pgvector 코사인 유사도 (0.0~1.0, 높을수록 유사) |

```json
{
  "results": [
    {
      "place_id": "uuid",
      "canonical_name": "블루보틀 시부야점",
      "category": "카페",
      "latitude": 35.661,
      "longitude": 139.699,
      "thumbnail_url": "https://cdn.example.com/places/bluebottle.jpg",
      "thumbnail_source": "wikimedia",
      "similarity_score": 0.91
    }
  ]
}
```

---

### GET /discover

사용자가 최근 저장한 장소 데이터를 기반으로 유사 장소를 추천한다. (“둘러보기” 탭)

동작 흐름:

1. 최근 N개 저장 장소의 embedding 평균 → 취향 벡터 생성
2. pgvector로 유사 장소 검색, 이미 저장한 장소 제외
3. 썸네일 폴백: Flickr → Wikimedia Commons → Google Places Photos 순으로 보완

> 콜드 스타트: 저장 장소 3개 이하일 경우 카테고리 인기순 fallback 적용.
> 

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| limit | integer |  | 기본 20 |
| category | string |  | 카테고리 필터 (선택사항) |
| country_code | string |  | 국가 필터 (선택사항, 예: KR / JP / TH) |

**썸네일 폴백 전략**

| 순위 | 소스 | 비용 | 한·일·동남아 커버 |
| --- | --- | --- | --- |
| 1 | Flickr API (CC 라이선스, 좌표 반경 검색) | 무료 | ⭐⭐⭐⭐⭐ |
| 2 | Wikimedia Commons (geosearch) | 무료 | ⭐⭐⭐⭐ |
| 3 | Google Places Photos (저장 시 1회 호출 후 캐싱) | 저장 시 1회 $0.007 | ⭐⭐⭐⭐⭐ |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| results | array | 추천 장소 목록 |
| results[].place_id | string | 장소 고유 ID |
| results[].canonical_name | string | 정규화된 장소명 |
| results[].category | string | 장소 카테고리 |
| results[].latitude | number | 위도 |
| results[].longitude | number | 경도 |
| results[].country_code | string | 국가 코드 |
| results[].thumbnail_url | string | 장소 썸네일 URL |
| results[].thumbnail_source | string | 썸네일 출처 (flickr / wikimedia / google_places) |
| results[].similarity_score | number | pgvector 코사인 유사도 (0.0~1.0) |

```json
{
  "results": [
    {
      "place_id": "uuid",
      "canonical_name": "츠키지 시장",
      "category": "시장",
      "latitude": 35.655,
      "longitude": 139.770,
      "country_code": "JP",
      "thumbnail_url": "https://cdn.example.com/places/tsukiji.jpg",
      "thumbnail_source": "flickr",
      "similarity_score": 0.87
    }
  ]
}
```

---

## 7. 콜렉션 (Collections)

> 앱 내 “플레이스” 탭 (S-06). 장소를 지역·주제별로 묶는 사용자 정의 컬렉션.
> 

### GET /collections

내 플레이스 목록 조회.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 플레이스 목록 |
| items[].collection_id | string | 플레이스 고유 ID |
| items[].name | string | 플레이스 이름 |
| items[].is_default | boolean | 기본 플레이스 여부. true면 삭제 불가 |
| items[].icon | string | 이모지 (없으면 null) |
| items[].place_count | integer | 포함된 장소 수 |
| items[].visibility | string | 공개 범위 (public / private) |

```json
{
  "items": [
    {
      "collection_id": "uuid",
      "name": "저장한 플레이스",
      "is_default": true,
      "icon": null,
      "place_count": 24,
      "visibility": "private"
    },
    {
      "collection_id": "uuid",
      "name": "일본",
      "is_default": false,
      "icon": "🗾",
      "place_count": 8,
      "visibility": "private"
    }
  ]
}
```

---

### POST /collections

플레이스 생성.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| name | string | ✅ | 플레이스 이름 |
| icon | string |  | 이모지 (예: 🗾) |

**Response 201** — 생성된 collection 객체 반환

---

### PATCH /collections/:collection_id

플레이스 수정.

**Request Body**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| name | string | 플레이스 이름 |
| icon | string | 이모지 |
| visibility | string | public / private |

**Response 200** — 변경된 collection 객체 반환

---

### DELETE /collections/:collection_id

플레이스 삭제. `is_default: true`인 경우 403 반환.

**Response 204**

---

### GET /collections/:collection_id/places

플레이스 내 장소 목록 조회.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| collection_id | string | 플레이스 고유 ID |
| name | string | 플레이스 이름 |
| visibility | string | 공개 범위 (public / private) |
| places | array | 포함된 장소 목록 |
| places[].place_id | string | 장소 고유 ID |
| places[].canonical_name | string | 정규화된 장소명 |
| places[].category | string | 장소 카테고리 |
| places[].latitude | number | 위도 |
| places[].longitude | number | 경도 |

```json
{
  "collection_id": "uuid",
  "name": "일본",
  "visibility": "public",
  "places": [
    {
      "place_id": "uuid",
      "canonical_name": "시부야 스크램블 교차로",
      "category": "관광명소",
      "latitude": 35.659513,
      "longitude": 139.700440
    }
  ]
}
```

---

### POST /collections/:collection_id/places

플레이스에 장소 추가.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| place_id | string | ✅ | 추가할 장소 ID |

**Response 201**

---

### DELETE /collections/:collection_id/places/:place_id

플레이스에서 장소 제거.

**Response 204**

---

### GET /collections/:collection_id/share 🔓

공유 링크 조회 / 생성.

**Response 200**

```json
{
  "share_url": "https://app.example.com/share/collections/abc123",
  "visibility": "public"
}
```

---

## 8. 플랜 (Itineraries)

### GET /itineraries

내 플랜 목록 조회. (S-07 화면)

**Query Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| status | string | draft / confirmed / completed |
| limit | integer | 기본 20, 최대 50 |
| cursor | string | 페이지네이션 커서 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 플랜 목록 |
| items[].itinerary_id | string | 플랜 고유 ID |
| items[].title | string | 플랜 제목 |
| items[].destination_region | string | 여행지 |
| items[].start_date | string | 출발일 (YYYY-MM-DD) |
| items[].end_date | string | 도착일 (YYYY-MM-DD) |
| items[].party_size | integer | 여행 인원 수 |
| items[].visibility | string | 공개 범위 (public / private) |
| items[].status | string | 플랜 상태 (draft: 작성 중 / confirmed: 확정 / completed: 여행 완료) |
| items[].place_count | integer | 플랜에 포함된 장소 수 |
| items[].created_at | string | 플랜 생성 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "itinerary_id": "uuid",
      "title": "도쿄 3박 4일",
      "destination_region": "도쿄, 일본",
      "start_date": "2024-12-20",
      "end_date": "2024-12-23",
      "party_size": 2,
      "visibility": "private",
      "status": "draft",
      "place_count": 6,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### POST /itineraries

플랜 생성. (S-07 “새 플랜 만들기”)

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| title | string | ✅ | 플랜 제목 |
| destination_region | string | ✅ | 여행지 |
| start_date | string | ✅ | 출발일 (YYYY-MM-DD) |
| end_date | string | ✅ | 도착일 (YYYY-MM-DD) |
| party_size | integer | ✅ | 인원 수 |

**Response 201** — 생성된 itinerary 객체 반환

---

### GET /itineraries/:itinerary_id

플랜 상세 조회. (S-08 화면)

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| itinerary_id | string | 플랜 고유 ID |
| title | string | 플랜 제목 |
| destination_region | string | 여행지 |
| start_date | string | 출발일 (YYYY-MM-DD) |
| end_date | string | 도착일 (YYYY-MM-DD) |
| party_size | integer | 여행 인원 수 |
| visibility | string | 공개 범위 (public / private) |
| status | string | 플랜 상태 (draft / confirmed / completed) |
| items | array | 플랜에 포함된 장소 목록 |
| items[].item_id | string | 일정 아이템 고유 ID |
| items[].place_id | string | 장소 고유 ID |
| items[].place_name | string | 장소명 |
| items[].day_index | integer | 배치된 여행 일차. null이면 일자 미배치 풀 |
| items[].sort_order | integer | 해당 일차 내 순서. null이면 미배치 |
| items[].planned_duration_minutes | integer | 예상 체류 시간 (분). null이면 미설정 |

```json
{
  "itinerary_id": "uuid",
  "title": "도쿄 3박 4일",
  "destination_region": "도쿄, 일본",
  "start_date": "2024-12-20",
  "end_date": "2024-12-23",
  "party_size": 2,
  "visibility": "private",
  "status": "draft",
  "items": [
    {
      "item_id": "uuid",
      "place_id": "uuid",
      "place_name": "시부야 스크램블 교차로",
      "day_index": 1,
      "sort_order": 1,
      "planned_duration_minutes": 60
    },
    {
      "item_id": "uuid",
      "place_id": "uuid",
      "place_name": "이치란 라멘 신주쿠점",
      "day_index": null,
      "sort_order": null,
      "planned_duration_minutes": null
    }
  ]
}
```

> `day_index: null` = 일자 미배치 장소 풀.
> 

---

### PATCH /itineraries/:itinerary_id

플랜 기본 정보 수정.

**Request Body**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| title | string | 플랜 제목 |
| destination_region | string | 여행지 |
| start_date | string | 출발일 |
| end_date | string | 도착일 |
| party_size | integer | 인원 수 |
| visibility | string | public / private |
| status | string | draft / confirmed / completed |

**Response 200** — 변경된 itinerary 객체 반환

---

### DELETE /itineraries/:itinerary_id

플랜 삭제.

**Response 204**

---

### POST /itineraries/:itinerary_id/items

플랜에 장소 추가.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| place_id | string | ✅ | 추가할 장소 ID |
| day_index | integer |  | 일자 번호. 생략 시 미배치 풀로 추가 |
| sort_order | integer |  | 해당 일자 내 순서 |
| planned_duration_minutes | integer |  | 예상 체류 시간 (분) |

**Response 201** — 생성된 item 객체 반환

---

### PATCH /itineraries/:itinerary_id/items/:item_id

장소 일정 수정.

**Request Body**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| day_index | integer | 일자 번호 (null 허용 — 미배치 풀로 이동) |
| sort_order | integer | 순서 |
| planned_duration_minutes | integer | 체류 시간 (분) |

**Response 200** — 변경된 item 객체 반환

---

### DELETE /itineraries/:itinerary_id/items/:item_id

플랜에서 장소 제거.

**Response 204**

---

### POST /itineraries/:itinerary_id/items/reorder

일정 순서 일괄 변경. Planning Agent `reorder_itinerary` 도구 내부에서 호출.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| items | array | ✅ | 재배열할 아이템 목록 |
| items[].item_id | string | ✅ | 아이템 ID |
| items[].day_index | integer | ✅ | 변경될 일자 |
| items[].sort_order | integer | ✅ | 변경될 순서 |

**Response 200**

---

### GET /itineraries/:itinerary_id/share 🔓

공유 링크 조회.

**Response 200**

```json
{
  "share_url": "https://app.example.com/share/itineraries/abc123",
  "visibility": "public"
}
```

---

### GET /itineraries/:itinerary_id/ota-links

OTA 예약 링크 생성. (S-08 OTA 버튼 탭 시 호출)

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| type | string | ✅ | accommodation / flight / activity |

**Response 200**

```json
{
  "ota_url": "https://partner.ota.com/search?checkin=2024-12-20&checkout=2024-12-23&dest=tokyo&adults=2&aff=example_affiliate_id"
}
```

---

## 9. Planning Agent

### POST /itineraries/:itinerary_id/agent

Agent에 메시지를 전송하고 Tool 실행 결과를 반환한다. (S-09 화면)

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| message | string | ✅ | 사용자 입력 메시지 |
| history | array |  | 세션 내 대화 이력. 클라이언트가 유지하며 매 요청마다 전달 |
| history[].role | string |  | user / assistant |
| history[].content | string |  | 메시지 내용 |

```json
{
  "message": "비슷한 카페 찾아줘",
  "history": [
    { "role": "user", "content": "동선 최적화해줘" },
    { "role": "assistant", "content": "거리 기준으로 재배열했어요." }
  ]
}
```

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| reply | string | Agent의 자연어 응답 텍스트 |
| tool_results | array | 실행된 Tool별 결과 목록 |
| tool_results[].tool | string | 실행된 Tool 이름 |
| tool_results[].places | array | 유사/검색 Tool의 경우 장소 목록 |
| itinerary_updated | boolean | true면 플랜이 변경됨. `GET /itineraries/:itinerary_id` 재호출 필요 |

```json
{
  "reply": "비슷한 카페를 찾았어요! 블루보틀 시부야점을 추천해요.",
  "tool_results": [
    {
      "tool": "search_similar_places",
      "places": [
        {
          "place_id": "uuid",
          "canonical_name": "블루보틀 시부야점",
          "category": "카페",
          "latitude": 35.661,
          "longitude": 139.699
        }
      ]
    }
  ],
  "itinerary_updated": false
}
```

> `itinerary_updated: true`이면 클라이언트는 `GET /itineraries/:itinerary_id`를 재호출해 최신 상태로 갱신한다.
> 

**tool 종류**

| tool | 설명 |
| --- | --- |
| search_similar_places | pgvector 유사 장소 검색 |
| search_places_by_category | 카테고리 + 지역 필터 검색 |
| add_place_to_itinerary | 장소를 일정에 삽입 |
| remove_place_from_itinerary | 장소를 일정에서 제거 |
| reorder_itinerary | 동선 최적화 또는 순서 재배열 |
| get_place_info | 장소 상세 조회 |
| summarize_itinerary | 현재 일정 요약 반환 |

---

## 10. 커뮤니티 (Community)

### GET /community/posts

커뮤니티 피드 조회. (S-11 화면)

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| feed | string |  | all / following (기본: all) |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 포스트 목록 |
| items[].post_id | string | 포스트 고유 ID |
| items[].author | object | 작성자 정보 |
| items[].author.user_id | string | 작성자 고유 ID |
| items[].author.nickname | string | 작성자 닉네임 |
| items[].author.avatar_url | string | 작성자 프로필 이미지 URL |
| items[].content | string | 포스트 본문 |
| items[].tagged_places | array | 태그된 장소 목록 |
| items[].tagged_itinerary | object | 태그된 플랜 (없으면 null) |
| items[].like_count | integer | 좋아요 수 |
| items[].comment_count | integer | 댓글 수 |
| items[].is_liked | boolean | 현재 로그인 사용자의 좋아요 여부 |
| items[].created_at | string | 포스트 작성 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "post_id": "uuid",
      "author": {
        "user_id": "uuid",
        "nickname": "이상한 여우 8237",
        "avatar_url": "https://cdn.example.com/avatars/fox.png"
      },
      "content": "도쿄 여행 다녀왔어요 🗼",
      "tagged_places": [
        {
          "place_id": "uuid",
          "canonical_name": "시부야 스크램블 교차로",
          "category": "관광명소",
          "thumbnail_url": "https://cdn.example.com/places/shibuya.jpg"
        }
      ],
      "tagged_itinerary": {
        "itinerary_id": "uuid",
        "title": "도쿄 3박 4일"
      },
      "like_count": 12,
      "comment_count": 3,
      "is_liked": false,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### POST /community/posts

포스트 작성.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| content | string | ✅ | 포스트 본문 (최대 1000자) |
| tagged_place_ids | array |  | 태그할 장소 ID 배열 (최대 10개) |
| tagged_itinerary_id | string |  | 태그할 플랜 ID |

```json
{
  "content": "도쿄 여행 다녀왔어요 🗼",
  "tagged_place_ids": ["uuid", "uuid"],
  "tagged_itinerary_id": "uuid"
}
```

**Response 201** — 생성된 post 객체 반환

---

### GET /community/posts/:post_id

포스트 상세 조회. (S-11A 화면)

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| post_id | string | 포스트 고유 ID |
| author | object | 작성자 정보 |
| content | string | 포스트 본문 |
| tagged_places | array | 태그된 장소 목록 |
| tagged_itinerary | object | 태그된 플랜 (없으면 null) |
| like_count | integer | 좋아요 수 |
| comment_count | integer | 댓글 수 |
| is_liked | boolean | 현재 로그인 사용자의 좋아요 여부 |
| created_at | string | 포스트 작성 일시 (ISO 8601) |

```json
{
  "post_id": "uuid",
  "author": {
    "user_id": "uuid",
    "nickname": "이상한 여우 8237",
    "avatar_url": "https://cdn.example.com/avatars/fox.png"
  },
  "content": "도쿄 여행 다녀왔어요 🗼",
  "tagged_places": [
    {
      "place_id": "uuid",
      "canonical_name": "시부야 스크램블 교차로",
      "category": "관광명소",
      "thumbnail_url": "https://cdn.example.com/places/shibuya.jpg"
    }
  ],
  "tagged_itinerary": {
    "itinerary_id": "uuid",
    "title": "도쿄 3박 4일"
  },
  "like_count": 12,
  "comment_count": 3,
  "is_liked": false,
  "created_at": "2024-12-01T10:00:00Z"
}
```

---

### DELETE /community/posts/:post_id

포스트 삭제. 본인 포스트만 삭제 가능.

**Response 204**

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 포스트 삭제 시도 |

---

### POST /community/posts/:post_id/like

포스트 좋아요.

**Response 201**

```json
{ "like_count": 13 }
```

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 좋아요한 포스트 |

---

### DELETE /community/posts/:post_id/like

포스트 좋아요 취소.

**Response 200**

```json
{ "like_count": 12 }
```

---

### GET /community/posts/:post_id/comments

포스트 댓글 목록 조회.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 댓글 목록 |
| items[].comment_id | string | 댓글 고유 ID |
| items[].author.user_id | string | 작성자 고유 ID |
| items[].author.nickname | string | 작성자 닉네임 |
| items[].author.avatar_url | string | 작성자 프로필 이미지 URL |
| items[].content | string | 댓글 본문 |
| items[].created_at | string | 댓글 작성 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "comment_id": "uuid",
      "author": {
        "user_id": "uuid",
        "nickname": "용감한 고양이 3921",
        "avatar_url": "https://cdn.example.com/avatars/cat.png"
      },
      "content": "저도 가고 싶어요!",
      "created_at": "2024-12-01T11:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### POST /community/posts/:post_id/comments

댓글 작성.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| content | string | ✅ | 댓글 본문 (최대 300자) |

```json
{ "content": "저도 가고 싶어요!" }
```

**Response 201** — 생성된 comment 객체 반환

---

### DELETE /community/posts/:post_id/comments/:comment_id

댓글 삭제. 본인 댓글만 삭제 가능.

**Response 204**

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 댓글 삭제 시도 |

---

### GET /users/:user_id/profile

다른 사용자 프로필 조회.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| user_id | string | 사용자 고유 ID |
| nickname | string | 닉네임 |
| avatar_url | string | 프로필 이미지 URL |
| follower_count | integer | 이 사용자를 팔로우하는 사람 수 |
| following_count | integer | 이 사용자가 팔로우하는 사람 수 |
| post_count | integer | 게시한 포스트 수 |
| is_following | boolean | 현재 로그인 사용자의 팔로우 여부 |

```json
{
  "user_id": "uuid",
  "nickname": "용감한 고양이 3921",
  "avatar_url": "https://cdn.example.com/avatars/cat.png",
  "follower_count": 42,
  "following_count": 18,
  "post_count": 7,
  "is_following": false
}
```

---

### POST /users/:user_id/follow

사용자 팔로우.

**Response 201**

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 팔로우 중 |
| FORBIDDEN | 403 | 본인 팔로우 시도 |

---

### DELETE /users/:user_id/follow

사용자 언팔로우.

**Response 204**

---

## 11. 장소 리뷰 / 출처 영상 (Places)

### GET /places/:place_id/reviews

장소 리뷰 목록 조회.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 리뷰 목록 |
| items[].review_id | string | 리뷰 고유 ID |
| items[].author.user_id | string | 작성자 고유 ID |
| items[].author.nickname | string | 작성자 닉네임 |
| items[].author.avatar_url | string | 작성자 프로필 이미지 URL |
| items[].rating | integer | 평점 (1~5 정수) |
| items[].content | string | 리뷰 본문 |
| items[].created_at | string | 리뷰 작성 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "review_id": "uuid",
      "author": {
        "user_id": "uuid",
        "nickname": "이상한 여우 8237",
        "avatar_url": "https://cdn.example.com/avatars/fox.png"
      },
      "rating": 4,
      "content": "뷰가 정말 좋아요!",
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### POST /places/:place_id/reviews

리뷰 작성. 장소 1개당 사용자 1개 리뷰만 허용.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| rating | integer | ✅ | 1~5 정수 |
| content | string |  | 리뷰 본문 (최대 500자) |

```json
{
  "rating": 4,
  "content": "뷰가 정말 좋아요!"
}
```

**Response 201** — 생성된 review 객체 반환

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| CONFLICT | 409 | 이미 해당 장소에 리뷰 존재 |

---

### DELETE /places/:place_id/reviews/:review_id

리뷰 삭제. 본인 리뷰만 삭제 가능.

**Response 204**

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 리뷰 삭제 시도 |

---

### GET /places/:place_id/source-links

장소가 등장한 출처 영상 목록 조회. (S-05 출처 영상 가로 스크롤)

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 출처 영상 목록 |
| items[].source_link_id | string | 링크 고유 ID |
| items[].url | string | 원본 영상 URL |
| items[].platform | string | 플랫폼 타입 (youtube_short / instagram_reel 등) |
| items[].title | string | 영상 제목 |
| items[].thumbnail_url | string | 영상 썸네일 URL |
| items[].submitted_at | string | 링크 제출 일시 (ISO 8601) |

```json
{
  "items": [
    {
      "source_link_id": "uuid",
      "url": "https://youtube.com/shorts/abc123",
      "platform": "youtube_short",
      "title": "도쿄 숨은 맛집 VLOG",
      "thumbnail_url": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "submitted_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

## 12. 알림 (Notifications)

### GET /notifications

알림 목록 조회.

**Query Parameters**

| 파라미터 | 타입 | 설명 |
| --- | --- | --- |
| is_read | boolean | 읽음 여부 필터 |
| limit | integer | 기본 20, 최대 50 |
| cursor | string | 페이지네이션 커서 |

**알림 type 종류**

| type | 설명 |
| --- | --- |
| job_completed | 분석 잡 완료 |
| job_failed | 분석 잡 실패 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 알림 목록 |
| items[].notification_id | string | 알림 고유 ID |
| items[].type | string | 알림 종류 (job_completed / job_failed) |
| items[].job_id | string | 연결된 분석 잡 ID |
| items[].message | string | 알림 표시 메시지 |
| items[].is_read | boolean | 읽음 여부 |
| items[].created_at | string | 알림 생성 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "notification_id": "uuid",
      "type": "job_completed",
      "job_id": "uuid",
      "message": "시부야 VLOG에서 장소 3곳을 찾았어요.",
      "is_read": false,
      "created_at": "2024-12-01T10:00:20Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### PATCH /notifications/:notification_id/read

알림 읽음 처리.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| notification_id | string | 읽음 처리된 알림 ID |
| is_read | boolean | 읽음 여부 (true 반환) |

---

## 13. 플랜 마켓 (Plan Market)

> 커뮤니티 탭 내 위치. OTA 예약이 완료된 플랜만 등록 가능. 열람 시 크레딧 1개 차감.
> 

### 엔드포인트 목록

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| GET | /market/plans | 플랜 마켓 목록 조회 |
| POST | /market/plans | 플랜 마켓 등록 |
| GET | /market/plans/:market_plan_id | 플랜 마켓 상세 조회 (크레딧 차감) |
| DELETE | /market/plans/:market_plan_id | 플랜 마켓 등록 취소 |
| GET | /market/plans/:market_plan_id/preview | 플랜 마켓 미리보기 |

---

### GET /market/plans

플랜 마켓 목록 조회. 카드 형태로 노출되며 미리보기 정보만 반환.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| q | string |  | 검색 키워드 (제목 / 여행지 / 작성자 닉네임 복합 검색) |
| country_code | string |  | 국가 필터 (예: JP / KR / TH) |
| sort | string |  | latest / popular (기본: latest) |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**sort 값 설명**

| 값 | 설명 |
| --- | --- |
| latest | 최신 등록순 |
| popular | 조회수 기준 인기순 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 플랜 목록 |
| items[].market_plan_id | string | 마켓 플랜 고유 ID |
| items[].title | string | 마켓 노출 제목 |
| items[].destination_region | string | 여행지 |
| items[].duration_nights | integer | 숙박 일수 (3박 4일이면 3) |
| items[].party_size | integer | 여행 인원 수 |
| items[].credit_price | integer | 열람에 필요한 크레딧 수 |
| items[].author | object | 등록자 정보 |
| items[].author.user_id | string | 등록자 고유 ID |
| items[].author.nickname | string | 등록자 닉네임 |
| items[].author.avatar_url | string | 등록자 프로필 이미지 URL |
| items[].cover_thumbnail_url | string | 카드 대표 썸네일 URL |
| items[].highlight | string | 한 줄 소개 |
| items[].place_count | integer | 포함된 장소 수 |
| items[].view_count | integer | 누적 조회수 |
| items[].is_ota_verified | boolean | OTA 예약 완료 플랜 여부 (true = 실제 다녀온 플랜) |
| items[].created_at | string | 등록 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "market_plan_id": "uuid",
      "title": "도쿄 3박 4일 완벽 코스",
      "destination_region": "도쿄, 일본",
      "duration_nights": 3,
      "party_size": 2,
      "credit_price": 1,
      "author": {
        "user_id": "uuid",
        "nickname": "이상한 여우 8237",
        "avatar_url": "https://cdn.example.com/avatars/fox.png"
      },
      "cover_thumbnail_url": "https://cdn.example.com/places/shibuya.jpg",
      "highlight": "현지인만 아는 골목 맛집 5곳 포함",
      "place_count": 8,
      "view_count": 2341,
      "is_ota_verified": true,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### GET /market/plans/:market_plan_id/preview

플랜 마켓 미리보기. 크레딧 차감 없이 제목/소개/일부 장소만 반환.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| market_plan_id | string | 마켓 플랜 고유 ID |
| title | string | 마켓 노출 제목 |
| destination_region | string | 여행지 |
| duration_nights | integer | 숙박 일수 |
| party_size | integer | 여행 인원 수 |
| credit_price | integer | 열람에 필요한 크레딧 수 |
| author | object | 등록자 정보 |
| description | string | 플랜 소개 전문 |
| highlight | string | 한 줄 소개 |
| preview_places | array | 미리보기로 공개된 장소 목록 (1개) |
| preview_places[].place_id | string | 장소 고유 ID |
| preview_places[].canonical_name | string | 정규화된 장소명 |
| preview_places[].category | string | 장소 카테고리 |
| preview_places[].thumbnail_url | string | 장소 썸네일 URL |
| hidden_place_count | integer | 크레딧 차감 후 열람 가능한 나머지 장소 수 |
| view_count | integer | 누적 조회수 |
| is_purchased | boolean | 현재 로그인 사용자의 구매 여부. true면 크레딧 차감 없이 전체 열람 가능 |

```json
{
  "market_plan_id": "uuid",
  "title": "도쿄 3박 4일 완벽 코스",
  "destination_region": "도쿄, 일본",
  "duration_nights": 3,
  "party_size": 2,
  "credit_price": 1,
  "author": {
    "user_id": "uuid",
    "nickname": "이상한 여우 8237",
    "avatar_url": "https://cdn.example.com/avatars/fox.png"
  },
  "description": "실제로 다녀온 도쿄 여행 플랜이에요. OTA로 예약하고 다녀왔습니다.",
  "highlight": "현지인만 아는 골목 맛집 5곳 포함",
  "preview_places": [
    {
      "place_id": "uuid",
      "canonical_name": "시부야 스크램블 교차로",
      "category": "관광명소",
      "thumbnail_url": "https://cdn.example.com/places/shibuya.jpg"
    }
  ],
  "hidden_place_count": 7,
  "view_count": 2341,
  "is_purchased": false
}
```

---

### GET /market/plans/:market_plan_id

플랜 마켓 상세 전체 조회. 최초 조회 시 크레딧 1개 차감. 이미 구매한 경우 차감 없이 반환.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| market_plan_id | string | 마켓 플랜 고유 ID |
| title | string | 마켓 노출 제목 |
| destination_region | string | 여행지 |
| duration_nights | integer | 숙박 일수 |
| party_size | integer | 여행 인원 수 |
| author | object | 등록자 정보 |
| description | string | 플랜 소개 |
| highlight | string | 한 줄 소개 |
| pros | string | 여행 중 좋았던 점 |
| cons | string | 아쉬웠던 점 |
| tips | string | 추가로 하면 좋을 것 (선택 입력) |
| days | array | Day별 일정 목록 |
| days[].day_index | integer | 여행 일차 (1부터 시작) |
| days[].items | array | 해당 일차의 장소 목록 |
| days[].items[].place_id | string | 장소 고유 ID |
| days[].items[].canonical_name | string | 정규화된 장소명 |
| days[].items[].category | string | 장소 카테고리 |
| days[].items[].latitude | number | 위도 |
| days[].items[].longitude | number | 경도 |
| days[].items[].thumbnail_url | string | 장소 썸네일 URL |
| days[].items[].planned_duration_minutes | integer | 예상 체류 시간 (분) |
| days[].items[].sort_order | integer | 해당 일차 내 순서 |
| ota_booking_info | object | OTA 예약 인증 정보 |
| ota_booking_info.booked_at | string | OTA 예약 완료 날짜 (YYYY-MM-DD) |
| ota_booking_info.verified | boolean | 예약 인증 완료 여부 |
| view_count | integer | 누적 조회수 |
| created_at | string | 등록 일시 (ISO 8601) |

```json
{
  "market_plan_id": "uuid",
  "title": "도쿄 3박 4일 완벽 코스",
  "destination_region": "도쿄, 일본",
  "duration_nights": 3,
  "party_size": 2,
  "author": {
    "user_id": "uuid",
    "nickname": "이상한 여우 8237",
    "avatar_url": "https://cdn.example.com/avatars/fox.png"
  },
  "description": "실제로 다녀온 도쿄 여행 플랜이에요.",
  "highlight": "시부야·신주쿠·아사쿠사를 모두 담은 알찬 일정",
  "pros": "이동 동선이 짧아서 피로도가 낮았어요. 맛집 예약을 미리 하면 더 좋아요.",
  "cons": "아사쿠사는 오전 일찍 가야 사람이 적어요. 주말엔 혼잡했어요.",
  "tips": "스이카 카드를 미리 충전해두면 교통이 편해요.",
  "days": [
    {
      "day_index": 1,
      "items": [
        {
          "place_id": "uuid",
          "canonical_name": "시부야 스크램블 교차로",
          "category": "관광명소",
          "latitude": 35.659513,
          "longitude": 139.700440,
          "thumbnail_url": "https://cdn.example.com/places/shibuya.jpg",
          "planned_duration_minutes": 60,
          "sort_order": 1
        }
      ]
    }
  ],
  "ota_booking_info": {
    "booked_at": "2024-11-20",
    "verified": true
  },
  "view_count": 143,
  "created_at": "2024-12-01T10:00:00Z"
}
```

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| INSUFFICIENT_CREDITS | 402 | 크레딧 부족 |

---

### POST /market/plans

플랜 마켓 등록. OTA 예약 완료된 플랜만 등록 가능.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| itinerary_id | string | ✅ | 등록할 플랜 ID (OTA 예약 완료 상태여야 함) |
| title | string | ✅ | 마켓 노출 제목 (최대 50자) |
| description | string | ✅ | 플랜 소개 (최대 500자) |
| highlight | string | ✅ | 한 줄 요약 (최대 100자) |
| pros | string | ✅ | 좋았던 점 (최대 300자) |
| cons | string | ✅ | 아쉬웠던 점 (최대 300자) |
| tips | string |  | 추가로 하면 좋을 것 (최대 300자) |

```json
{
  "itinerary_id": "uuid",
  "title": "도쿄 3박 4일 완벽 코스",
  "description": "실제로 다녀온 도쿄 여행 플랜이에요.",
  "highlight": "시부야·신주쿠·아사쿠사를 모두 담은 알찬 일정",
  "pros": "이동 동선이 짧아서 피로도가 낮았어요.",
  "cons": "아사쿠사는 오전 일찍 가야 사람이 적어요.",
  "tips": "스이카 카드를 미리 충전해두면 편해요."
}
```

**Response 201** — 생성된 market_plan 객체 반환

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| OTA_NOT_VERIFIED | 422 | OTA 예약 미완료 플랜 등록 시도 |
| ALREADY_LISTED | 409 | 이미 마켓에 등록된 플랜 |

---

### DELETE /market/plans/:market_plan_id

플랜 마켓 등록 취소. 본인 등록 플랜만 가능. 이미 구매한 사용자의 열람 권한은 유지.

**Response 204**

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| FORBIDDEN | 403 | 타인 플랜 삭제 시도 |

---

## 14. 크레딧 / 광고 (Credits)

> 크레딧은 앱 내 재화. 광고 시청 또는 OTA 예약으로 적립. 플랜 마켓 열람 및 OTA 결제 시 사용.
> 

### 엔드포인트 목록

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| GET | /credits/me | 내 크레딧 잔액 조회 |
| GET | /credits/me/history | 크레딧 적립/차감 내역 |
| POST | /credits/ads/start | 광고 시청 시작 |
| POST | /credits/ads/complete | 광고 시청 완료 + 크레딧 적립 |

---

### GET /credits/me

내 크레딧 잔액 조회.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| balance | integer | 현재 사용 가능한 크레딧 잔액 |
| lifetime_earned | integer | 가입 이후 누적 적립 크레딧 총합 |
| lifetime_spent | integer | 가입 이후 누적 차감 크레딧 총합 |

```json
{
  "balance": 3,
  "lifetime_earned": 25,
  "lifetime_spent": 22
}
```

---

### GET /credits/me/history

크레딧 적립 / 차감 내역 조회.

**Query Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| type | string |  | earned / spent |
| limit | integer |  | 기본 20, 최대 50 |
| cursor | string |  | 페이지네이션 커서 |

**credit_type 종류**

| type | 설명 |
| --- | --- |
| ad_view | 광고 시청 적립 |
| ota_booking | OTA 예약 적립 |
| plan_sale | 내 플랜 구매됨 적립 |
| plan_purchase | 플랜 마켓 열람 차감 |
| ota_payment | OTA 결제 사용 차감 |

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| items | array | 내역 목록 |
| items[].history_id | string | 내역 고유 ID |
| items[].credit_type | string | 크레딧 종류 (위 credit_type 표 참조) |
| items[].amount | integer | 적립/차감 수량. 적립은 양수, 차감은 음수 |
| items[].balance_after | integer | 해당 트랜잭션 후 크레딧 잔액 |
| items[].description | string | 내역 설명 텍스트 |
| items[].created_at | string | 발생 일시 (ISO 8601) |
| next_cursor | string | 다음 페이지 커서. null이면 마지막 페이지 |

```json
{
  "items": [
    {
      "history_id": "uuid",
      "credit_type": "ad_view",
      "amount": 1,
      "balance_after": 4,
      "description": "광고 시청 보상",
      "created_at": "2024-12-01T10:00:00Z"
    },
    {
      "history_id": "uuid",
      "credit_type": "plan_purchase",
      "amount": -1,
      "balance_after": 3,
      "description": "플랜 열람 — 도쿄 3박 4일 완벽 코스",
      "created_at": "2024-12-01T11:00:00Z"
    }
  ],
  "next_cursor": "cursor_token"
}
```

---

### POST /credits/ads/start

광고 시청 시작. 서버에서 광고 토큰 발급. 광고 5회 시청 시 크레딧 1개 적립.

**Response 201**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| ad_session_id | string | 광고 세션 고유 ID. complete 호출 시 필요 |
| expires_at | string | 세션 만료 일시. 만료 전 complete 호출 필요 (ISO 8601) |
| viewed_today | integer | 오늘 시청 완료한 광고 수 (이번 건 미포함) |
| required_for_credit | integer | 크레딧 1개 적립에 필요한 총 시청 수 (5) |

```json
{
  "ad_session_id": "uuid",
  "expires_at": "2024-12-01T10:05:00Z",
  "viewed_today": 2,
  "required_for_credit": 5
}
```

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| AD_LIMIT_REACHED | 422 | 일일 광고 시청 한도 초과 |

---

### POST /credits/ads/complete

광고 시청 완료 처리. 5회 누적 시 크레딧 1개 자동 적립.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| ad_session_id | string | ✅ | 시청 시작 시 발급된 세션 ID |

```json
{ "ad_session_id": "uuid" }
```

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| viewed_today | integer | 오늘 시청 완료한 광고 수 (이번 건 포함) |
| required_for_credit | integer | 크레딧 1개 적립에 필요한 총 시청 수 (항상 5) |
| credit_earned | boolean | 이번 완료로 크레딧 1개가 적립됐는지 여부 |
| balance | integer | 적립 후 현재 크레딧 잔액 |

```json
{
  "viewed_today": 3,
  "required_for_credit": 5,
  "credit_earned": false,
  "balance": 3
}
```

> `credit_earned: true`이면 이번 완료로 크레딧 1개가 적립됨. 클라이언트는 잔액 UI를 갱신.
> 

**에러**

| code | HTTP | 설명 |
| --- | --- | --- |
| INVALID_AD_SESSION | 422 | 유효하지 않거나 만료된 세션 |
| AD_ALREADY_COMPLETED | 409 | 이미 완료 처리된 세션 |

---

## 15. 공개 공유 (Public Share)

> 비인증 접근 허용 🔓. 공유 링크로 진입한 비로그인 사용자용. 읽기 전용.
> 

### GET /public/itineraries/:share_token

공유된 플랜 조회. 편집 불가.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| itinerary_id | string | 플랜 고유 ID |
| title | string | 플랜 제목 |
| destination_region | string | 여행지 |
| start_date | string | 출발일 (YYYY-MM-DD) |
| end_date | string | 도착일 (YYYY-MM-DD) |
| party_size | integer | 여행 인원 수 |
| items | array | 일정 장소 목록 (`GET /itineraries/:itinerary_id`와 동일 구조) |

---

### GET /public/collections/:share_token

공유된 플레이스 조회. 편집 불가.

**Response 200**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| collection_id | string | 플레이스 고유 ID |
| name | string | 플레이스 이름 |
| visibility | string | 공개 범위 |
| places | array | 포함된 장소 목록 (`GET /collections/:collection_id/places`와 동일 구조) |