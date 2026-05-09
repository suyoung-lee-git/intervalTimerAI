## Last Updated
2026-05-09

## Completed
- SYSTEM_PROMPT 강화: rationale/warmup/cooldown 텍스트에 숫자·단위 STRICTLY FORBIDDEN 명시
- services/timer.ts: startTimer 시작 시 즉시 첫 tick 발송 — idle phase 1초 깜빡임 제거
- server/index.ts: rationale 서버측 숫자 제거 regex 추가
- 사운드 옵션 (none/beep/tts), TTS 읽기 순서 (타이틀→내용→시간), 이모지 제거
- 종료 3초전 틱틱틱 소리 (work: tick.wav, rest: tick_rest.wav)

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
