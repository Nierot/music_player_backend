import { model } from "mongoose";
import { IPlaylistDocument } from "./playlist.types";
import PlaylistSchema from "./playlist.schema";

export const PlaylistModel = model<IPlaylistDocument>("playlist", PlaylistSchema);