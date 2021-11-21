import express from 'express';
import cors from 'cors';
import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import { getPlan, addPlanSubscription } from './controllers/plans.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.get('/plans', getPlan);
app.post('/plans', addPlanSubscription);

export default app;
