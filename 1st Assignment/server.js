const express = require("express");
const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// ── In-memory "database" ────────────────────────────────────
const SEED_TASKS = [
  { id: 1, title: "Learn Express basics", done: false },
  { id: 2, title: "Build a CRUD API", done: false },
  { id: 3, title: "Add Swagger UI", done: true },
];

let tasks = SEED_TASKS.map((t) => ({ ...t }));
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

// ── Stats ────────────────────────────────────────────────────
app.get("/stats", (req, res) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  res.json({ total, done, open: total - done });
});

// ── Read all tasks (with optional filtering & search) ────────
app.get("/tasks", (req, res) => {
  let result = tasks;

  // Filter by done status: ?done=true or ?done=false
  if (req.query.done !== undefined) {
    const isDone = req.query.done === "true";
    result = result.filter((t) => t.done === isDone);
  }

  // Search by title: ?search=keyword
  if (req.query.search) {
    const keyword = req.query.search.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(keyword));
  }

  res.json(result);
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

// ── Update a task ────────────────────────────────────────────
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body;

  // At least one valid field must be provided
  if (title === undefined && done === undefined) {
    return res
      .status(400)
      .json({ error: "Provide at least 'title' or 'done' to update" });
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title must be a non-empty string" });
    }
    task.title = title.trim();
  }

  // Validate done if provided
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "'done' must be a boolean" });
    }
    task.done = done;
  }

  res.json(task);
});

// ── Delete a task ────────────────────────────────────────────
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ── Reset (restore seed data) ────────────────────────────────
app.post("/reset", (req, res) => {
  tasks = SEED_TASKS.map((t) => ({ ...t }));
  nextId = 4;
  res.json({ message: "Tasks reset to defaults", tasks });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
