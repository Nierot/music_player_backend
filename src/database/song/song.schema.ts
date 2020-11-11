import { Schema } from 'mongoose';
import { findBySongID, findBySpotifyID, findByYoutubeID } from './song.statics';

const SongSchema = new Schema({
    title: String,
    artist: String,
    type: String, // type of song (mp3/youtube/spotify)
    length: Number,
    songId: String,
    coverArt: String,
    typeId: String
})

SongSchema.statics.findBySongID = findBySongID;
SongSchema.statics.findBySpotifyID = findBySpotifyID;
SongSchema.statics.findByYoutubeID = findByYoutubeID;

export default SongSchema;