import express from 'express';
import cors from 'cors';
import { sceneRouter } from './routes/scene'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/scene', sceneRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
