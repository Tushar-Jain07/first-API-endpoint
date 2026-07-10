const express = require("express");
const app = express();
const PORT = 3000;

// Endpoint 1 - returns info about this project
app.get("/api/info", (req, res) => {
  res.json({
    project: "FlyRank Internship - First API",
    author: "Tushar Jain",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint 2 - health check to see if server is running
app.get("/api/ping", (req, res) => {
  res.json({
    status: "ok",
    uptime_seconds: Math.floor(process.uptime()),
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
