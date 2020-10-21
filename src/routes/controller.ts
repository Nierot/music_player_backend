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

    if (checkRequest(code, res, clients)) clients.get(code).emit('skip');

}

export function previous(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) clients.get(code).emit('previous');

}

export function checkCode(req: any, res: any, clients: Map<string, Socket>): void {

    const code: string = req.body.playerCode;

    if (checkRequest(code, res, clients)) res.status(200).send('ok');

}


function checkRequest(code: any, res: any, clients: Map<string, Socket>): boolean {

    if (code === undefined) {
        res.status(400).send('No code given');
        return false;
    }
    if (!clients.has(code)) {
        res.status(400).send('Client does not exist');
        return false;
    }

    return true;
}