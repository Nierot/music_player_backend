import { Schema } from 'mongoose';
import { findBySongID, findBySpotifyID } from './song.statics';

const SongSchema = new Schema({
    title: String,
    artist: String,
    type: String, // type of song (mp3/youtube/spotify)
    length: Number,
    songId: String,
    typeData: Object // Object that contains data for the specific song type
    // mp3: { path: Path }
    // youtube: { id: String }
    // spotify: { id: String }
})

SongSchema.statics.findBySongID = findBySongID;
SongSchema.statics.findBySpotifyID = findBySpotifyID;

export default SongSchema;