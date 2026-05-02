import { Router } from "express";
import multer from "multer";
import { analyzeNatureWithLLM } from "../services/nature.service.js";
import { parseImage } from "../utils/fileParser.js";
import { validateImageInput } from "../utils/validators.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"), false);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const validationError = validateImageInput(req.file);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const filePart = parseImage(req.file.buffer, req.file.mimetype);
    const result   = await analyzeNatureWithLLM([filePart]);

    return res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error("[/api/nature]", error.message);
    return res.status(500).json({ success: false, error: error.message || "Processing error" });
  }
});

export default router;