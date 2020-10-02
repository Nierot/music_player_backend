import express from 'express';
const app = express();
import { home } from './routes/home';
// @ts-expect-error
import { port, route } from './settings.js';

app.get(route, home);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));