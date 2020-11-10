import { PlaylistModel } from '../database/playlist/playlist.model';
import shuffle from '../lib/shuffle';

export async function getQueue(req: any, res: any, queue: Map<string, string[]>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    const playlist: string = req.query.p;
    const currentQueue: string[] = queue.get(playlist);

    if (!currentQueue || currentQueue.length === 0) queue.set(playlist, await generateQueue(res, playlist));

    res.status(200).json({ status: 200, message: 'ok', queue: queue.get(playlist) });
}

export async function nextInQueue(req: any, res: any, queue: Map<string, string[]>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, error: 'playlist missing' })

    const playlist: string = req.query.p;
    let currentQueue: string[] = queue.get(playlist);

    if (!currentQueue || currentQueue.length === 0) queue.set(playlist, await generateQueue(queue, playlist));

    currentQueue = queue.get(playlist);
    const next = currentQueue.shift();

    res.status(200).json({ status: 200, message: 'ok', next})

}

async function generateQueue(queue: Map<string, string[]>, playlist: string): Promise<string[]> {
    const oof = await PlaylistModel.findById(playlist).exec();
    return shuffle(oof.playlist);
}

export function finished(data: any): void {
    console.log(data)
}