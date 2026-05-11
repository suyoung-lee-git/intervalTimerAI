## Last Updated
2026-05-11

## Completed
- ngrok 터널 제거 → 공인 IP 직접 접속 방식으로 전환 (start.sh, app.config.js, qr-server.js)
- stop.sh 추가 — 모든 서비스 한 번에 종료
- systemd 서비스 등록 — EC2 부팅 시 자동 시작 (intervaltimer.service)
- 폰에서 QR 스캔 후 앱 정상 동작 확인

## In Progress
- 없음

## Next
- 앱 완성도 개선 (로딩 UX 등)
- 프로덕션 배포 (EAS Build)

## Decisions & Context
- warmupSecs/cooldownSecs가 0이면 해당 phase 건너뜀
- 운동 이름은 (currentSet - 1) % exercises.length 순환
- API 접근 구조: 앱 → http://<PUBLIC_IP>:3000 (직접 접속)
  - ngrok 공용 토큰(ERR_NGROK_108 — 세션 한도 초과) 문제로 터널 방식 폐기
  - AWS 보안그룹 8081(Metro), 3000(API), 8082(QR) 포트 오픈 전제
- 서버 시작: ./start.sh (공인 IP 자동 감지, 각 서비스에 주입)
- 서버 종료: ./stop.sh
- systemd: sudo cp intervaltimer.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable intervaltimer
  - 로그 확인: journalctl -u intervaltimer -f

## Blockers
- 없음
