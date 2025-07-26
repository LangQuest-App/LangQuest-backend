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
    console.log("hii")
    res.send('Hello, World!');
});
app.use('/scene', sceneRouter);
app.use('/lesson', lessonRouter);
app.use('/userResponse', userResponseRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

