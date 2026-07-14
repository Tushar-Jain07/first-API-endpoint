const express = require("express");
const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

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

// ── Create a task ────────────────────────────────────────────
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validate: title must exist and be a non-empty string
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    done: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
