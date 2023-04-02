import {pause, play, unpause, stop} from '../commands/basic_controlls.js'
import {add, queue, skip, playPlaylist, addPlaylist, clear, shuffle} from '../commands/playlist.js';

const command_table = [
    pause,
    play,
    unpause,
    stop,
    add,
    queue,
    skip,
    play_playlist,
    add_playlist,
    clear,
    shuffle,
]
module.exports = {command_table};