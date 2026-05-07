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
- 첫 커밋 완료 (42656b6)

## In Progress
- 없음

## Next
- AWS 키 설정 및 앱 실행 (아래 순서로 진행)
  1. `! cp .env.local.example .env.local` 실행 후 .env.local에 AWS 키 직접 입력
  2. app.json → app.config.js 전환 (dotenv로 .env.local 로드)
  3. services/claude.ts에서 process.env → Constants.expoConfig.extra 로 변경
  4. npx expo start 실행
- 홈 화면 UI 개선 (운동 종류/체력 수준 선택 버튼)
- 타이머 화면 UI 개선 (진행률 원형 게이지)
- 빌드 & 실기기 테스트

## Decisions & Context
- AWS Bedrock 사용 (직접 Anthropic API 대신) — 사용자 요구사항
- Expo Router 사용 — 파일 기반 라우팅으로 화면 추가가 단순함
- Zustand 사용 — Redux 대비 보일러플레이트 최소화, 타이머처럼 잦은 업데이트에 적합
- jest-expo 대신 ts-jest 사용 — expo winter runtime이 node 환경에서 충돌, 순수 TS 서비스 테스트에는 ts-jest가 적합
- Zustand 액션을 useEffect deps에 포함 — 안정 참조이므로 무한 루프 없음
- eslint.config.js (flat config) 사용 — ESLint v10이 기본으로 요구
- AWS 키는 app.config.js + Constants.expoConfig.extra 방식으로 주입 예정 (보안상 process.env 직접 사용 불가)

## Blockers
- 없음
