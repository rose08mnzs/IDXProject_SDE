require("dotenv").config();

const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const propertiesRoutes = require("./routes/properties");

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    if (process.env.NODE_ENV === "test") return;
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

app.use("/api/health", healthRoutes);
app.use("/api/properties", propertiesRoutes);

module.exports = app;