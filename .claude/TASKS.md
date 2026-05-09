# AI 추천 결과 상세화

> 목적: 세트별 운동 목록, 운동 방법/팁, 준비운동/정리운동, 예상 칼로리 추가.
> 홈 → 추천 결과 화면(plan.tsx) → 타이머 순서로 플로우 변경.

| 상태 | 작업 |
|------|------|
| ✅ | types/interval.ts — Exercise 타입 및 IntervalPlan 필드 추가 |
| ✅ | server/index.ts — SYSTEM_PROMPT 확장 |
| ✅ | app/plan.tsx — 추천 결과 상세 화면 신규 생성 |
| ✅ | app/_layout.tsx — plan 라우트 추가 |
| ✅ | app/index.tsx — router.push("/plan")으로 변경 |
| ✅ | tsc / eslint / test 검증 |
| ✅ | 서버 재시작 및 curl 테스트 |
