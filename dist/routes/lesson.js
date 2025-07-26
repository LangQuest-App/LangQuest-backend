"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_lesson_1 = require("../controllers/lesson-controller/generate-lesson");
const get_lessons_1 = __importDefault(require("../controllers/lesson-controller/get-lessons"));
const update_mistakes_1 = require("../controllers/lesson-controller/update_mistakes");
const router = (0, express_1.Router)();
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
        const response = await (0, generate_lesson_1.generateCourseWithTTS)(data);
        return res.json({
            status: 200,
            data: response
        });
    }
    catch (err) {
        return res.status(500).json({ status: "error", message: "Internal server error", error: err });
    }
});
router.post("/update", async (req, res) => {
    const data = req.body;
    console.log(data.lesson_id);
    try {
        const response = await (0, update_mistakes_1.updateMistakesandStatus)(data);
        console.log(response);
        return res.json({
            status: 200,
            data: response
        });
    }
    catch (err) {
        return res.status(500).json({ status: "error", message: "Internal server error", error: err });
    }
});
router.get("/get/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await (0, get_lessons_1.default)(id);
        return res.json({
            status: 200,
            data: response
        });
    }
    catch (err) {
        return res.status(500).json({ status: "error", message: "Internal server error", error: err });
    }
});
exports.default = router;
