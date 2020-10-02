import { Document, Model } from "mongoose";

export interface IPlaylist {
    name: string,
    type: string,
    user: string,
    creators: string[],
    dateCreated: Date,
    lastUpdated: Date,
    playlist: number[]
}

export interface IPlaylistDocument extends IPlaylist, Document {
    setLastUpdated: (this: IPlaylistDocument) => Promise<void>;
}

export interface IPlaylistModel extends Model<IPlaylistDocument> {
    findOneOrCreate: (
        this: IPlaylistModel,
        user: string,
        name: string,
        type: string
    ) => Promise<IPlaylistDocument>;

    findByUser: (
        this: IPlaylistModel,
        user: string
    ) => Promise<IPlaylistDocument[]>;

    findByID: (
        this: IPlaylistModel,
        id: string
    ) => Promise<IPlaylistDocument[]>;
}