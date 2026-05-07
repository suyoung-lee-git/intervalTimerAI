# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**intervalTimerAI** — AI가 사용자 상황(운동 목표, 체력 수준, 운동 종류 등)에 맞는 인터벌 타이머 구성을 추천해주는 모바일/웹 앱.

핵심 기능:
- 사용자 상황 입력 → Claude API가 운동 시간·휴식 시간·세트 수 추천
- 추천받은 타이머를 즉시 실행
- 타이머 실행 중 음성/진동 알림

## Tech Stack

- **Frontend**: React Native (Expo) + TypeScript
- **AI**: AWS Bedrock (`anthropic.claude-sonnet-4-6-20250514-v1:0`) — 인터벌 추천 생성
- **State**: Zustand
- **Navigation**: Expo Router (file-based)

## Commands

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (Expo Go 앱으로 확인)
npx expo start

# iOS 시뮬레이터
npx expo start --ios

# Android 에뮬레이터
npx expo start --android

# 타입 체크
npx tsc --noEmit

# 린트
npx eslint . --ext .ts,.tsx

# 테스트 실행
npm test

# 단일 테스트 파일 실행
npx jest path/to/test.test.ts
```

## Architecture

```
app/                  # Expo Router 페이지 (파일 = 라우트)
  index.tsx           # 홈 — 상황 입력 UI
  timer.tsx           # 타이머 실행 화면
components/           # 재사용 UI 컴포넌트
services/
  claude.ts           # Claude API 호출 — 인터벌 추천 생성
  timer.ts            # 타이머 로직 (interval, cleanup)
stores/
  timerStore.ts       # Zustand — 타이머 상태 (running, elapsed, sets)
  recommendStore.ts   # Zustand — AI 추천 결과 캐시
types/
  interval.ts         # IntervalPlan, WorkoutContext 타입 정의
```

## Claude API Integration (AWS Bedrock)

`services/claude.ts`가 AI 추천의 진입점. AWS Bedrock을 통해 Claude를 호출하며, 반드시 **prompt caching** 적용:

```typescript
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";

const client = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION, // 예: "us-east-1"
  // AWS 자격증명은 환경변수(AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)
  // 또는 IAM Role(권장)로 자동 주입됨
});

const response = await client.messages.create({
  model: "anthropic.claude-sonnet-4-6-20250514-v1:0",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "...",
      cache_control: { type: "ephemeral" }, // 시스템 프롬프트 캐싱
    },
  ],
  messages: [{ role: "user", content: "..." }],
});

// 응답은 { workSecs, restSecs, sets, rationale } 형태 JSON으로 받음
```

패키지: `npm install @anthropic-ai/bedrock-sdk`

환경변수 파일 `.env.local`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

IAM 권한: `bedrock:InvokeModel` 액션이 해당 모델 ARN에 허용되어 있어야 함.

## Development Session Continuity

세션이 끊겨도 작업을 이어받을 수 있도록 `.claude/SESSION.md` 파일로 진행 상황을 관리한다.

### 세션 시작 시 (매번 필수)

1. `.claude/SESSION.md` 파일이 존재하면 반드시 읽고 이전 컨텍스트를 파악한다.
2. `git status` 와 `git log --oneline -10` 으로 현재 코드 상태를 확인한다.
3. SESSION.md의 **Next** 항목부터 작업을 재개한다.

### 세션 종료 시 또는 중요한 작업 완료 후

`.claude/SESSION.md` 를 아래 형식으로 즉시 업데이트한다:

```markdown
## Last Updated
YYYY-MM-DD HH:MM

## Completed
- [완료된 작업 목록]

## In Progress
- [현재 진행 중인 작업과 현재 상태]
- 관련 파일: path/to/file.ts (어디까지 작업했는지)

## Next
- [다음에 해야 할 작업 목록, 우선순위 순]

## Decisions & Context
- [내린 설계 결정과 그 이유 — 코드만 봐서는 알 수 없는 것들]

## Blockers
- [막힌 부분이 있으면 기록]
```

### 규칙

- 파일 수정 전에 SESSION.md를 업데이트하지 말고, **의미 있는 단위 작업이 끝날 때마다** 업데이트한다.
- Completed 항목은 누적하지 않고 최근 3~5개만 유지한다 (git log가 상세 이력을 담당).
- `.claude/SESSION.md` 는 `.gitignore` 에 추가하지 않는다 — 팀원 간 공유 대상이다.

## Communication

사용자에게 질문하거나 확인을 요청할 때는 반드시 **한국어**로 한다.

## Working Mode

모든 작업은 기본적으로 **Plan 모드**로 시작한다. 코드를 바로 수정하지 말고, 먼저 변경할 내용·범위·순서를 계획으로 제시하고 사용자 승인 후 구현한다.

- 사용자가 명시적으로 "바로 해줘" / "그냥 해줘" 라고 하면 Plan 없이 진행 가능
- 계획 단계에서 영향받는 파일, 변경 이유, 예상 결과를 포함한다

## Code Validation (필수)

코드 수정 후 반드시 아래 순서로 검증을 완료해야 한다. 검증을 통과하지 못하면 작업이 완료된 것이 아니다.

```bash
# 1. 타입 체크
npx tsc --noEmit

# 2. 린트
npx eslint . --ext .ts,.tsx

# 3. 테스트
npm test
```

세 단계 모두 에러 없이 통과한 뒤에 SESSION.md를 업데이트하고 작업 완료로 간주한다.

## Key Conventions

- 타이머 tick은 `setInterval` 1초 단위, 컴포넌트 언마운트 시 반드시 `clearInterval`
- Claude 응답은 `JSON.parse` 전에 마크다운 코드블록 제거 필요 (`response.replace(/```json|```/g, "")`)
- `WorkoutContext` 타입을 Claude 프롬프트와 동기화 유지 — 타입 변경 시 프롬프트도 함께 수정
- Expo `expo-av` 또는 `expo-haptics`로 세트 전환 알림 처리
