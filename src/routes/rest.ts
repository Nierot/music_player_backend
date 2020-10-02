import Database from '../database/database';
import { PlaylistModel } from '../database/playlist/playlist.model';

export async function addSong(req: any, res: any, db: Database): Promise<void> {
    res.send('addSong');
}

export async function newPlaylist(req: any, res: any, db: Database): Promise<void> {
    const b: any = req.body;
    if (!b.name || !b.type || !b.user) {
        return res.status(400).send('Bad request');
    }
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