## Last Updated
2026-05-09

## Completed
- 준비운동/정리운동 타이머 단계 추가 (warmup→work→rest×sets→cooldown 흐름)
- 타이머 화면에 현재 운동명 표시 (work phase: 운동명 순환, warmup/cooldown/rest: 텍스트)
- CircularGauge warmup(노랑)·cooldown(파랑) 색상 추가
- types/interval.ts: warmupSecs, cooldownSecs 필드 추가
- server/index.ts: SYSTEM_PROMPT에 warmupSecs·cooldownSecs 반환 추가

## In Progress
- 없음

## Next
- git 커밋 & push
- 앱 완성도 개선 (로딩 UX, 에러 처리 등)
- 프로덕션 배포 (EAS Build / 서버 PM2 설정)

## Decisions & Context
- warmupSecs/cooldownSecs가 0이면 해당 phase 건너뜀 (서버 응답이 0을 반환해도 안전하게 동작)
- 운동 이름은 (currentSet - 1) % exercises.length 순환 — 세트 수 > 운동 수여도 안전

## Blockers
- 없음

## Web 테스트 환경
- npx expo start --web --port 8081 로 실행
- http://3.34.178.155:8081 에서 UI 확인 가능 (AWS 보안그룹 8081 포트 오픈 필요)
- AnthropicBedrock 클라이언트를 lazy 초기화(getClient 함수)로 변경 — 브라우저 환경에서 앱 시작 시 에러 방지
  (AI 호출은 모바일에서만 정상 동작, 웹은 UI 확인용)
