import http from "node:http";
import { App } from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const app = new App();

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Connection", "keep-alive"); // Set the connection to keep-alive
    res.setHeader("Keep-Alive", "timeout=5, max=100");

    app.ApiController.handle(req, res);
  })
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
