import { PlaylistModel } from '../database/playlist/playlist.model';
import shuffle from '../lib/shuffle';

export async function makeQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    if (!req.query.events || !req.query.listOfPeople || !req.query.songsBetweenEvents) return res.status(400).json({ status: 400, message: 'event parameters missing'});

    const playlist: string = req.query.p;
    const events: boolean = req.query.events == 'true';
    const people: string[] = req.query.listOfPeople.split(',');
    const songsBetweenEvents: number = Number.parseInt(req.query.songsBetweenEvents, 10);

    if (isNaN(songsBetweenEvents)) return res.status(500).json({ status: 500, message: 'not an int' });

    eventSettings.set(playlist, { people, songsBetweenEvents })

    const newQueue: object[] = await generateQueue(queue, playlist, eventSettings);

    queue.set(playlist, newQueue);
    res.status(200).json({ status: 200, message: 'ok', queue: newQueue });
}

export function getPeople(req: any, res: any, eventSettings: Map<string, object>): void {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    let event = eventSettings.get(req.query.p);

    if (!event) event = {
        people: [],
        songsBetweenEvents: -1
    }

    res.status(200).json({ status: 200, message: 'ok', event })
}

export async function getQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    const playlist: string = req.query.p;
    const currentQueue: object[] = queue.get(playlist);

    if (!eventSettings.get(playlist)) return res.status(400).json({ status: 400, message: 'call /queue/generate first'})

    if (!currentQueue || currentQueue.length === 0) queue.set(playlist, await generateQueue(res, playlist, eventSettings));

    res.status(200).json({ status: 200, message: 'ok', queue: queue.get(playlist) });
}

export async function nextInQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, error: 'playlist missing' })

    const playlist: string = req.query.p;
    let currentQueue: object[] = queue.get(playlist);

    if (!eventSettings.get(playlist)) return res.status(400).json({ status: 400, message: 'call /queue/generate first'})

    if (!currentQueue || currentQueue.length === 0) queue.set(playlist, await generateQueue(queue, playlist, eventSettings));

    currentQueue = queue.get(playlist);
    const next = currentQueue.shift();

    res.status(200).json({ status: 200, message: 'ok', next })

}

async function generateQueue(queue: Map<string, object[]>, playlist: string, eventSettings: Map<string, object>): Promise<object[]> {

    const newQueue: object[] = await getShuffledQueue(queue, playlist);
    const queueWithEvents: object[] = [];
    // @ts-expect-error
    const songsBetweenEvents = eventSettings.get(playlist).songsBetweenEvents;
    let i = 0;

    newQueue.forEach(x => {
        if (i === songsBetweenEvents) {
            queueWithEvents.push({ songID: 'event', user: 'Event' });
            queueWithEvents.push(x);
            i = 0;
        } else {
            queueWithEvents.push(x);
        }
        i++;
    })

    return queueWithEvents;
}

async function getShuffledQueue(queue: Map<string, object[]>, playlist: string): Promise<object[]> {
    const oof = await PlaylistModel.findById(playlist).exec();
    if (!oof) return [];
    return shuffle(oof.playlist);
}