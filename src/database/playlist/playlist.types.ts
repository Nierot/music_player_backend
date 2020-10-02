import { Document, Model } from "mongoose";

export interface IPlaylist {
    name: String,
    type: String,
    user: String,
    creators: Array<String>,
    dateCreated: Date,
    lastUpdated: Date,
    playlist: Array<number>
}

export interface IPlaylistDocument extends IPlaylist, Document { 
    setLastUpdated: (this: IPlaylistDocument) => Promise<void>;
}

export interface IPlaylistModel extends Model<IPlaylistDocument> {
    findOneOrCreate: (
        this: IPlaylistModel,
        user: String,
        name: String,
        type: String
    ) => Promise<IPlaylistDocument>;

    findByUser: (
        this: IPlaylistModel,
        user: String
    ) => Promise<IPlaylistDocument[]>;

    findByID: (
        this: IPlaylistModel,
        id: String
    ) => Promise<IPlaylistDocument[]>;
}