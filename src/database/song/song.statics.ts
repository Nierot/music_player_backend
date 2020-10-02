import { ISongDocument, ISongModel } from './song.types';

/**
 * Find a song by its SongID
 * @param songID ID of song to find
 */
export async function findBySongID( this: ISongModel, songID: string ): Promise<ISongDocument[]> {
    return this.find({ songID: songID});
}