import { IPlaylistDocument, IPlaylistModel } from './playlist.types';

/**
 * Find all playlist from one user
 * @param user The user to find
 */
export async function findByUser( this: IPlaylistModel, user: string ): Promise<IPlaylistDocument[]> {
    return this.find({ user });
}

/**
 * Searches for a playlist from the same user with the same name given,
 * if it does not exist it creates a new playlist
 * @param user The ID of the owner of the playlist
 * @param name The name of the playlist
 * @param type The type of the playlist (public/private etc.)
 */
export async function findOneOrCreate( this: IPlaylistModel, user: string, name: string, type: string ): Promise<IPlaylistDocument> {
    const record = await this.findOne({ user, name });
    if (record === null || record.name === name) {
        return this.create({
            user,
            name,
            type,
            creators: [],
            dateCreated: new Date(),
            lastUpdated: new Date(),
            playlist: [],
            settings: {
                duplicates: true,
                maxLength: -1,
                allowYoutube: true,
                allowMP3: true,
                allowSpotify: true
            }
        })
    }
}