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
        songId: crypto.randomBytes(6).toString('base64'), // Generate a random ID
        typeId: b.id
    }).then(data => res.status(201).send(data.songId))
    else {
        res.status(200).send('ok');
        console.log('Song already in database');
    }
}

function badRequest(res: any, reason: string): void {
    return res.status(400).send(`Bad Request: ${reason}`)
}

export async function newPlaylist(req: any, res: any, db: Database, debug: boolean): Promise<void> {
    const b: any = req.body;

    if (!b.name || !b.type || !b.user) badRequest(res, 'Parameters missing');

    if (debug) console.log('Trying to create a new playlist', b);

    PlaylistModel.findOneOrCreate(b.user, b.name, b.type);

    res.status(201).send('added the playlist');
}

export async function addSongToPlaylist(req: any, res: any, db: Database, debug: boolean): Promise<void> {
    const b: any = req.body;

    if (!b.songID || !b.playlistID || !b.user) badRequest(res, 'Parameters missing');

    if (debug) console.log('Trying to add a song to a playlist', b);

    let songExists: boolean = false;
    let songType: string = '';

    await SongModel.findBySongID(b.songID).then(data => {
        if (data.length === 0) {
            songExists = false;
        } else {
            songType = data[0].type;
            songExists = !!data.length; // Not really usefull, but i like this syntax
        }
    })

    if (!songExists) {
        return badRequest(res, 'Song does not exist in database');
    }

    await PlaylistModel.findById(b.playlistID).then(data => {
        if (data.playlist.includes(b.songID) && !data.settings.duplicates) {
            return res.status(200).send('Duplicates are not allowed');
        }

        if ((!data.settings.allowMP3 && data.type === 'mp3') ||
            (!data.settings.allowSpotify && data.type === 'spotify') ||
            (!data.settings.allowYoutube && data.type === 'youtube')) {
            return badRequest(res, 'That song type is not allowed in this playlist');
        }

        data.addSong(b.songID)
        res.status(201).send('added to the playlist');
    })
}