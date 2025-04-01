import express from 'express';
import cors from 'cors';

const app = express();
const port = 9000;
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});