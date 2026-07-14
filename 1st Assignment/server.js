const express = require("express");
const app = express();
const PORT = 3000;

// Root endpoint — describes this API
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// Health check — is the server alive?
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
