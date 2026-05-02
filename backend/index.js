import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import natureRouter from "./routes/nature.routes.js";
import musicRouter from "./routes/music.routes.js";

const app = express();

app.use(
  cors({
    origin: "https://nature-flow.onrender.com", // hardcode for now
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/nature", natureRouter);
app.use("/api/music", musicRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
