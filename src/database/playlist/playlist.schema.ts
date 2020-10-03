import { Schema } from 'mongoose';
import { findByUser, findOneOrCreate } from './playlist.statics';
import { setLastUpdated, addSong } from './playlist.methods';

const PlaylistSchema = new Schema({
    name: String,
    type: String, // Type of playlist (e.g. public/private)
    user: String, // UserID of the person who made the playlist
    creators: { // Everyone that added to the playlist
        type: Array,
        default: []
    },
    dateCreated: {
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    },
    playlist: { // Array of song IDs that are in this playlist
        type: Array,
        default: []
    },
    settings: {
        type: Object,
        default: {
            duplicates: true,
            maxLength: -1,
            allowYoutube: true,
            allowMP3: true,
            allowSpotify: true
        }
    }
});

PlaylistSchema.statics.findByUser = findByUser;
PlaylistSchema.statics.findOneOrCreate = findOneOrCreate;

PlaylistSchema.methods.setLastUpdated = setLastUpdated;
PlaylistSchema.methods.addSong = addSong;

export default PlaylistSchema;