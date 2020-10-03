import { model } from "mongoose";
import { IPlaylistDocument, IPlaylistModel } from "./playlist.types";
import PlaylistSchema from "./playlist.schema";

export const PlaylistModel = model<IPlaylistDocument, IPlaylistModel>("playlist", PlaylistSchema);