import { Router } from "express";
import { searchYouTubeVideo } from "../services/youtube.service.js";

const router = Router();

// GET /api/music/youtube?q=query
router.get("/youtube", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: "Query is required" });

    const video = await searchYouTubeVideo(q);
    return res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error("[/api/music/youtube]", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;