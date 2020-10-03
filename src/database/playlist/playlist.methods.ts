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