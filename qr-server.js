const http = require('http');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interval Timer AI</title>
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #111;
      color: #fff;
      font-family: sans-serif;
    }
    h1 { font-size: 1.4rem; margin-bottom: 8px; }
    p { color: #aaa; margin-bottom: 24px; font-size: 0.95rem; }
    #qrcode canvas, #qrcode img { border-radius: 12px; }
    .url { margin-top: 20px; font-size: 0.85rem; color: #888; }
  </style>
</head>
<body>
  <h1>Interval Timer AI</h1>
  <p>아래 QR 코드를 스캔하여 앱에 접속하세요</p>
  <div id="qrcode"></div>
  <div class="url">exp://f6x5xuo-anonymous-8081.exp.direct</div>
  <script>
    new QRCode(document.getElementById("qrcode"), {
      text: "exp://f6x5xuo-anonymous-8081.exp.direct",
      width: 240,
      height: 240,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });
  </script>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(8082, () => {
  console.log('QR server running on port 8082');
});
