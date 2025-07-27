import { getMistakesOfLesson, getAllMistakes } from "../controllers/lesson-controller/get-mistakes";
import { Router } from "express";
import { generateCourseWithTTS } from "../controllers/lesson-controller/generate-lesson";
import getLessonsOfUser from "../controllers/lesson-controller/get-lessons";
import { updateMistakesandStatus } from "../controllers/lesson-controller/update_mistakes";

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
router.post("/update", async (req, res) => {
  const data = req.body
  console.log(data.lesson_id)
  try {
    const response = await updateMistakesandStatus(data);
    console.log(response)
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

router.get("/:id/get-mistake", async (req, res) => {
  const lessonId = req.params.id;
  try {
    const mistakes = await getMistakesOfLesson(lessonId);
    return res.json({ status: 200, data: mistakes });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: err });
  }
});

router.get("/get-all-mistakes", async (req, res) => {
  try {
    const mistakes = await getAllMistakes();
    return res.json({ status: 200, data: mistakes });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: err });
  }
});
export default router;
