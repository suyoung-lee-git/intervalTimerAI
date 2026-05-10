#!/bin/bash
# 모든 서비스를 한 번에 시작하는 스크립트

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== 기존 프로세스 정리 ==="
pkill -f "expo start" 2>/dev/null
pkill -f "localtunnel" 2>/dev/null
pkill -f "server/index" 2>/dev/null
pkill -f "qr-server" 2>/dev/null
sleep 2

echo "=== 백엔드 서버 시작 (port 3000) ==="
cd "$PROJECT_DIR/server"
npx ts-node index.ts > /tmp/server-out.txt 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 3

echo "=== localtunnel 시작 (intervaltimer-api.loca.lt) ==="
cd "$PROJECT_DIR"
npx localtunnel --port 3000 --subdomain intervaltimer-api > /tmp/lt-out.txt 2>&1 &
LT_PID=$!
sleep 6
grep "url is" /tmp/lt-out.txt && echo "Tunnel OK" || echo "Tunnel 시작 실패"

echo "=== QR 서버 시작 (port 8082) ==="
node "$PROJECT_DIR/qr-server.js" > /tmp/qr-out.txt 2>&1 &
echo "QR server PID: $!"

echo "=== Expo Metro 시작 (port 8081, tunnel) ==="
cd "$PROJECT_DIR"
npx expo start --port 8081 --tunnel 2>&1 &
echo "Metro PID: $!"

echo ""
echo "=== 서비스 목록 ==="
echo "  API:   https://intervaltimer-api.loca.lt"
echo "  Metro: http://localhost:8081 (tunnel)"
echo "  QR:    http://localhost:8082"
echo ""
echo "Expo Go QR: http://$(curl -s ifconfig.me 2>/dev/null || echo '<IP>'):8082"

wait
