import Database from '../database/database';
import { PlaylistModel } from '../database/playlist/playlist.model';
import { SongModel } from '../database/song/song.model';
import crypto from 'crypto';
// @ts-expect-error
import { song_types } from '../settings.js';

export async function addSong(req: any, res: any, db: Database, debug: boolean): Promise<void> {
    const b: any = req.body;

    if (!b.title || !b.artist || !b.type || !b.length || !b.typeData) return badRequest(res, 'parameters missing');
    if (!song_types.includes(b.type)) return badRequest(res, 'type incorrect');
    if ((b.type === 'spotify' || b.type === 'youtube') && !b.typeData.id) return badRequest(res, 'typeData incorrect, id missing');
    if (b.type === 'mp3' && !b.typeData.fileName) return badRequest(res, 'typeData incorrect, fileName missing');

    if (debug) console.log('Trying to add a song: ', b);

    let alreadyInDatabase: boolean = false;

    if (b.type === 'spotify') {
        await SongModel.findBySpotifyID(b.typeData.id).then(data => {
            if (data.length !== 0) alreadyInDatabase = true;
        })
    }

    if (b.type === 'youtube') {
        await SongModel.findByYoutubeID(b.typeData.id).then(data => {
            if (data.length !== 0) alreadyInDatabase = true;
        })
    }

    if (!alreadyInDatabase) await SongModel.create({
        length: b.length || 0,
        title: b.title,
        artist: b.artist,
        type: b.type,
        songId: crypto.randomBytes(20).toString('hex'), // Generate a random ID
        typeData: b.typeData
    });
    else console.log('Song already in database');
    res.status(201).send('done')
}

function badRequest(res: any, reason: string): void {
    return res.status(400).send(`Bad Request: ${reason}`)
}

export async function newPlaylist(req: any, res: any, db: Database, debug: boolean): Promise<void> {
    const b: any = req.body;

    if (!b.name || !b.type || !b.user) badRequest(res, 'Parameters missing');

    if (debug) console.log('Creating a new playlist', b);

    await PlaylistModel.create({
        name: b.name,
        type: b.type,
        user: b.user,
        creators: [],
        dateCreated: new Date(),
        lastUpdated: new Date(),
        playlist: []
    });
    res.send('addPlaylist');
}