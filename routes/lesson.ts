import { Router } from "express";
import { generateCourseWithTTS } from "../controllers/lesson-controller/generate-lesson";
import getLessonsOfUser from "../controllers/lesson-controller/get-lessons";

const router = Router();
// dummy data to simulate
// {
// "userId":"id-id",
// "aim":"Travel",
// "current_experience":"Intermediate",
// "language_to_learn":"Hindi",
// "native_lang":"English",
// "prefered_way": ""
// }

router.post("/generate", async (req, res) => {
  const data = req.body;
  try {
    const response = await generateCourseWithTTS(data);
    return res.json({
      status: 200,
      data: response
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: err });
  }
});
router.get("/get/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const response = await getLessonsOfUser(id);
    return res.json({
      status: 200,
      data: response
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: err });
  }
});

export default router;
