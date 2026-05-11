#!/bin/bash
# 모든 서비스를 한 번에 시작하는 스크립트

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== 기존 프로세스 정리 ==="
pkill -f "expo start" 2>/dev/null
pkill -f "server/index" 2>/dev/null
pkill -f "qr-server" 2>/dev/null
sleep 2

echo "=== 공인 IP 감지 ==="
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null)
if [ -z "$PUBLIC_IP" ]; then
  echo "공인 IP 감지 실패"
  exit 1
fi
echo "IP: $PUBLIC_IP"

echo "=== 백엔드 서버 시작 (port 3000) ==="
cd "$PROJECT_DIR/server"
npx ts-node index.ts > /tmp/server-out.txt 2>&1 &
echo "Server PID: $!"
sleep 3

echo "=== QR 서버 시작 (port 8082) ==="
EXPO_IP="$PUBLIC_IP" node "$PROJECT_DIR/qr-server.js" > /tmp/qr-out.txt 2>&1 &
echo "QR server PID: $!"

echo "=== Expo Metro 시작 (port 8081) ==="
cd "$PROJECT_DIR"
REACT_NATIVE_PACKAGER_HOSTNAME="$PUBLIC_IP" \
API_URL="http://$PUBLIC_IP:3000" \
npx expo start --port 8081 --lan > /tmp/expo-out.txt 2>&1 &
echo "Metro PID: $!"

echo ""
echo "=== 서비스 목록 ==="
echo "  API:   http://$PUBLIC_IP:3000"
echo "  Metro: http://$PUBLIC_IP:8081"
echo "  QR:    http://$PUBLIC_IP:8082"
echo ""
echo "Expo Go QR 페이지: http://$PUBLIC_IP:8082"

wait
