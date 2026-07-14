const express = require("express");
const app = express();
const PORT = 3000;

// ── In-memory "database" ────────────────────────────────────
let tasks = [
  { id: 1, title: "Learn Express basics", done: false },
  { id: 2, title: "Build a CRUD API", done: false },
  { id: 3, title: "Add Swagger UI", done: true },
];
let nextId = 4;

// ── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// ── Health ───────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ── Read all tasks ───────────────────────────────────────────
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ── Read one task ────────────────────────────────────────────
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  res.json(task);
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
