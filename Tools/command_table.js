import {pause, play, unpause, stop} from "../Commands/basic_controlls.js";
import {add, queue, skip, playPlaylist, addPlaylist, clear, shuffle} from "../Commands/playlist.js";

export const command_table = {
    "play": play,//!play, !play <link>, !play <song name> play a song from link, search or queue
    "pause": pause,//!pause 
    "unpause": unpause,//!unpause
    "stop": stop,//!stop
    "add": add,//!add <link>, !add <song name> add a song to the queue
    "queue": queue,//!queue show the queue
    "skip": skip,//!skip skip the current song
    "addPlaylist": addPlaylist,//!addPlaylist <link> add a playlist to the end of the queue
    "playPlaylist": playPlaylist,//!playPlaylist <link> play a playlist and add the rest to the start of queue
    "clear": clear,//!clear clear the queue
    "shuffle": shuffle,//!shuffle shuffle the queue
};