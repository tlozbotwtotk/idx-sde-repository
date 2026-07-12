require("dotenv").config();

const express = require("express");
const cors = require("cors");
const database = require("./connection");
const properties = require("./properties_route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await database.query("SELECT 1");

    return res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      database: "disconnected",
      message: err.message
    });
  }
});

app.use("/api/properties", properties);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});