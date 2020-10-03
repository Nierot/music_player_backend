import { Document, Model } from 'mongoose';

export interface ISong {
    title: string,
    artist: string,
    type: 'mp3' | 'youtube' | 'spotify',
    length: number,
    songId: string,
    typeData: object
}

export interface ISongDocument extends ISong, Document { }

export interface ISongModel extends Model<ISongDocument> {
    findBySongID: (
        this: ISongModel,
        songID: string
    ) => Promise<ISongDocument[]>

    findBySpotifyID: (
        this: ISongModel,
        spotifyID: string
    ) => Promise<ISongDocument[]>
}