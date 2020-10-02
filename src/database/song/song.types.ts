import { Document, Model } from 'mongoose';

export interface ISong {
    title: String,
    artist: String,
    type: String,
    length: Number,
    songId: String
}

export interface ISongDocument extends ISong, Document { }

export interface ISongModel extends Model<ISongDocument> { 
    findBySongID: (
        this: ISongModel,
        songID: string
    ) => Promise<ISongDocument[]>
}