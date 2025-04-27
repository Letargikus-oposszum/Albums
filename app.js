import express from 'express';
import cors from 'cors'; // <-- import the cors package
import router from './routes/routes.js';

const app = express();

// Enable CORS for all routes
app.use(cors());  // This allows any origin to access the backend

app.use(express.json());
app.use('/routes', router);

app.listen(3000, (req, res) => {
  console.log(`server runs`);
});
