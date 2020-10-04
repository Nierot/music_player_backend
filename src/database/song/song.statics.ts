import { ISongDocument, ISongModel } from './song.types';

/**
 * Find a song by its SongID
 * @param songID ID of song to find
 */
export async function findBySongID( this: ISongModel, songID: string ): Promise<ISongDocument[]> {
    return this.find({ songId: songID});
}

/**
 * Find a spotify song in the database by its SpotifyID
 * @param spotifyID ID to find.
 */
export async function findBySpotifyID( this: ISongModel, spotifyID: string): Promise<ISongDocument[]> {
    return this.find({ type: 'spotify', typeId: spotifyID });
}

/**
 * Find a youtube video in the database
 * @param youtubeID string of the ID of the youtube video
 */
export async function findByYoutubeID( this: ISongModel, youtubeID: string): Promise<ISongDocument[]> {
    return this.find({ type: 'youtube', typeid: youtubeID });
}