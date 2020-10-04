import { Schema } from 'mongoose';
import { findBySongID, findBySpotifyID, findByYoutubeID } from './song.statics';

const SongSchema = new Schema({
    title: String,
    artist: String,
    type: String, // type of song (mp3/youtube/spotify)
    length: Number,
    songId: String,
    typeId: String // Object that contains data for the specific song type
                     // mp3: nothing
                     // youtube: { id: String }
                     // spotify: { id: String }
})

SongSchema.statics.findBySongID = findBySongID;
SongSchema.statics.findBySpotifyID = findBySpotifyID;
SongSchema.statics.findByYoutubeID = findByYoutubeID;

export default SongSchema;