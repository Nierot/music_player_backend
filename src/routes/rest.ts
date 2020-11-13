import { PlaylistModel } from '../database/playlist/playlist.model';
import { SongModel } from '../database/song/song.model';
import crypto from 'crypto';
// @ts-expect-error
import { song_types, youtube_download_url } from '../settings.js';
import Axios from 'axios';

export async function addSong(req: any, res: any): Promise<void> {
    const b: any = req.body;

    if (!b.title || !b.artist || !b.type || !b.length || !b.typeData) return badRequest(res, 'parameters missing');
    if (!song_types.includes(b.type)) return badRequest(res, 'type incorrect');
    if ((b.type === 'spotify' || b.type === 'youtube') && !b.typeData.id) return badRequest(res, 'typeData incorrect, id missing');

    console.log('Trying to add a song: ', b);

    let alreadyInDatabase: boolean = false;
    let songID: string;

    if (b.type === 'spotify') {
        await SongModel.findBySpotifyID(b.typeData.id).then(data => {
            if (data.length !== 0) {
                alreadyInDatabase = true;
                songID = data[0].songId;
            }
        })
    }

    if (b.type === 'youtube') {
        await SongModel.findByYoutubeID(b.typeData.id).then(async data => {
            if (data.length !== 0) {
                alreadyInDatabase = true;
                songID = data[0].songId;
            } else {
                await downloadYoutube(b.typeData.id);
            }
        })
    }

    if (!alreadyInDatabase) await SongModel.create({
        length: b.length || 0,
        title: b.title,
        artist: b.artist,
        coverArt: b.coverArt || undefined,
        type: b.type,
        songId: crypto.randomBytes(6).toString('base64').replace('/', '-'), // Generate a random ID
        typeId: b.typeData.id
    }).then(data => res.status(201).send(data.songId))
    else {
        res.status(200).send(songID);
        console.log('Song already in database');
    }
}

async function downloadYoutube(id: string): Promise<void> {
    Axios
        .post(youtube_download_url, { id })
        .catch(console.error)
}

export async function getSongInfo(req: any, res: any): Promise<void> {
    const songID: string = req.query.song;

    if (!songID) return badRequest(res, 'no songID given')

    if (songID === 'event') {
        return res.status(200).json({ status: 200, message: 'ok', song: {
            type: 'event'
        }})
    }

    SongModel.findBySongID(songID)
        .then(data => res.status(200).json({ status: 200, message: 'ok', song: data[0] }))
        .catch(err => res.status(500).json({ status: 500, message: 'server error', err }))
}


function badRequest(res: any, reason: string): void {
    return res.status(400).send(`Bad Request: ${reason}`)
}

export async function newPlaylist(req: any, res: any): Promise<void> {
    const b: any = req.body;

    if (!b.name || !b.type || !b.user) return badRequest(res, 'Parameters missing');

    console.log('Trying to create a new playlist', b);

    const playlist = PlaylistModel.findOneOrCreate(b.user, b.name, b.type);

    console.log(playlist);

    res.status(201).send('added the playlist');
}

export async function addSongToPlaylist(req: any, res: any): Promise<void> {
    const b: any = req.body;

    if (!b.songID || !b.playlistID || !b.user) return badRequest(res, 'Parameters missing');

    console.log('Trying to add a song to a playlist', b);

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

    if (!songExists) return badRequest(res, 'Song does not exist in database');


    await PlaylistModel.findById(b.playlistID).then(data => {
        if (data.playlist.includes(b.songID) && !data.settings.duplicates) {
            return res.status(200).send('Duplicates are not allowed');
        }

        if ((!data.settings.allowMP3 && data.type === 'mp3') ||
            (!data.settings.allowSpotify && data.type === 'spotify') ||
            (!data.settings.allowYoutube && data.type === 'youtube')) {
            return badRequest(res, 'That song type is not allowed in this playlist');
        }

        if (!data.creators.includes(b.user)) data.creators.push(b.user);

        data.addSong({ songID: b.songID, user: b.user });
        res.status(201).send('added to the playlist');
    })
}

export async function playlistExists(req: any, res: any): Promise<void> {
    let exists: boolean;

    exists = await PlaylistModel.exists({ _id: req.body.playlistID }).catch(err => exists = false)

    res.status(200).json({ exists })
}

export async function getAllPublicLists(req: any, res: any): Promise<void> {
    await PlaylistModel
        .find({ type: 'public' })
        .lean()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
}

export async function getOwnPlaylist(req: any, res: any): Promise<void> {
    if (!req.query || !req.query.user) return badRequest(res, 'no user given');
    await PlaylistModel
        .find({ user: req.query.user })
        .lean()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err))
}