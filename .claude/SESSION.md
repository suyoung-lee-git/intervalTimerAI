## Last Updated
2026-05-07

## Completed
- CLAUDE.md 초안 작성 (프로젝트 개요, 기술 스택, 아키텍처)
- AWS Bedrock 연동 방식으로 변경
- 개발 세션 이어받기 시스템 구축
- 프로젝트 초기화 완료 (Expo + TypeScript + Zustand + Bedrock SDK)
- 스켈레톤 파일 전체 생성 (app/, services/, stores/, types/)
- ESLint + ts-jest 설정 완료
- tsc / eslint / jest 검증 전부 통과

## In Progress
- 없음

## Next
- 홈 화면 UI 개선 (운동 종류/체력 수준 드롭다운 or 선택 버튼)
- 타이머 화면 UI 개선 (진행률 원형 게이지 등)
- .env.local 실제 AWS 키 설정 후 Bedrock 연동 E2E 테스트
- 빌드 & 실기기 테스트

## Decisions & Context
- AWS Bedrock 사용 (직접 Anthropic API 대신) — 사용자 요구사항
- Expo Router 사용 — 파일 기반 라우팅으로 화면 추가가 단순함
- Zustand 사용 — Redux 대비 보일러플레이트 최소화, 타이머처럼 잦은 업데이트에 적합
- jest-expo 대신 ts-jest 사용 — expo winter runtime이 node 환경에서 충돌, 순수 TS 서비스 테스트에는 ts-jest가 적합
- Zustand 액션을 useEffect deps에 포함 — 안정 참조이므로 무한 루프 없음
- eslint.config.js (flat config) 사용 — ESLint v10이 기본으로 요구

## Blockers
- 없음
