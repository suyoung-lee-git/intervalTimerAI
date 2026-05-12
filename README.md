# intervalTimerAI

> AI가 당신의 운동 목표에 맞는 인터벌 타이머를 설계해 드립니다.  
> AI-powered interval timer that designs a workout plan tailored to your goals.

---

## 주요 기능 / Features

- **AI 추천** — 운동 종류·체력 수준·목표 시간을 입력하면 Claude가 최적의 운동·휴식 구성을 설계  
  **AI Recommendation** — Input workout type, fitness level, and duration; Claude designs the optimal work/rest configuration
- **즉시 실행** — 추천받은 플랜을 바로 타이머로 실행  
  **Instant Start** — Launch the recommended plan directly as a running timer
- **음성·진동 알림** — 세트 전환 시 소리와 햅틱 피드백  
  **Audio & Haptic Alerts** — Sound and haptic feedback on set transitions
- **6가지 운동 모드** — HIIT / 타바타 / 서킷 / 근력 / 유산소 / 커스텀  
  **6 Workout Modes** — HIIT / Tabata / Circuit / Strength / Cardio / Custom

---

## 기술 스택 / Tech Stack

| 영역 / Layer | 기술 / Technology |
|---|---|
| Frontend | React Native (Expo) + TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Backend | Node.js + Express + ts-node |
| AI | AWS Bedrock — `anthropic.claude-3-haiku-20240307-v1:0` |
| Audio | expo-av, expo-haptics, expo-speech |

---

## 아키텍처 / Architecture

```
[Expo Go 앱 / App]
       │  HTTP POST /recommend
       ▼
[Express 서버 / Server  :3000]
       │  AWS Bedrock API
       ▼
[Claude 3 Haiku  (AWS Bedrock)]
       │  JSON (workSecs, restSecs, sets, exercises …)
       ▼
[플랜 확인 화면 → 타이머 실행 / Plan Screen → Timer]
```

---

## 시작하기 / Getting Started

### 사전 요구사항 / Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) 앱 (iOS / Android)
- AWS 계정 및 Bedrock 접근 권한 (`bedrock:InvokeModel`)

### 환경변수 설정 / Environment Variables

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 AWS 자격증명을 입력합니다.  
Open `.env.local` and fill in your AWS credentials.

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

> IAM 정책에 `bedrock:InvokeModel` 액션이 허용되어 있어야 합니다.  
> The IAM policy must allow the `bedrock:InvokeModel` action on the Haiku model ARN.

### 설치 / Install

```bash
# 프론트엔드 의존성 / Frontend dependencies
npm install

# 백엔드 의존성 / Backend dependencies
cd server && npm install && cd ..
```

---

## 서버 실행 / Running the Server

### 로컬 개발 / Local Development

```bash
# 백엔드 + Expo Metro 한 번에 시작
./start.sh

# 종료
./stop.sh
```

`start.sh`는 공인 IP를 자동으로 감지하여 각 서비스에 주입합니다.  
`start.sh` auto-detects the public IP and injects it into each service.

| 서비스 / Service | 포트 / Port | 설명 |
|---|---|---|
| Express API | 3000 | Claude 호출 엔드포인트 |
| Expo Metro | 8081 | React Native 번들러 |
| QR 서버 / QR Server | 8082 | Expo Go 연결용 QR 페이지 |

Expo Go로 앱을 실행하려면 `http://<서버IP>:8082` 에 접속해 QR을 스캔하세요.  
To run on Expo Go, open `http://<server-ip>:8082` and scan the QR code.

### EC2 자동 시작 / EC2 Auto-start (systemd)

```bash
sudo cp intervaltimer.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now intervaltimer

# 로그 확인 / View logs
journalctl -u intervaltimer -f
```

---

## 앱 화면 흐름 / Screen Flow

```
홈 화면 (Home)
 ├─ 운동 종류 선택  (HIIT / 타바타 / 서킷 / 근력 / 유산소 / 커스텀)
 ├─ 체력 수준 선택  (초급 / 중급 / 고급)
 ├─ 목표 시간 입력  (분)
 ├─ 오늘의 목표 입력  (자유 텍스트)
 └─ [AI 추천 받기] 버튼
         │
         ▼
플랜 화면 (Plan)
 ├─ 워밍업 / 운동 / 휴식 / 쿨다운 구성 표시
 ├─ 추천 운동 목록 + 동작 팁
 ├─ AI 추천 이유 (rationale)
 └─ [타이머 시작] 버튼
         │
         ▼
타이머 화면 (Timer)
 ├─ 원형 게이지로 남은 시간 시각화
 ├─ 현재 페이즈 (워밍업 / 운동 / 휴식 / 쿨다운)
 ├─ 세트 진행 상황
 └─ 세트 전환 시 음성·진동 알림
```

---

## 개발 명령어 / Dev Commands

```bash
# 타입 체크 / Type check
npx tsc --noEmit

# 린트 / Lint
npx eslint . --ext .ts,.tsx

# 테스트 / Test
npm test
```

---

## 프로젝트 구조 / Project Structure

```
intervalTimerAI/
├── app/                  # Expo Router 페이지 (파일 = 라우트)
│   ├── index.tsx         # 홈 — 상황 입력 UI
│   ├── plan.tsx          # 플랜 확인 화면
│   └── timer.tsx         # 타이머 실행 화면
├── components/
│   └── CircularGauge.tsx # 원형 타이머 게이지
├── server/
│   └── index.ts          # Express 서버 + Claude API 호출
├── services/
│   ├── claude.ts         # 클라이언트 측 API 호출
│   └── timer.ts          # 타이머 로직 (setInterval / clearInterval)
├── stores/
│   ├── timerStore.ts     # Zustand — 타이머 상태
│   └── recommendStore.ts # Zustand — AI 추천 결과 캐시
├── types/
│   └── interval.ts       # IntervalPlan, WorkoutContext 타입
├── start.sh              # 전체 서비스 시작 스크립트
├── stop.sh               # 전체 서비스 종료 스크립트
└── intervaltimer.service # systemd 유닛 파일
```

---

## 라이선스 / License

MIT
