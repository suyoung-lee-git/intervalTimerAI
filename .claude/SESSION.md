## Last Updated
2026-05-11

## Completed
- ngrok 터널 제거 → 공인 IP 직접 접속 방식으로 전환
- start.sh: 서버 시작 시 공인 IP 자동 감지, localtunnel/ngrok 의존 제거
- qr-server.js: EXPO_IP 환경변수로 동적 QR URL 생성
- app.config.js: apiUrl 기본값을 localhost:3000으로 변경 (API_URL 환경변수로 주입)

## In Progress
- 없음

## Next
- 앱 완성도 개선 (로딩 UX 등)
- 프로덕션 배포 (EAS Build / 서버 PM2 설정)

## Decisions & Context
- warmupSecs/cooldownSecs가 0이면 해당 phase 건너뜀
- 운동 이름은 (currentSet - 1) % exercises.length 순환
- API 접근 구조: 앱 → http://<PUBLIC_IP>:3000 (직접 접속)
  - ngrok 공용 토큰(ERR_NGROK_108) 문제로 터널 방식 폐기
  - AWS 보안그룹 8081(Metro), 3000(API), 8082(QR) 포트 오픈 전제
- 서버 시작: 프로젝트 루트에서 ./start.sh 실행
  - start.sh가 curl ifconfig.me로 공인 IP 감지 후 각 서비스에 주입

## Blockers
- 없음
