import { PlaylistModel } from '../database/playlist/playlist.model';
import shuffle from '../lib/shuffle';

export async function makeQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>, alreadyPlayed: Map<string, object[]>, sinceLastEvent: Map<string, number>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    if (!req.query.events || !req.query.listOfPeople || !req.query.songsBetweenEvents) return res.status(400).json({ status: 400, message: 'event parameters missing'});

    const playlist: string = req.query.p;
    const events: boolean = req.query.events == 'true';
    const people: string[] = req.query.listOfPeople.split(',');
    let songsBetweenEvents: number = -1;
    if (events) {
        songsBetweenEvents = Number.parseInt(req.query.songsBetweenEvents, 10);
    }

    if (isNaN(songsBetweenEvents)) return res.status(500).json({ status: 500, message: 'not an int' });

    eventSettings.set(playlist, { people, songsBetweenEvents })

    console.log('Generating new Queue for ' + playlist);

    const newQueue: object[] = await generateQueue(queue, playlist, eventSettings, alreadyPlayed, sinceLastEvent);
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

export async function getQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>, alreadyPlayed: Map<string, object[]>, sinceLastEvent: Map<string, number>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, message: 'playlist missing' });

    const playlist: string = req.query.p;
    const currentQueue: object[] = queue.get(playlist);

    if (!eventSettings.get(playlist)) return res.status(400).json({ status: 400, message: 'call /queue/generate first'})

    if (!currentQueue || currentQueue.length === 0) queue.set(playlist, await generateQueue(res, playlist, eventSettings, alreadyPlayed, sinceLastEvent));

    res.status(200).json({ status: 200, message: 'ok', queue: queue.get(playlist) });
}

export async function nextInQueue(req: any, res: any, queue: Map<string, object[]>, eventSettings: Map<string, object>, alreadyPlayed: Map<string, object[]>, sinceLastEvent: Map<string, number>): Promise<void> {
    if (!req.query || !req.query.p) return res.status(400).json({ status: 400, error: 'playlist missing' })

    const playlist: string = req.query.p;
    let currentQueue: object[] = queue.get(playlist);

    if (!eventSettings.get(playlist)) return res.status(400).json({ status: 400, message: 'call /queue/generate first'})

    if (!currentQueue || currentQueue.length === 0) {
        alreadyPlayed.set(playlist, []);
        queue.set(playlist, await generateQueue(queue, playlist, eventSettings, alreadyPlayed, sinceLastEvent));
    }
    currentQueue = queue.get(playlist);
    const next = currentQueue.shift();
    const previouslyPlayed = alreadyPlayed.get(playlist) || [];
    previouslyPlayed.push(next);
    alreadyPlayed.set(playlist, previouslyPlayed);

    // @ts-expect-error
    if (next.songID === 'event') {
        sinceLastEvent.set(playlist, 0);
    } else {
        let x = sinceLastEvent.get(playlist);
        if (!x) x = 0;
        sinceLastEvent.set(playlist, x + 1);
    }

    res.status(200).json({ status: 200, message: 'ok', next })

}

export async function generateQueue(queue: Map<string, object[]>, playlist: string, eventSettings: Map<string, object>, alreadyPlayed: Map<string, object[]>, sinceLastEvent: Map<string, number>): Promise<object[]> {

    const newQueue: object[] = await getShuffledQueue(queue, playlist);
    const queueWithEvents: object[] = [];
    // @ts-expect-error
    const songsBetweenEvents: number = eventSettings.get(playlist).songsBetweenEvents;
    const songsSinceLastEvent: number = sinceLastEvent.get(playlist);
    let oldEventAccountedFor: boolean = false;

    if (songsBetweenEvents === -1) oldEventAccountedFor = true; // events disabled

    let i = 0;
    const previouslyPlayed: object[] = alreadyPlayed.get(playlist);

    newQueue.forEach(x => {
        if (previouslyPlayed && hasSongBeenPlayedBefore(x, previouslyPlayed)) {
            i--;
        } else if (!oldEventAccountedFor && (songsSinceLastEvent >= songsBetweenEvents || i === songsBetweenEvents - songsSinceLastEvent)) {
            queueWithEvents.push({ songID: 'event', user: 'Event' });
            queueWithEvents.push(x);
            oldEventAccountedFor = true;
        } else if (i === songsBetweenEvents) {
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

function hasSongBeenPlayedBefore(song: object, alreadyPlayed: object[]): boolean {
    // @ts-expect-error
    return alreadyPlayed.filter(e => e.songID === song.songID).length > 0;
}

async function getShuffledQueue(queue: Map<string, object[]>, playlist: string): Promise<object[]> {
    const oof = await PlaylistModel.findById(playlist).exec();
    if (!oof) return [];
    return shuffle(oof.playlist);
}