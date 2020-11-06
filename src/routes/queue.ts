import { PlaylistModel } from '../database/playlist/playlist.model';

export async function getQueue(req: any, res: any): Promise<void> {
    if (!req.queue || !req.queue.playlist) return res.status(400).json({ error: 'playlist missing' })
    return PlaylistModel
        .find({  })
        .lean()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).send(err))
}

export function finished(data: any): void {
    console.log(data)
}