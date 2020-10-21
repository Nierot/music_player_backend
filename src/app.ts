import express from 'express';
// import * as socketIO from 'socket.io';
import { home } from './routes/home';
import { addSong, newPlaylist, addSongToPlaylist } from './routes/rest';
import Database from './database/database';
import bodyParser from 'body-parser';
import * as crypto from 'crypto';
import { createServer, Server } from 'http';
import { checkSpotifyCode, refreshSpotifyCode } from './routes/spotify';
import { pause, skip, previous, checkCode } from './routes/controller';
// @ts-expect-error
import { port, route, debug } from './settings.js';
// @ts-expect-error
import cors from 'cors';

// Create the express app and define middleware
const app = express();
const server = createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

// Connect to the database
const db: Database = new Database();
db.connect();

// Setup Socket.IO
const clients: Map<string, SocketIO.Socket> = new Map();
const io = require('socket.io')(8079);

io.on('connection', (socket: SocketIO.Socket) => {
    const id: string = crypto.randomBytes(2).toString('hex');
    clients.set(id, socket);
    io.emit('code', id);
    console.log(`New client ${id}`);
});

// Routes
app.get(route, home);
app.post(`${route}playlist/song`, async (req, res) => await addSongToPlaylist(req, res, db, debug));
app.post(`${route}playlist`, async (req, res) => await newPlaylist(req, res, db, debug));
app.post(`${route}song`, async (req, res) => await addSong(req, res, db, debug));
app.post(`${route}spotify`, async (req, res) => await checkSpotifyCode(req, res));
app.post(`${route}refresh`, async (req, res) => await refreshSpotifyCode(req, res));
app.post(`${route}controller/pause`, (req, res) => pause(req, res, clients));
app.post(`${route}controller/skip`, (req, res) => skip(req, res, clients));
app.post(`${route}controller/previous`, (req, res) => previous(req, res, clients));
app.post(`${route}controller/check`, (req, res) => checkCode(req, res, clients));


// Express things
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, going offline');
    db.disconnect();
})