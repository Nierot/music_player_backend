import { IPlaylistDocument, IPlaylistModel } from './playlist.types';

/**
 * Find a playlist by its mongodb ID
 * @param id The ID to search
 */
export async function findByID( this: IPlaylistModel, id: String ): Promise<IPlaylistDocument[]> {
    return this.find({ _id: id });
}

/**
 * Find all playlist from one user
 * @param user The user to find 
 */
export async function findByUser( this: IPlaylistModel, user: String): Promise<IPlaylistDocument[]> {
    return this.find({ user: user });
}

/**
 * Searches for a playlist from the same user with the same name given,
 * if it does not exist it creates a new playlist
 * @param user The ID of the owner of the playlist
 * @param name The name of the playlist
 * @param type The type of the playlist (public/private etc.)
 */
export async function findOneOrCreate( this: IPlaylistModel, user: String, name: String, type: String): Promise<IPlaylistDocument> {
    const record = await this.findOne({ user: user, name: name });
    if (record.name === name) {
        return record;
    } else {
        return this.create({
            user: user,
            name: name,
            type: type,
            creators: [ user ],
            dateCreated: new Date(),
            lastUpdated: new Date(),
            playlist: []
        })
    }
}