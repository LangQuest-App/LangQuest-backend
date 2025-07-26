import express from 'express';
import cors from 'cors';
import { sceneRouter } from './routes/scene'
import lessonRouter from "./routes/lesson"
import { userResponseRouter } from './routes/userResponse'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Health check")
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
app.use('/scene', sceneRouter);
app.use('/lesson', lessonRouter);
app.use('/userResponse', userResponseRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

