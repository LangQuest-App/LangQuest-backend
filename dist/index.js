"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const scene_1 = require("./routes/scene");
const lesson_1 = __importDefault(require("./routes/lesson"));
const userResponse_1 = require("./routes/userResponse");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    console.log("Health check");
    res.json({
        message: 'LangQuest Backend API is running!',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.use('/scene', scene_1.sceneRouter);
app.use('/lesson', lesson_1.default);
app.use('/userResponse', userResponse_1.userResponseRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
