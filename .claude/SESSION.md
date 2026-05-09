## Last Updated
2026-05-09

## Completed
- 백엔드 API 서버 추가 (server/index.ts — Express + Claude 3 Haiku)
- 홈/타이머 UI 개선 (칩 버튼, SVG 원형 게이지)
- AI 추천 결과 상세화: exercises, warmup, cooldown, estimatedCalories 추가
- app/plan.tsx 신규 생성 (추천 결과 상세 화면)
- 플로우 변경: 홈 → 추천 결과(plan) → 타이머

## In Progress
- 없음

## Next
- git 커밋
- 앱 완성도 개선 (로딩 UX, 에러 처리 등)
- 프로덕션 배포 (EAS Build / 서버 PM2 설정)

## Decisions & Context
- AnthropicBedrock 생성자 오버로드 타입 제약으로 키 유무에 따라 분기 처리
  (awsAccessKey + awsSecretKey 동시 제공 or 둘 다 생략 — 하나만 제공은 타입 에러)
- react-native-svg 설치 시 npm peer dependency 충돌 → .npmrc에 legacy-peer-deps=true 추가
- CircularGauge: phaseTotalSecs(현재 단계 총 시간)를 timer.ts tick에 추가해서 진행률 계산

## Blockers
- 없음

## Web 테스트 환경
- npx expo start --web --port 8081 로 실행
- http://3.34.178.155:8081 에서 UI 확인 가능 (AWS 보안그룹 8081 포트 오픈 필요)
- AnthropicBedrock 클라이언트를 lazy 초기화(getClient 함수)로 변경 — 브라우저 환경에서 앱 시작 시 에러 방지
  (AI 호출은 모바일에서만 정상 동작, 웹은 UI 확인용)
