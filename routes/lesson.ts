import { Router } from "express";
import { generateCourseWithTTS } from "../controllers/lesson-controller/generate-lesson";

const router = Router();

router.post("/generate", async (req, res) => {
  const data = req.body;
  try {
    const response = await generateCourseWithTTS(data);
    return res.json({
      status: "success",
      data: response
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: err });
  }
});

export default router;
