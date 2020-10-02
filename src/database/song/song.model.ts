import { model } from 'mongoose';
import { ISongDocument } from './song.types';
import SongSchema from './song.schema';

export const SongModel = model<ISongDocument>('song', SongSchema);