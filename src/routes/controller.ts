import { Socket } from 'socket.io';

export function pause(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)){
        clients.get(code).emit('pause');
        res.send('ok');
    }
}

export function skip(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) {
        clients.get(code).emit('skip');
        res.status(200).send('ok');
    }

}

export function previous(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) {
        clients.get(code).emit('previous');
        res.status(200).send('ok');
    }

}

export function checkCode(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) {
        res.status(200).send('ok');
    }

}

export function getCurrentlyPlaying(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) {
        const sock = clients.get(code);

        sock.emit('whatAreYouPlaying', {}, (response: any) => {
            res.status(200).json({ status: 200, message: 'ok', data: response })
        })
    }
}


function checkRequest(code: any, res: any, clients: Map<string, Socket>): boolean {

    if (code === undefined) {
        res.status(400).send('No code given');
        return false;
    } else if (!clients.has(code)) {
        res.status(400).send('Client does not exist');
        return false;
    } else {
        return true;
    }
}