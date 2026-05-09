# 백엔드 API 서버 추가

> 목적: @anthropic-ai/bedrock-sdk는 Node.js 전용이라 React Native에서 실행 불가.
> 앱 → Express 서버 → Bedrock 구조로 변경.

| 상태 | 작업 |
|------|------|
| ✅ | server/package.json 생성 |
| ✅ | server/tsconfig.json 생성 |
| ✅ | server/index.ts 구현 (Express + Bedrock) |
| ✅ | services/claude.ts 변경 (Bedrock SDK → fetch) |
| ✅ | app.config.js에 apiUrl 추가 |
| ✅ | tsc / eslint / test 검증 |
| ✅ | 서버 실행 및 curl 테스트 |
