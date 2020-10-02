import express from 'express';
import { home } from './routes/home';
import { addSong, newPlaylist } from './routes/rest';
import Database from './database/database';
import bodyParser from 'body-parser';
// @ts-expect-error
import { port, route } from './settings.js';

// Create the express app and define middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database
const db: Database = new Database();
db.connect();

// Routes
app.get(route, home);
app.post(`${route}playlist`, async (req, res) => await newPlaylist(req, res, db));
app.post(`${route}song`, async (req, res) => await addSong(req, res, db));


// Express things
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, going offline');
    db.disconnect();
})