import express from 'express';
import { sceneRouter } from './routes/scene'

const app = express();
app.use(express.json());

app.use('/scene', sceneRouter);

app.listen(4000, () => {
  console.log("Server is running at port 4000");
})