import { Schema } from 'mongoose';

const SongSchema = new Schema({
    title: String,
    artist: String,
    type: String, // type of song (mp3/youtube/spotify)
    length: Number,
    songId: String
})

export default SongSchema;