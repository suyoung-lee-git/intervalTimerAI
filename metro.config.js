const { getDefaultConfig } = require("expo/metro-config");
const http = require("http");

const config = getDefaultConfig(__dirname);

// /api/* 요청을 로컬 Express 서버(port 3000)로 프록시
config.server = {
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith("/api/")) {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          const options = {
            hostname: "localhost",
            port: 3000,
            path: req.url,
            method: req.method,
            headers: { ...req.headers, host: "localhost:3000" },
          };
          const proxyReq = http.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
          });
          proxyReq.on("error", (err) => {
            console.error("[proxy error]", err.message);
            res.writeHead(502);
            res.end(JSON.stringify({ error: "API 서버 연결 실패" }));
          });
          if (body) proxyReq.write(body);
          proxyReq.end();
        });
      } else {
        middleware(req, res, next);
      }
    };
  },
};

module.exports = config;
