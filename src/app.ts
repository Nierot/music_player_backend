import express from 'express';
// import * as socketIO from 'socket.io';
import { home } from './routes/home';
import { addSong, newPlaylist, addSongToPlaylist, playlistExists, getAllPublicLists, getSongInfo, getOwnPlaylist } from './routes/rest';
import Database from './database/database';
import bodyParser from 'body-parser';
import * as crypto from 'crypto';
import { createServer } from 'http';
import { checkSpotifyCode, refreshSpotifyCode } from './routes/spotify';
import { pause, skip, previous, checkCode } from './routes/controller';
// @ts-expect-error
import { port, route, debug } from './settings.js';
// @ts-expect-error
import cors from 'cors';
import { finished } from './routes/queue';

// Create the express app and define middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

// Connect to the database
const db: Database = new Database();
db.connect();

// Routes
app.get(route, home);
app.post(`${route}playlist/song`, async (req, res) => await addSongToPlaylist(req, res));
app.post(`${route}playlist/exists`, async (req, res) => await playlistExists(req, res));
app.get(`${route}playlist/all`, async (req, res) => await getAllPublicLists(req, res));
app.post(`${route}playlist`, async (req, res) => await newPlaylist(req, res));
app.get(`${route}playlist`, async (req, res) => await getOwnPlaylist(req, res));
app.get(`${route}song`, async (req, res) => await getSongInfo(req, res));
app.post(`${route}song`, async (req, res) => await addSong(req, res));
app.post(`${route}spotify`, async (req, res) => await checkSpotifyCode(req, res));
app.post(`${route}refresh`, async (req, res) => await refreshSpotifyCode(req, res));
app.post(`${route}controller/pause`, (req, res) => pause(req, res, clients));
app.post(`${route}controller/skip`, (req, res) => skip(req, res, clients));
app.post(`${route}controller/previous`, (req, res) => previous(req, res, clients));
app.post(`${route}controller/check`, (req, res) => checkCode(req, res, clients));


// Express things
const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

// Setup Socket.IO
const clients: Map<string, SocketIO.Socket> = new Map();
const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket: SocketIO.Socket) => {
    const id: string = crypto.randomBytes(2).toString('hex');
    clients.set(id, socket);
    io.emit('code', id);
    io.on('finished', finished);
    console.log(`New client ${id}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, going offline');
    db.disconnect();
})