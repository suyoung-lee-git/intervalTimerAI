#!/bin/bash
# 모든 서비스 종료

echo "=== 서비스 종료 ==="

pkill -f "expo start"  2>/dev/null && echo "Metro 종료" || echo "Metro: 실행 중 아님"
pkill -f "ts-node"     2>/dev/null && echo "백엔드 종료" || echo "백엔드: 실행 중 아님"
pkill -f "qr-server"  2>/dev/null && echo "QR 서버 종료" || echo "QR 서버: 실행 중 아님"

# 포트 잔여 프로세스 강제 정리
fuser -k 3000/tcp 2>/dev/null
fuser -k 8081/tcp 2>/dev/null
fuser -k 8082/tcp 2>/dev/null

echo "완료"
