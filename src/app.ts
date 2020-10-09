import express from 'express';
import { home } from './routes/home';
import { addSong, newPlaylist, addSongToPlaylist } from './routes/rest';
import Database from './database/database';
import bodyParser from 'body-parser';
import { checkSpotifyCode, refreshSpotifyCode } from './routes/spotify';
// @ts-expect-error
import { port, route, debug } from './settings.js';
// @ts-expect-error
import cors from 'cors';

// Create the express app and define middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Connect to the database
const db: Database = new Database();
db.connect();

// Routes
app.get(route, home);
app.post(`${route}playlist/song`, async (req, res) => await addSongToPlaylist(req, res, db, debug));
app.post(`${route}playlist`, async (req, res) => await newPlaylist(req, res, db, debug));
app.post(`${route}song`, async (req, res) => await addSong(req, res, db, debug));
app.post(`${route}spotify`, async (req, res) => await checkSpotifyCode(req, res));
app.post(`${route}refresh`, async (req, res) => await refreshSpotifyCode(req, res));


// Express things
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, going offline');
    db.disconnect();
})