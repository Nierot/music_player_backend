import { RSA_NO_PADDING } from 'constants';
import fetch from 'node-fetch';

const CLIENT_ID = '5bf6a2aacb4d46e9bebec0f9453a7781';

export async function checkSpotifyCode(req: any, res: any): Promise<void> {
    const formEncoded: string = generateAuthForm(req.body.code, req.body.code_verifier, req.body.redirect_uri)

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        // @ts-expect-error
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formEncoded
    }).then(async data => res.send(await data.json()))
}


export async function refreshSpotifyCode(req:any, res:any): Promise<void> {
    const formEncoded: string = generateRefreshForm(req.body.refresh_token);

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        // @ts-expect-error
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formEncoded
    }).then(async data => res.send(await data.json()))
}


function generateAuthForm(code: string, verifier: string, redirectUri: string): string {
    return new URLSearchParams({
        'code': code,
        'code_verifier': verifier,
        'redirect_uri': redirectUri,
        'client_id': CLIENT_ID,
        'grant_type': 'authorization_code'
    }).toString()
}

function generateRefreshForm(refresh: string): string {
    return new URLSearchParams({
        'refresh_token': refresh,
        'client_id': CLIENT_ID,
        'grant_type': 'refresh_token'
    }).toString()
}