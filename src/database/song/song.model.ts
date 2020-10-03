import { model } from 'mongoose';
import { ISongDocument, ISongModel } from './song.types';
import SongSchema from './song.schema';

export const SongModel = model<ISongDocument, ISongModel>('song', SongSchema);
