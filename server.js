const express = require("express");
const cors = require("cors");
const path = require("path");
const memeRoutes = require("./routes/memeRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/memes", memeRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});