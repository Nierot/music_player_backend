import { Document, Model } from 'mongoose';

export interface ISong {
    title: string,
    artist: string,
    type: 'mp3' | 'youtube' | 'spotify',
    length: number,
    songId: string,
    typeId: string
}

export interface ISongDocument extends ISong, Document { }

export interface ISongModel extends Model<ISongDocument> {
    findByYoutubeID: (
        this: ISongModel,
        youtubeID: string
    ) => Promise<ISongDocument[]>

    findBySongID: (
        this: ISongModel,
        songID: string
    ) => Promise<ISongDocument[]>

    findBySpotifyID: (
        this: ISongModel,
        spotifyID: string
    ) => Promise<ISongDocument[]>
}