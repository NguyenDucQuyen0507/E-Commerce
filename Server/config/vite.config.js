const { createServer } = require("vite");
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
  server: {
    hmr: {
      server: createServer({
        middleware: [
          createProxyMiddleware({
            target: process.env.URL_SERVER, // Thay đổi thành URL của server thực tế
            changeOrigin: true,
            onProxyRes: (proxyRes) => {
              proxyRes.headers["Access-Control-Allow-Origin"] =
                process.env.CLIENT_URL;
              proxyRes.headers["Access-Control-Allow-Methods"] =
                "GET, POST, PATCH, DELETE, PUT";
              proxyRes.headers["Access-Control-Allow-Headers"] =
                "Origin, X-Requested-With, Content-Type, Accept, Authorization";
              proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
            },
          }),
        ],
      }),
    },
  },
};
