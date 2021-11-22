import express from 'express';
import cors from 'cors';
import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import { getPlan, addPlanSubscription } from './controllers/plans.js';
import auth from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.get('/plans', auth, getPlan);
app.post('/plans', auth, addPlanSubscription);

export default app;
