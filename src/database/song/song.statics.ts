import { ISongDocument, ISongModel } from './song.types';

/**
 * Find a song by its SongID
 * @param songID ID of song to find
 */
export async function findBySongID( this: ISongModel, songID: string ): Promise<ISongDocument[]> {
    return this.find({ songId: songID});
}

export async function findBySpotifyID( this: ISongModel, spotifyID: string): Promise<ISongDocument[]> {
    return this.find({ type: 'spotify', typeData: { id: spotifyID } });
}