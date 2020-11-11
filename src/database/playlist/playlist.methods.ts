import { IPlaylistDocument } from './playlist.types';

/**
 * Updates the lastUpdated field
 */
export async function setLastUpdated(this: IPlaylistDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

/**
 * Adds a song to given playlist and updates lastUpdated field
 * @param songID string
 * @requires songID to be in the database
 */
export async function addSong(this: IPlaylistDocument, songObject: object): Promise<void> {
    // TODO check settings
    this.playlist.push(songObject);
    await this.setLastUpdated();
    await this.save();
}